pragma solidity ^0.4.24;

import "./Interface.sol";

contract Factory is FactoryInterface {
  
  function createProposal() public returns (address proposalAddress){
    proposalAddress = address(new WorkProposalOne());
  }
  
}

contract WorkProposalOne {
  
}