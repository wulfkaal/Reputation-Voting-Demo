var Migrations = artifacts.require("../contracts/Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(artifacts.require("../contracts/SemadaCore.sol"));
  deployer.deploy(artifacts.require("../contracts/SafeMath.sol"));
  deployer.deploy(artifacts.require("../contracts/Factory.sol"));
  deployer.deploy(artifacts.require("../contracts/Dao.sol"));
};
