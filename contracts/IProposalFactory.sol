pragma solidity ^0.4.24;

interface IProposalFactory {
  function createProposal() external returns (address _proposalAddress);
}