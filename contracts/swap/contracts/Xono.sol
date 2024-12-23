// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./Pool.sol";
import "./NativeMint.sol";

import "hardhat/console.sol";

contract Xono is NativeMint {
  string public version;

  address[] private pools;
  address[] private mints;


  constructor(
    string memory _version,
    string memory _name,
    string memory _symbol,
    string memory _uri,
    uint256 _minimumVoteCount,
    uint256 _minimumTotalDelegateAmount
  )
    NativeMint(
      _name,
      _symbol,
      _uri,
      _minimumVoteCount,
      _minimumTotalDelegateAmount
    )
  {
    version = _version;
  }

  event MintCreated(address indexed mint);
  event PoolCreated(
    address indexed pool,
    address indexed tokenA,
    address indexed tokenB
  );

  function createMint(
    string memory name,
    string memory symbol,
    string memory uri
  ) external {
    Mint mint = new Mint(name, symbol, uri, false);
    mints.push(address(mint));

    emit MintCreated(address(mint));
  }

  function voteConstraintReached(address payable asset) public override {
    Mint tokenAMint = Mint(asset);
    address tokenA = address(this);
    address tokenB = address(tokenAMint);

    Pool pool = new Pool(address(this), asset);

    // uint256 tokenBAmount = tokenAMint.balanceOf(address(this));
    // tokenAMint.approve(address(pool), tokenBAmount);
    // pool.addTokenBToReserveB(tokenBAmount);

    pools.push(address(pool));
    emit PoolCreated(address(pool), tokenA, tokenB);
  }
}
