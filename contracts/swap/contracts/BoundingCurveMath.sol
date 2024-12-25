// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/utils/math/Math.sol";

import "./Power.sol";

struct Ratio {
  uint8 x;
  uint8 y;
}

import "hardhat/console.sol";

abstract contract BoundingCurveMath is Power {
  using Math for uint256;

  uint32 private immutable maxReserveRatio = 100;

  function calculatePurchaseReturn(
    uint256 totalSupply,
    uint256 reserveBalance,
    uint32 reserveRatio,
    uint256 depositAmount
  ) internal view returns (uint256) {
    if (reserveRatio == maxReserveRatio)
      return Math.mulDiv(totalSupply, depositAmount, reserveBalance);

    uint baseN = depositAmount + reserveBalance;
    (uint result, uint precision) = power(
      baseN,
      reserveBalance,
      reserveRatio,
      maxReserveRatio
    );

    return ((totalSupply * result) >> precision) - totalSupply;
  }

  function calculateSaleReturn(
    uint256 totalSupply,
    uint256 reserveBalance,
    uint32 reserveRatio,
    uint256 sellAmount
  ) internal view returns (uint256) {
    if (sellAmount == totalSupply) return reserveBalance;
    if (reserveRatio == maxReserveRatio)
      return Math.mulDiv(reserveBalance, sellAmount, totalSupply);
    uint baseD = totalSupply - sellAmount;
    (uint result, uint precision) = power(
      totalSupply,
      baseD,
      maxReserveRatio,
      reserveRatio
    );

    return ((reserveBalance * result) - (reserveBalance << precision)) / result;
  }
}
