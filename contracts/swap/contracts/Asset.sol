// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IAsset.sol";

abstract contract Asset is IAsset {
  bool public listed;
  bool public trading;
  address public immutable authority;

  constructor() {
    listed = false;
    trading = false;
    authority = msg.sender;
  }

  function setListed(bool _listed) external {
    require(msg.sender == authority, "Only mint creator can set this param");
    listed = _listed;
  }

  function setTrading(bool _trading) external {
    require(msg.sender == authority, "Only mint creator can set this param");
    trading = _trading;
  }
}
