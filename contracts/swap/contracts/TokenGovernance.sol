// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

abstract contract TokenGovernance {
  struct Constraint {
    bool once;
    uint triggerCount;
    address constraint;
  }

  struct Poll {
    uint flag;
    uint delegateCount;
    Constraint[] constraints;
    uint256 totalDelegatedAmount;
    mapping(address => uint256) balances;
  }

  mapping(address => Poll) votes;

  event VoteConstraintReached(
    address indexed asset,
    address indexed constraint
  );

  function createPoll(address asset, Constraint[] memory constraints) internal {
    Poll storage poll = votes[asset];
    require(poll.flag == 0, "Poll already exist for this asset");

    for (uint index = 0; index < constraints.length; index++)
      poll.constraints.push(constraints[index]);

    poll.flag = 1;
  }

  function vote(address asset, uint256 delegatedAmount) external {
    Poll storage poll = votes[asset];
    require(poll.flag == 1, "Poll does exist for this asset");

    uint256 balance = poll.balances[msg.sender];

    for (uint index = 0; index < poll.constraints.length; index++) {
      DelegateConstraint constraint = DelegateConstraint(
        poll.constraints[index].constraint
      );

      require(
        constraint.canVote(
          msg.sender,
          delegatedAmount,
          balance,
          poll.totalDelegatedAmount
        ),
        "voting constraint at failed"
      );
    }

    if (balance == 0) poll.delegateCount += 1;

    poll.totalDelegatedAmount += delegatedAmount;
    poll.balances[msg.sender] += delegatedAmount;

    for (uint index = 0; index < poll.constraints.length; index++) {
      Constraint memory constraint = poll.constraints[index];

      DelegateConstraint trigger = DelegateConstraint(constraint.constraint);
      if (constraint.once && constraint.triggerCount > 0) continue;

      if (
        trigger.voteConstraintReached(
          asset,
          poll.totalDelegatedAmount,
          poll.delegateCount,
          constraint.triggerCount
        )
      ) emit VoteConstraintReached(asset, constraint.constraint);

      constraint.triggerCount += 1;
    }
  }
}

abstract contract DelegateConstraint {
  function canVote(
    address voter,
    uint256 delegatedAmount,
    uint256 balance,
    uint256 totalDelegatedAmount
  ) external virtual returns (bool);

  function voteConstraintReached(
    address asset,
    uint256 totalDelegatedAmount,
    uint delegateCount,
    uint triggerCount
  ) external virtual returns (bool);
}
