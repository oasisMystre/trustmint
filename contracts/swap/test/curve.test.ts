import hre from "hardhat";
import { Address, parseEventLogs } from "viem";
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
      value:
        10000000000000000000n +
        100000000000000000000n +
        (await xono.read.constraintAmountTrigger()),
    });

    let hash = await xono.write.createMint([
      "Test",
      "Tst",
      "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3",
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

  it("swap", async () => {
    const [xono, token, client, account] = await loadFixture(loadPresets);
    // let balance = await xono.read.balanceOf([account]);
    let amountIn = await token.read.maximumMarketCap();

    let [, amountOut] = await token.read.calculateQuoteTokenReturn([amountIn]);
    let hash = await xono.write.approve([token.address, amountIn]);
    await client.waitForTransactionReceipt({ hash });
    await token.write.swap([amountIn, amountOut, 3, 0]);
    // [, amountIn] = await token.read.calculateBaseTokenReturn([amountOut]);
    // await client.waitForTransactionReceipt({ has  h });
    // await token.write.swap([amountOut, amountIn, 3, 1]);
  });
});
