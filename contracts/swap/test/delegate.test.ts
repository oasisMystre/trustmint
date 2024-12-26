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

async function deployXonoContract() {
  const xono = await hre.viem.deployContract("Xono");

  return [xono] as const;
}

async function deployERC20Contract() {
  const token = await hre.viem.deployContract("Mint", ["Test", "Tst", false]);

  return [token];
}

describe("TrustMint delegate test", () => {
  let account: Address;
  let client: PublicClient;

  before(async () => {
    await loadFixture(deployXonoContract);
    await loadFixture(deployERC20Contract);

    const [signer] = await hre.ethers.getSigners();
    account = signer.address as Address;
    client = await hre.viem.getPublicClient();
  });

  it("deploy xono contract", async () => {
    const [xono] = await loadFixture(deployXonoContract);

    expect(xono.address).not.eq(zeroAddress);
  });

  it("wrap some eth to xono contract", async () => {
    const [xono] = await loadFixture(deployXonoContract);
    const amount = await xono.read.constraintAmountTrigger();
    const [signer] = await hre.ethers.getSigners();
    await signer.sendTransaction({
      to: xono.address,
      from: account,
      data: null,
      value: amount,
    });

    const wrappedBalance = await xono.read.balanceOf([account]);
    expect(wrappedBalance).to.equal(amount);
  });

  it("vote with maximum vote and trigger vote constraint", async () => {
    const [xono] = await loadFixture(deployXonoContract);
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

    const events = parseEventLogs({
      logs: reciept.logs,
      abi: xono.abi,
      eventName: "VoteConstraintReached",
    });

    expect(events.length).to.greaterThan(0);
  });
});
