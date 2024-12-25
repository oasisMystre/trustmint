// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IMetadata {
  struct Metadata {
    string name;
    string symbol;
    string uri;
    bool isMutable;
    address updateAuthority;
  }

  function initializeMetadata(
    address mint,
    string calldata name,
    string calldata ticker,
    string calldata uri,
    bool isMutable,
    address updateAuthority
  ) external;

  function updateMetadata(
    address mint,
    string calldata name,
    string calldata ticker,
    string calldata uri,
    address updateAuthority
  ) external;

  function getMetadatas(
    address[] calldata mints
  ) external view returns (Metadata[] memory metadatas);

  function updateFee(uint256 metadataFee) external;

  function withdrawFee() external;
}
