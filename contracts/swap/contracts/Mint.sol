// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";

contract Mint is ERC20 {
  bool public immutable wrapped;
  address public immutable authority;

  constructor(
    string memory Name,
    string memory Symbol,
    bool Wrapped
  ) ERC20(Name, Symbol) {
    wrapped = Wrapped;
    authority = msg.sender;
  }

  function _update(
    address from,
    address to,
    uint256 value
  ) internal virtual override {
    if (wrapped) {
      super._update(from, to, value);
      if (from == address(0)) payable(to).transfer(value);

      return;
    }

    super._update(from, to, value);
  }

  function burn(address owner, uint256 amount) external {
    require(msg.sender == authority, "invalid authority");
    _burn(owner, amount);
  }
}
