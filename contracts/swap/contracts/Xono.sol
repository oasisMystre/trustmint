// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/utils/math/Math.sol";

import "./Mint.sol";
import "./Delegate.sol";
import "./BoundingCurve.sol";

contract Xono is Mint, Delegate, DelegateConstraint {
  uint8 immutable version = 1.0;

  uint8 public MINIMUM_VOTE = 1;
  uint64 public MAX_VOTE_PER_ADDRESS = 100000000000000000;
  uint256 public CONSTRIANT_AMOUNT_TRIGGER = 1000000000000000000;
  uint256 public CONSTRIANT_DELEGATE_COUNT_TRIGGER =
    CONSTRIANT_AMOUNT_TRIGGER / MAX_VOTE_PER_ADDRESS;

  struct Vote {
    uint256 totalDelegatedAmount;
    mapping(address => uint256) balances;
    address[] constraints;
  }

  event MintCreated(address indexed mint, address indexed creator);

  constructor() Mint("Wrapped ETH", "WETH", true) {}

  function createMint(string memory name, string memory symbol) external {
    Mint mint = new BoundingCurve(name, symbol, 100, address(this));
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

    return delegateAmount >= MINIMUM_VOTE && balance <= MAX_VOTE_PER_ADDRESS;
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
      delegateCount >= CONSTRIANT_DELEGATE_COUNT_TRIGGER ||
      totalDelegatedAmount >= CONSTRIANT_AMOUNT_TRIGGER;

    if (contraintReached) {
      BoundingCurve curve = BoundingCurve(asset);
      curve.setTrading(true);
    }
  }

  receive() external payable {
    if (wrapped) _mint(msg.sender, msg.value);
  }
}
