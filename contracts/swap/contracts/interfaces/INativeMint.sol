// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/utils/math/Math.sol";

import "./IMint.sol";

interface INativeMint is IMint {
  struct Vote {
    address asset;
    uint votersCount;
    uint totalVaultDelegatedAmount;
    mapping(address => uint) vault;
  }

  event AssetTrading(address indexed asset);
  event VoteEvent(address indexed asset, address indexed voter, uint256 amount);

  function vote(address _asset, uint256 _amount) external;

  function getAssetDelegateAmountByAccount(
    address asset,
    address account
  ) external view returns (uint256);

  function voteConstraintReached(address payable asset) external;
}
