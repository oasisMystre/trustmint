// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./IAsset.sol";

interface IMint is IAsset {
  function wrap() external payable;

  function unwrap(uint256 amount) external;

  receive() external payable;
}
