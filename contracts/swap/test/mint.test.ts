import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

describe("Xono swap contract", () => {
  let account: `0x${string}`;
  let client: Awaited<ReturnType<(typeof hre)["viem"]["getPublicClient"]>>;
  let wallet: Awaited<ReturnType<(typeof hre)["ethers"]["getSigners"]>>[number];

  before(async () => {
    [wallet] = await hre.ethers.getSigners();
    account = wallet.address as any;

    client = await hre.viem.getPublicClient();
  });

  async function deploy() {
    const xono = await hre.viem.deployContract("Xono", [
      "v2",
      "TrustMint",
      "TMT",
      "https://trustmint.fun/metadata.json",
      1n,
      10n,
    ]);

    await xono.write.createMint([
      "Pepe",
      "Pepe",
      "https://pepe.com/metadata.json",
    ]);

    const [
      {
        args: { mint: mintAddress },
      },
    ] = await client.getContractEvents({
      address: xono.address,
      abi: xono.abi,
      eventName: "MintCreated",
    });

    const mint = await hre.viem.getContractAt("Mint", mintAddress!);

    return { xono, mint };
  }

  it("Mint and swap using a constant curve", async () => {
    const { xono, mint } = await loadFixture(deploy);
    let ethBalance = await client.getBalance({ address: account });
    await xono.write.wrap({
      value: ethBalance / 2n,
    });

    let nativeTokenBalance = await xono.read.balanceOf([account]);

    expect(nativeTokenBalance).to.equal(ethBalance / 2n);

    await Promise.all([
      xono.write.vote([mint.address, 4n]),
      xono.write.vote([mint.address, 2n]),
      xono.write.vote([mint.address, 4n]),
    ]);

    const [
      {
        args: { pool: poolAddress },
      },
    ] = await client.getContractEvents({
      address: xono.address,
      abi: xono.abi,
      eventName: "PoolCreated",
    });

    expect(await mint.read.trading()).to.equal(true);
    expect(
      await xono.read.getAssetDelegateAmountByAccount([mint.address, account])
    ).to.equal(10n);

    let mintSupply = await mint.read.totalSupply();

    ethBalance = await client.getBalance({ address: account });

    const pool = await hre.viem.getContractAt("Pool", poolAddress!);
    let reserveA = await pool.read.reserveA();
    let reserveB = await pool.read.reserveB();

    expect(reserveA.supply).to.equal(0n);
    expect(reserveB.supply).to.equal(0n);

    let amountOut = await pool.read.getAmountOut([nativeTokenBalance / 2n, 0])
    await xono.write.approve([pool.address, nativeTokenBalance / 2n]);
    await pool.write.swap([nativeTokenBalance / 2n, amountOut, 3, 0]);

    reserveA = await pool.read.reserveA();
    reserveB = await pool.read.reserveB();

    const tokenBBalance = await mint.read.balanceOf([account]);

   amountOut = await pool.read.getAmountOut([tokenBBalance, 1])
    await mint.write.approve([pool.address, tokenBBalance]);
    await pool.write.swap([tokenBBalance, amountOut, 3, 1]);

    reserveA = await pool.read.reserveA();
    reserveB = await pool.read.reserveB();
  });
});
