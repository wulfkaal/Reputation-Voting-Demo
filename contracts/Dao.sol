pragma solidity ^0.4.24;

import "./Interface.sol";

contract Dao {
  
  event NewProposalAddress(address _address);
  
  function createProposal(address _factory)
  public {
    FactoryInterface factory = FactoryInterface(_factory);
    address _proposal = address(factory.createProposal());
    emit NewProposalAddress(_proposal);
  }
  
}
