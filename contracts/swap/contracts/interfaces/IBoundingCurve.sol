// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../libraries/TradeDirection.sol";

interface IBoundingCurve {
  struct Pair {
    bool trading;
    bool migrated;
    address pairId;
    IERC20 baseToken;
    IERC20 quoteToken;
    uint32 reserveRatio;
    uint256 baseTokenVirtualReserve;
    uint256 quoteTokenVirtualReserve;
  }

  event MintEvent(address indexed to);
  event BurnEvent(address indexed from);
  event MigrateEvent(address indexed mint);

  error SlippageError(uint256 slippage, uint256 tolerance);

  function setTrading(bool trading) external;

  function setTradingFeePercentage(uint8 value) external;

  function calculateBaseTokenReturn(
    uint256 amount
  ) external view returns (uint256, uint256);

  function calculateQuoteTokenReturn(
    uint256 amount
  ) external view returns (uint256, uint256);

  function swap(
    uint256 amountIn,
    uint256 amountOut,
    uint8 slippagePercentage,
    TradeDirection.Direction direction
  ) external;
}
