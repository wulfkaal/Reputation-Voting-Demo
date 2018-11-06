pragma solidity ^0.4.24;

import "./IProposalFactory.sol";

contract JoinNewsVerificationDaoProposal is IProposalFactory {
  
  function createProposal() public returns (address proposalAddress){
    proposalAddress = address(new WorkProposalOne());
  }
  
}

contract WorkProposalOne {
  uint minSemFees = 200;
  uint mintedRepToSemRation = 3;
  string description;
  
}