// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IPool.sol";
import "./libraries/TradeDirection.sol";

contract Pool is IPool {
  Pair private pair;
  address public immutable authority;

  uint32 immutable initialPriceDivider = 800000;
  uint8 immutable tokenSellLimitPercent = 80;
  uint128 immutable initialTokenAReserveForPool = 10000000000000000;

  constructor(address _tokenA, address _tokenB) {
    require(_tokenA != address(0), "zero address not allowed");
    require(_tokenB != address(0), "zero address not allowed");
    require(_tokenA != _tokenB, "expect tokenA not equal token B");

    authority = msg.sender;

    pair.reserveA = Reserve(_tokenA, 0);
    pair.reserveB = Reserve(_tokenB, 0);
    pair.virtualReserveA = Reserve(_tokenA, 0);
  }

  function mint(
    uint256 amountIn,
    uint256 amountOut,
    TradeDirection.Direction direction
  ) external {
    if (direction == TradeDirection.Direction.AtoB) {
      pair.reserveA.supply += amountIn;
      pair.reserveB.supply -= amountOut;

      IERC20(pair.reserveB.asset).transfer(msg.sender, amountOut);
      IERC20(pair.reserveA.asset).transferFrom(
        msg.sender,
        address(this),
        amountIn
      );
    } else {
      pair.reserveB.supply += amountIn;
      pair.reserveA.supply -= amountOut;

      IERC20(pair.reserveA.asset).transfer(address(this), amountOut);
      IERC20(pair.reserveB.asset).transferFrom(
        msg.sender,
        address(this),
        amountIn
      );
    }
  }

  function swap(
    uint256 amountIn,
    uint256 amountOut,
    uint8 slippage,
    TradeDirection.Direction direction
  ) external {
    require(amountIn > 0, "Invalid amount");
    require(!pair.listed, "Token already migrated");

    uint256 calculatedAmountOut = getAmountOut(amountIn, direction);
    uint256 deltaChange = (calculatedAmountOut - amountOut);
    uint256 maximumDeltaChange = (amountOut * slippage) / 100;

    if (deltaChange > maximumDeltaChange)
      revert SlippageLimitExceeded("maximum slippage exceeded");

    return this.mint(amountIn, amountOut, direction);
  }

  function addLiquidity(uint256 amount) external {
    IERC20 tokenA = IERC20(pair.reserveA.asset);
    IERC20 tokenB = IERC20(pair.reserveB.asset);

    tokenA.transferFrom(msg.sender, address(this), amount);

    uint256 amountB = tokenB.balanceOf(msg.sender);
    tokenB.transferFrom(msg.sender, address(this), amountB);

    pair.reserveA.supply += amount;
    pair.reserveB.supply += amountB;

    pair.virtualReserveA.supply = amount; // initialized
    pair.virtualReserveB.supply = tokenB.totalSupply(); // initialized
  }

  function removeLiquidity() external {
    require(msg.sender == authority, "Only authority can remove liquidity");

    IERC20 tokenA = IERC20(pair.reserveA.asset);
    IERC20 tokenB = IERC20(pair.reserveB.asset);

    tokenA.transfer(msg.sender, pair.reserveA.supply);
    tokenB.transfer(address(this), pair.reserveB.supply);

    pair.reserveB.supply -=  pair.reserveA.supply;
    pair.reserveB.supply -= pair.reserveB.supply;
  } 

  function getAmountOut(
    uint256 amountIn,
    TradeDirection.Direction direction
  ) public view returns (uint256) {
    uint256 reserveIn;
    uint256 reserveOut;

    if (direction == TradeDirection.Direction.AtoB) {
      reserveIn = pair.reserveA.supply;
      reserveOut = pair.reserveB.supply;
    } else {
      reserveIn = pair.reserveB.supply;
      reserveOut = pair.reserveA.supply;
    }

    uint256 k = reserveIn * reserveOut;
    uint256 newReserveIn = reserveIn + amountIn;
    uint256 newReserveOut = k / newReserveIn;

    return reserveOut - newReserveOut;
  }

  function reserveA() external view returns (Reserve memory) {
    return pair.reserveA;
  }

  function reserveB() external view returns (Reserve memory) {
    return pair.reserveB;
  }
}
