// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Mint.sol";
import "./BoundingCurveMath.sol";
import "./libraries/TradeDirection.sol";

contract BoundingCurve is Mint, BoundingCurveMath {
  struct Pool {
    address token;
    uint256 virtualReserve;
  }

  struct Pair {
    Pool tokenA;
    Pool tokenB;
    bool trading;
    uint32 reserveRatio;
  }

  Pair public pair;

  event MintEvent(address indexed to);
  event BurnEvent(address indexed from);

  error SlippageError(uint256 slippage, uint256 tolerance);

  constructor(
    string memory Name,
    string memory Symbol,
    uint32 reserveRatio,
    address token0
  ) Mint(Name, Symbol, false) {
    uint256 scale = 10 ** decimals();
    uint256 reserveBalance = 10 * scale;

    pair = Pair(
      Pool(token0, 0),
      Pool(address(this), reserveBalance),
      false,
      reserveRatio
    );

    _mint(msg.sender, 1 * scale);
  }

  function setTrading(bool trading) public {
    require(msg.sender == authority, "invalid authority");
    pair.trading = trading;
  }

  function calculateTokenAReturn(
    uint256 amount
  ) external view returns (uint256) {
    return
      calculateSaleReturn(
        totalSupply(),
        pair.tokenB.virtualReserve,
        pair.reserveRatio,
        amount
      );
  }

  function calculateTokenBReturn(
    uint256 amount
  ) external view returns (uint256) {
    return
      calculatePurchaseReturn(
        totalSupply(),
        pair.tokenB.virtualReserve,
        pair.reserveRatio,
        amount
      );
  }

  function mint(uint256 amount) internal returns (uint256) {
    Mint tokenA = Mint(pair.tokenA.token);
    uint imburseAmount = this.calculateTokenBReturn(amount);

    pair.tokenB.virtualReserve += imburseAmount;
    _mint(msg.sender, imburseAmount);
    tokenA.transferFrom(msg.sender, address(this), amount);

    emit MintEvent(msg.sender);

    return imburseAmount;
  }

  function burn(uint256 amount) internal returns (uint256) {
    Mint tokenA = Mint(pair.tokenA.token);
    uint256 reimburseAmount = this.calculateTokenAReturn(amount);

    pair.tokenB.virtualReserve -= reimburseAmount;
    _burn(msg.sender, amount);
    approve(msg.sender, amount);
    tokenA.transfer(msg.sender, amount);

    emit BurnEvent(msg.sender);

    return reimburseAmount;
  }

  function swap(
    uint256 amountIn,
    uint256 amountOut,
    uint8 slippagePercentage,
    TradeDirection.Direction direction
  ) external {
    require(pair.trading, "This pair is not trading yet");
    require(amountIn > 0, "Invalid amountIn");
    require(
      slippagePercentage > 0,
      "Slippage percentage must be greater than zero"
    );

    uint256 amount;
    if (direction == TradeDirection.Direction.AtoB) amount = mint(amountIn);
    else amount = burn(amountIn);

    uint256 tolerance = Math.mulDiv(amount, slippagePercentage, 100);
    uint256 slippage = amount > amountOut
      ? amount - amountOut
      : amountOut - amount;

    if (amountOut > amountIn && slippage > tolerance)
      revert SlippageError(slippage, tolerance);
  }
}
