// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IAsset {
  function setListed(bool listed) external;

  function setTrading(bool trading) external;
}
