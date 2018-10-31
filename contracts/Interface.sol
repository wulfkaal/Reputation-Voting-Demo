pragma solidity ^0.4.24;

interface FactoryInterface {
  function createProposal() external returns (address _proposalAddress);
}