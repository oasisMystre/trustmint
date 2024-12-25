// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IMetadata.sol";

import "hardhat/console.sol";

contract Metadata is IMetadata {
  address private mAuthority;
  uint256 private mMetadataFee;

  constructor(uint256 metadataFee) {
    mAuthority = msg.sender;
    mMetadataFee = metadataFee;
  }

  mapping(address => Metadata) mTokenMetadata;

  event MetadataInitialized(address indexed asset, address indexed creator);

  function initializeMetadata(
    address asset,
    string calldata name,
    string calldata symbol,
    string calldata uri,
    bool isMutable,
    address updateAuthority
  ) external {
    Metadata storage metadata = mTokenMetadata[asset];

    require(
      metadata.updateAuthority == address(0),
      "metadata already initialized"
    );

    mTokenMetadata[asset] = Metadata(
      name,
      symbol,
      uri,
      isMutable,
      updateAuthority
    );

    emit MetadataInitialized(asset, msg.sender);
  }

  function updateMetadata(
    address asset,
    string calldata name,
    string calldata symbol,
    string calldata uri,
    address updateAuthority
  ) external {
    Metadata storage metadata = mTokenMetadata[asset];
    require(metadata.isMutable, "metadata is not mutable");

    metadata.uri = uri;
    metadata.name = name;
    metadata.symbol = symbol;
    metadata.updateAuthority = updateAuthority;
  }

  function getMetadatas(
    address[] calldata assets
  ) external view returns (Metadata[] memory) {
    Metadata[] memory metadatas = new Metadata[](assets.length);
    for (uint index = 0; index < assets.length; index++) {
      address asset = assets[index];
      metadatas[index] = mTokenMetadata[asset];
    }

    return metadatas;
  }

  function updateFee(uint256 metadataFee) external {
    require(msg.sender == mAuthority, "unauthorized authority");
    mMetadataFee = metadataFee;
  }

  function withdrawFee() external {
    require(msg.sender == mAuthority, "uunauthorized authority");
    payable(address(this)).transfer(address(this).balance);
  }

  function fee() external view returns (uint) {
    return mMetadataFee;
  }
}
