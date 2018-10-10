var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(artifacts.require("./Sem1.sol"));
  deployer.deploy(artifacts.require("./VotingContract.sol"));
};
