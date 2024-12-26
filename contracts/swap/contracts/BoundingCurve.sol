// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "./Mint.sol";
import "./BoundingCurveMath.sol";
import "./interfaces/IBoundingCurve.sol";
import "./libraries/TradeDirection.sol";

contract BoundingCurve is IBoundingCurve, Mint, BoundingCurveMath {
  Pair public pair;
  uint256 public tradeFeePercentage = 1;
  uint256 public maximumMarketCap = 10 * 10e18;

  IUniswapV2Factory uniswapV2Factory;
  IUniswapV2Router02 uniswapV2Router;

  constructor(
    string memory Name,
    string memory Symbol,
    address baseToken,
    uint32 reserveRatio,
    address uniswapRouterContract
  ) Mint(Name, Symbol, false) {
    uniswapV2Router = IUniswapV2Router02(uniswapRouterContract);
    uniswapV2Factory = IUniswapV2Factory(uniswapV2Router.factory());

    uint256 scale = 10 ** decimals();
    uint256 reserveBalance = 1 * scale;

    pair = Pair(
      false,
      false,
      address(0),
      IERC20(baseToken),
      IERC20(address(this)),
      reserveRatio,
      0,
      reserveBalance
    );

    _mint(msg.sender, reserveBalance);
  }

  function setTrading(bool trading) public {
    require(msg.sender == authority, "invalid authority");
    pair.trading = trading;
  }

  function calculateBaseTokenReturn(
    uint256 amount
  ) external view returns (uint256, uint256) {
    uint saleReturn = calculateSaleReturn(
      totalSupply(),
      pair.quoteTokenVirtualReserve,
      pair.reserveRatio,
      amount
    );

    uint256 fee = (saleReturn * tradeFeePercentage) / 100;

    return (fee, saleReturn - fee);
  }

  function calculateQuoteTokenReturn(
    uint256 amount
  ) external view returns (uint256, uint256) {
    uint256 purchaseReturn = calculatePurchaseReturn(
      totalSupply(),
      pair.quoteTokenVirtualReserve,
      pair.reserveRatio,
      amount
    );
    uint256 fee = (purchaseReturn * tradeFeePercentage) / 100;

    return (fee, purchaseReturn - fee);
  }

  function mint(uint256 amount) internal returns (uint256) {
    (uint256 fee, uint256 imburseAmount) = this.calculateQuoteTokenReturn(
      amount
    );

    pair.baseTokenVirtualReserve += amount;
    pair.quoteTokenVirtualReserve += imburseAmount;

    _mint(msg.sender, fee + imburseAmount); // don't collect fee please, won't implement collectFee for all tokens

    pair.baseToken.transferFrom(msg.sender, address(this), amount);

    emit MintEvent(msg.sender);

    return imburseAmount;
  }

  function burn(uint256 amount) internal returns (uint256) {
    (uint256 fee, uint256 reimburseAmount) = this.calculateBaseTokenReturn(
      amount
    );
    pair.baseTokenVirtualReserve -= amount;
    pair.quoteTokenVirtualReserve -= reimburseAmount;

    approve(authority, reimburseAmount);

    _burn(msg.sender, amount);
    pair.baseToken.transfer(authority, fee);
    pair.baseToken.transfer(msg.sender, reimburseAmount);

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

    uint256 marketCap = pair.baseTokenVirtualReserve;

    if (marketCap >= maximumMarketCap && !pair.migrated) {
      uint256 tokenABalance = pair.baseToken.balanceOf(address(this));
      uint256 tokenBBalance = pair.quoteTokenVirtualReserve;

      _mint(authority, tokenBBalance);

      pair.migrated = true;
      address pairId = uniswapV2Factory.createPair(
        address(pair.baseToken),
        address(pair.quoteToken)
      );

      uniswapV2Router.addLiquidity(
        address(pair.baseToken),
        address(pair.quoteToken),
        tokenABalance,
        tokenBBalance,
        0,
        0,
        authority,
        block.timestamp
      );

      pair.pairId = pairId;
      emit MigrateEvent(address(this));
    }
  }

  function setMaximumMarketCap(uint8 value) external {
    require(msg.sender == authority, "invalid contract authority");
    maximumMarketCap = value;
  }

  function setTradingFeePercentage(uint8 value) external {
    require(msg.sender == authority, "invalid contract authority");
    tradeFeePercentage = value;
  }
}
