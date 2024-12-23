// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

library TradeDirection {
  enum Direction {
    AtoB,
    BtoA
  }

  function inverse(Direction value) public pure returns (Direction) {
    return value == Direction.AtoB ? Direction.BtoA : Direction.AtoB;
  }
}
