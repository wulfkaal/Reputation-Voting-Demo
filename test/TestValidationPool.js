var SemadaCore = artifacts.require("SemadaCore");
var Rep = artifacts.require("REP");

contract('SemadaCore', function(accounts) {
  it("Create DAO and mint 10 REP", async () => {
    let semadaCoreInstance = await SemadaCore.deployed()
    
    await semadaCoreInstance.createDao("test", {value: 10})
    
    let repContractAddress = await semadaCoreInstance.getTokenAddress(1)

    let repContract = Rep.at(repContractAddress)
    
    let totalSupply = await repContract.totalSupply()

    assert.equal(totalSupply, 10, "Total supply is not 10")
  });
  
  it("Create DAO and check vote results", async () => {
    let semadaCoreInstance = await SemadaCore.deployed()
    
    await semadaCoreInstance.createDao("test", {value: 10})
    
    let repContractAddress = await semadaCoreInstance.getTokenAddress(2)

    let repContract = Rep.at(repContractAddress)
    
    setTimeout(async () => {
      let trx = await semadaCoreInstance.checkVote(2)
      
      let balance = await repContract.balanceOf(accounts[0])

      let vote1 = await semadaCoreInstance.getVote(2,0)
      
      assert.equal(balance, 10, "Balance is not 10")
    }, 2500)
    
    let totalSupply = await repContract.totalSupply()
    assert.equal(totalSupply, 10, "Total supply is not 10")
    
  });
  
  it("Join DAO and mint 8 REP", async () => {
    let semadaCoreInstance = await SemadaCore.deployed()
    
    await semadaCoreInstance.createDao("test", {value: 10})
    await semadaCoreInstance.joinDao(3, {value: 8})
    
    let repContractAddress = await semadaCoreInstance.getTokenAddress(3)

    let repContract = Rep.at(repContractAddress)
    
    let totalSupply = await repContract.totalSupply()

    assert.equal(totalSupply, 18, "Total supply is not 18")
  });
  
  it("Submit proposal to DAO", async () => {
    let semadaCoreInstance = await SemadaCore.deployed()
    
    await semadaCoreInstance.createDao("test", {value: 10})
    
    await semadaCoreInstance.newProposal(4, 
      "Test Proposal", 
      "Evidence", 
      {value: 10})
        
    let repContractAddress = await semadaCoreInstance.getTokenAddress(4)
    
    let repContract = Rep.at(repContractAddress)
    
    let totalSupply = await repContract.totalSupply()

    assert.equal(totalSupply, 20, "Total supply is not 20")
  });
  
  it("Vote on proposal", async () => {
    let semadaCoreInstance = await SemadaCore.deployed()
    
    let daoTrx = await semadaCoreInstance.createDao("test", {value: 10})
    
    let tokenNumberIndex = daoTrx.logs[0].args.tokenNumberIndex
    
    let proposalTrx = await semadaCoreInstance
      .newProposal(tokenNumberIndex, 
      "Test Proposal", 
      "Evidence", 
      {value: 10})
      
    let proposalIndex = proposalTrx.logs[0].args.proposalIndex
    console.log(proposalIndex)
    await semadaCoreInstance
      .vote(proposalIndex, true, {value: 5})
    // 
    // let vote = await semadaCoreInstance.getVote(proposalIndex, 0)
    // 
    // let repContractAddress = await semadaCoreInstance
    //   .getTokenAddress(tokenNumberIndex)
    // 
    // let repContract = Rep.at(repContractAddress)
    // 
    // let totalSupply = await repContract.totalSupply()
    // console.log(totalSupply.toNumber())
    // assert.equal(vote[1].toNumber(), 5, "Vote REP was not 5")
    // assert.equal(totalSupply, 25, "Total supply is not 25")
  });
  
});