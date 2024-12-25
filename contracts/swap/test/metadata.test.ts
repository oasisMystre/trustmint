import hre from "hardhat";
import { expect } from "chai";
import { Address, zeroAddress } from "viem";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

async function deployMetadataContract() {
  const metadataFee = BigInt(Math.pow(10, 10));
  const metadata = await hre.viem.deployContract("Metadata", [metadataFee]);

  return [metadata, metadataFee] as const;
}

async function deployERC20Contract() {
  const token = await hre.viem.deployContract("Mint", [
    "Test Token",
    "TST",
    false,
  ]);

  return [token];
}

describe("TrustMint metadata test", () => {
  before(async () => {
    await loadFixture(deployERC20Contract);
    await loadFixture(deployMetadataContract);
  });

  it("deploy metadata contract", async () => {
    const [metadata, metadataFee] = await loadFixture(deployMetadataContract);

    expect(metadata.address).not.eq(zeroAddress);
    const fee = await metadata.read.fee();
    expect(fee).to.equal(metadataFee);
  });

  it("mutable token metadata", async () => {
    const [signer] = await hre.ethers.getSigners();
    const account = signer.address as Address;
    const [token] = await loadFixture(deployERC20Contract);
    const [metadata] = await loadFixture(deployMetadataContract);
    const name = await token.read.name();
    const symbol = await token.read.symbol();

    await metadata.write.initializeMetadata([
      token.address,
      name,
      symbol,
      "https://asset.trustmint.fun/80/" + token.address,
      true,
      account,
    ]);

    let [testMetadata] = await metadata.read.getMetadatas([[token.address]]);

    expect(testMetadata.name).to.equal(name);
    expect(testMetadata.symbol).to.equal(symbol);
    expect(testMetadata.isMutable).to.equal(true);
    expect(testMetadata.updateAuthority).to.eq(account);

    await metadata.write.updateMetadata([
      token.address,
      "Test updated",
      "TSTU",
      "https://v2.asset.trustmint.fun/70/" + token.address,
      account,
    ]);

    [testMetadata] = await metadata.read.getMetadatas([[token.address]]);

    expect(testMetadata.name).not.to.equal(name);
    expect(testMetadata.symbol).not.to.equal(symbol);
  });
});
