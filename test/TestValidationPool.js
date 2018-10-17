var SemadaCore = artifacts.require("SemadaCore");
var Rep = artifacts.require("REP");

contract('MetaCoin', function(accounts) {
  it("should mint 10 REP", function() {
  var instance;
  
  return SemadaCore.deployed().then(function(ins) {
    instance = ins;
  }).then(function() {
    return instance.createDao("1", {value: 10});
  }).then(function(trx) {
    instance.checkVote(trx.logs[1].args)
  }).then(function() {
    Rep.deployed().then(function(ins) {
      return ins.balanceOf(accounts[0])
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 10, "Account did not win 10 REP");
    })
  });
});
  
});