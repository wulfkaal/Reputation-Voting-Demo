var Migrations = artifacts.require("../contracts/Migrations.sol");
var SafeMath = artifacts.require("../contracts/SafeMath.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(artifacts.require("../contracts/SemadaCore.sol"));
  deployer.deploy(artifacts.require("../contracts/SafeMath.sol"));
};
