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
      value: await xono.read.CONSTRIANT_AMOUNT_TRIGGER(),
    });

    let hash = await xono.write.createMint(["Test", "Tst"]);

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
      await xono.read.CONSTRIANT_AMOUNT_TRIGGER(),
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

    let amountOut = await token.read.calculateTokenBReturn([amountIn]);
    let hash = await xono.write.approve([token.address, amountIn]);
    await client.waitForTransactionReceipt({ hash });
    await token.write.swap([amountIn, amountOut, 3, 0]);
    console.log(amountOut);
    amountIn = await token.read.calculateTokenAReturn([amountOut]);
    await client.waitForTransactionReceipt({ hash });
    await token.write.swap([amountOut, amountIn, 3, 1]);
    console.log(amountIn);
  });
});