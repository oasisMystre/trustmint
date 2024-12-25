// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";

import "./Mint.sol";
import "./BoundingCurveMath.sol";
import "./libraries/TradeDirection.sol";

import "hardhat/console.sol";

contract BoundingCurve is Mint, BoundingCurveMath {
  struct Pair {
    bool trading;
    IERC20 baseToken;
    IERC20 quoteToken;
    uint32 reserveRatio;
    uint256 baseTokenVirtualReserve;
    uint256 quoteTokenVirtualReserve;
    bytes32 baseTokenUSDPriceFeedId;
  }

  Pair public pair;
  uint256 public tradeFee = 1;
  uint256 public maximumTokenMarketCap = 10000;

  IPyth pyth;
  IUniswapV3Factory uniswapV3Factory;

  event MintEvent(address indexed to);
  event BurnEvent(address indexed from);

  error SlippageError(uint256 slippage, uint256 tolerance);

  constructor(
    string memory Name,
    string memory Symbol,
    address baseToken,
    uint32 reserveRatio,
    address pythContract,
    address uniswapFactoryContract,
    bytes32 baseTokenUSDPriceFeedId
  ) Mint(Name, Symbol, false) {
    pyth = IPyth(pythContract);
    uniswapV3Factory = IUniswapV3Factory(uniswapFactoryContract);

    uint256 scale = 10 ** decimals();
    uint256 reserveBalance = 1 * scale;

    pair = Pair(
      false,
      IERC20(baseToken),
      IERC20(address(this)),
      reserveRatio,
      0,
      reserveBalance,
      baseTokenUSDPriceFeedId
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

    uint256 fee = (saleReturn * tradeFee) / 100;

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
    uint256 fee = (purchaseReturn * tradeFee) / 100;

    return (fee, purchaseReturn - fee);
  }

  function mint(uint256 amount) internal returns (uint256) {
    (uint256 fee, uint256 imburseAmount) = this.calculateQuoteTokenReturn(
      amount
    );

    pair.baseTokenVirtualReserve += amount;
    pair.quoteTokenVirtualReserve += imburseAmount;

    _mint(address(this), fee);
    _mint(msg.sender, imburseAmount);

    pair.baseToken.transferFrom(msg.sender, address(this), amount);

    emit MintEvent(msg.sender);

    return imburseAmount;
  }

  function burn(uint256 amount) internal returns (uint256) {
    (, uint256 reimburseAmount) = this.calculateBaseTokenReturn(amount);
    pair.baseTokenVirtualReserve -= amount;
    pair.quoteTokenVirtualReserve -= reimburseAmount;

    approve(authority, reimburseAmount);

    _burn(msg.sender, amount);
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

    // /// CHECK if coin can be migrated here
    // PythStructs.Price memory price = pyth.getPriceNoOlderThan(
    //   pair.baseTokenUSDPriceFeedId,
    //   60
    // );
    // uint256 tokenAPrice = convertToUint(price.price, price.expo, 18);
    // uint256 boundingCurveValue = pair.baseTokenVirtualReserve * tokenAPrice;
    // if (boundingCurveValue >= maximumTokenMarketCap) {
    //   console.log("Migrated");
    // }
  }

  function convertToUint(
    int64 price,
    int32 expo,
    uint8 targetDecimals
  ) public pure returns (uint256) {
    if (price < 0 || expo > 0 || expo < -255) revert();

    uint8 priceDecimals = uint8(uint32(-1 * expo));

    if (targetDecimals >= priceDecimals) {
      return uint(uint64(price)) * 10 ** uint32(targetDecimals - priceDecimals);
    } else {
      return uint(uint64(price)) / 10 ** uint32(priceDecimals - targetDecimals);
    }
  }
}
