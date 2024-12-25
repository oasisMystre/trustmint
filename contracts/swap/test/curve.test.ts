import hre, { ethers } from "hardhat";
import { expect } from "chai";
import {
  Address,
  Client,
  parseEventLogs,
  PublicClient,
  zeroAddress,
} from "viem";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

describe("TrustMint curve test", () => {
  async function loadPresets() {
    const xono = await hre.viem.deployContract("Xono");

    const [signer] = await hre.ethers.getSigners();
    const account = signer.address as Address;
    const client = await hre.viem.getPublicClient();

    await signer.sendTransaction({
      to: xono.address,
      from: account,
      data: null,
      value: await xono.read.constraintAmountTrigger(),
    });

    let hash = await xono.write.createMint([
      "Test",
      "Tst",
      "0xDd24F84d36BF92C65F92307595335bdFab5Bbd21",
      "0x0227628f3F023bb0B980b67D528571c95c6DaC1c",
      "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
    ]);

    let reciept = await client.waitForTransactionReceipt({ hash });
    const [
      {
        args: { mint },
      },
    ] = parseEventLogs({
      logs: reciept.logs,
      abi: xono.abi,
      eventName: "MintCreated",
    });

    hash = await xono.write.vote([
      mint,
      await xono.read.constraintAmountTrigger(),
    ]);

    reciept = await client.waitForTransactionReceipt({ hash });

    const token = await hre.viem.getContractAt("BoundingCurve", mint);

    return [xono, token, client, account, signer] as const;
  }

  it("vote with maximum vote and trigger vote constraint", async () => {
    const [xono, token, client, account] = await loadFixture(loadPresets);
    const pair = await token.read.pair();
    let balance = await xono.read.balanceOf([account]);
    let amountIn = balance / 3n;

    let [, amountOut] = await token.read.calculateQuoteTokenReturn([amountIn]);
    let hash = await xono.write.approve([token.address, amountIn]);
    await client.waitForTransactionReceipt({ hash });
    await token.write.swap([amountIn, amountOut, 3, 0]);
    [, amountIn] = await token.read.calculateBaseTokenReturn([amountOut]);
    await client.waitForTransactionReceipt({ hash });
    await token.write.swap([amountOut, amountIn, 3, 1]);
  });
});
