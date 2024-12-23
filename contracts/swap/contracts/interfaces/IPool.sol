// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../libraries/TradeDirection.sol";

interface IPool {
  struct Reserve {
    address asset;
    uint256 supply;
  }

  struct Pair {
    bool listed;
    Reserve reserveA;
    Reserve reserveB;
    Reserve virtualReserveA;
    Reserve virtualReserveB;
  }

  error SlippageLimitExceeded(string message);

  function mint(
    uint256 amountIn,
    uint256 amountOut,
    TradeDirection.Direction direction
  ) external;

  function swap(
    uint256 amountIn,
    uint256 amountOut,
    uint8 slippage,
    TradeDirection.Direction direction
  ) external;

  function addLiquidity(uint256 amount) external;

  function removeLiquidity() external;

  function getAmountOut(
    uint256 amountIn,
    TradeDirection.Direction direction
  ) external view returns (uint256);

  function reserveA() external view returns (Reserve memory);

  function reserveB() external view returns (Reserve memory);
}
