// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/utils/math/Math.sol";

import "./Mint.sol";
import "./Asset.sol";
import "./interfaces/INativeMint.sol";

abstract contract NativeMint is INativeMint, Mint {
  uint256 private minimumVoteCount;
  uint256 private maximumDelegateAmount;
  uint256 private minimumTotalDelegateAmount;

  mapping(address asset => Vote) votes;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uri,
    uint256 _minimumVoteCount,
    uint256 _minimumTotalDelegateAmount
  ) Mint(_name, _symbol, _uri, true) {
    minimumVoteCount = _minimumVoteCount;
    minimumTotalDelegateAmount = _minimumTotalDelegateAmount;
    maximumDelegateAmount = Math.ceilDiv(
      _minimumTotalDelegateAmount,
      _minimumVoteCount
    );
  }

  function vote(address _asset, uint256 _amount) external {
    // safe amount
    _amount = Math.min(maximumDelegateAmount, _amount);

    Asset asset = Asset(_asset);

    require(asset.authority() != address(0), "invalid asset type");
    require(asset.authority() == address(this), "invalid asset authority");

    Vote storage sVote = votes[_asset];

    uint256 delegateAmount = this.getAssetDelegateAmountByAccount(
      _asset,
      msg.sender
    );

    // Can be negative number
    int256 amount = delegateAmount + _amount <= maximumDelegateAmount
      ? int256(_amount)
      : int256(maximumDelegateAmount) - int256(delegateAmount + _amount);

    require(amount >= 1, "voting limit reached");

    // type back to non negative number
    _amount = uint256(amount);

    if (delegateAmount == 0) sVote.votersCount += 1;

    sVote.vault[msg.sender] += _amount;
    sVote.totalVaultDelegatedAmount += _amount;

    if (
      sVote.votersCount >= minimumVoteCount &&
      sVote.totalVaultDelegatedAmount >= minimumTotalDelegateAmount
    ) {
      asset.setTrading(true);
      voteConstraintReached(payable(_asset));

      emit AssetTrading(_asset);
    }

    //_transfer(msg.sender, address(this), _amount);

    emit VoteEvent(_asset, msg.sender, _amount);
  }

  function getAssetDelegateAmountByAccount(
    address asset,
    address account
  ) external view returns (uint256) {
    Vote storage sVote = votes[asset];
    return sVote.vault[account];
  }

  function voteConstraintReached(address payable asset) public virtual;
}
