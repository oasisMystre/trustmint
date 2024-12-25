// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@pythnetwork/pyth-sdk-solidity/PythUtils.sol";

import "./Mint.sol";
import "./BoundingCurve.sol";
import "./TokenGovernance.sol";

contract Xono is Mint, TokenGovernance, DelegateConstraint {
  using Math for uint256;

  uint8 immutable version = 1.0;

  uint8 public maximumVote = 1;
  uint64 public maxVotePerAddress = 10e16;
  uint256 public constraintAmountTrigger = 10e18;
  uint256 public constraintDelegateCountTrigger =
    constraintAmountTrigger.ceilDiv(maxVotePerAddress);

  struct Vote {
    uint256 totalDelegatedAmount;
    mapping(address => uint256) balances;
    address[] constraints;
  }

  event MintCreated(address indexed mint, address indexed creator);

  constructor() Mint("Wrapped ETH", "WETH", true) {}

  function createMint(
    string memory name,
    string memory symbol,
    address pyth
  ) external {
    Mint mint = new BoundingCurve(name, symbol, 100, address(this), pyth);

    Constraint[] memory constraint = new Constraint[](1);
    constraint[0] = Constraint(true, 0, address(this));

    createPoll(address(mint), constraint);

    emit MintCreated(address(mint), msg.sender);
  }

  function canVote(
    address,
    uint256 delegateAmount,
    uint256 balance,
    uint256
  ) external virtual override returns (bool) {
    require(
      msg.sender == address(this),
      "function can't be called outside of contract"
    );

    return delegateAmount >= maximumVote && balance <= maxVotePerAddress;
  }

  function voteConstraintReached(
    address asset,
    uint256 totalDelegatedAmount,
    uint delegateCount,
    uint triggerCount
  ) external virtual override returns (bool contraintReached) {
    require(triggerCount == 0, "trigger can only be called once");
    require(
      msg.sender == address(this),
      "function can't be called outside of contract"
    );

    contraintReached =
      delegateCount >= constraintDelegateCountTrigger ||
      totalDelegatedAmount >= constraintAmountTrigger;

    if (contraintReached) {
      BoundingCurve curve = BoundingCurve(asset);
      curve.setTrading(true);
    }
  }

  receive() external payable {
    if (wrapped) _mint(msg.sender, msg.value);
  }
}
