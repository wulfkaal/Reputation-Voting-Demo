pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SemadaCore.sol";

contract TestSemadaCore {
  function testNewDao() public {
    SemadaCore core = SemadaCore(DeployedAddresses.SemadaCore());

    uint expected = 1;
    core.createDao('Test DAO');

    Assert.equal(core.tokenNumberIndex(), expected, "DAO index should be 1");
  }
}