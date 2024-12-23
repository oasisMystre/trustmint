// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./Asset.sol";

contract Mint is ERC20, Asset {
  string public uri;
  bool public wrapped;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uri,
    bool _wrapped
  ) ERC20(_name, _symbol) {
    uri = _uri;
    wrapped = _wrapped;

    if (wrapped) {
      listed = true;
      trading = true;
    } else _mint(authority, type(uint96).max);
  }

  function wrap() external payable {
    require(wrapped, "mint is not wrapped");

    uint256 amount = msg.value;

    _mint(authority, amount);
    _transfer(authority, msg.sender, amount);
  }

  function unwrap(uint256 amount) external {
    require(wrapped, "mint is not wrapped");
    require(amount > 0, "cannot unwrap zero tokens");

    _burn(msg.sender, amount);

    payable(msg.sender).transfer(amount);
  }

  receive() external payable {
    require(wrapped, "cannot accept native token when not wrapped");
    this.wrap();
  }
}
