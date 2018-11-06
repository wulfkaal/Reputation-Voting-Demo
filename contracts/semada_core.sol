pragma solidity ^0.4.24;

import "./IProposalFactory.sol";

contract SemadaCore {
  
  event NewProposalAddress(address _address);
  
  function createProposal(address _factory)
  public {
    IProposalFactory factory = IProposalFactory(_factory);
    address _proposal = address(factory.createProposal());
    emit NewProposalAddress(_proposal);
  }
  
}
