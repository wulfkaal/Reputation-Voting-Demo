var SemadaCore = artifacts.require("SemadaCore");
var Rep = artifacts.require("REP");

contract('SemadaCore', function(accounts) {
  it("Create DAO and mint 10 REP", async () => {
    let semadaCoreInstance = await SemadaCore.deployed()
    
    let daoTrx = await semadaCoreInstance.createDao("test", {value: 10})
    let tokenNumberIndex = daoTrx.logs[0].args.tokenNumberIndex
    
    let repContractAddress = await semadaCoreInstance
      .getTokenAddress(tokenNumberIndex)

    let repContract = Rep.at(repContractAddress)
    
    let totalSupply = await repContract.totalSupply()

    assert.equal(totalSupply, 10, "Total supply is not 10")
  });
  
  // it("Create DAO and check vote results", async () => {
  //   let semadaCoreInstance = await SemadaCore.deployed()
  // 
  //   let daoTrx = await semadaCoreInstance.createDao("test", {value: 10})
  //   let tokenNumberIndex = daoTrx.logs[0].args.tokenNumberIndex
  // 
  //   let repContractAddress = await semadaCoreInstance
  //     .getTokenAddress(tokenNumberIndex)
  // 
  //   let repContract = Rep.at(repContractAddress)
  // 
  //   setTimeout(async () => {
  //     let trx = await semadaCoreInstance.checkVote(tokenNumberIndex)
  // 
  //     let balance = await repContract.balanceOf(accounts[0])
  // 
  //     assert.equal(balance, 10, "Balance is not 10")
  //   }, 2500)
  // 
  //   let totalSupply = await repContract.totalSupply()
  //   assert.equal(totalSupply, 10, "Total supply is not 10")
  // 
  // });
  
  it("Join DAO and mint 8 REP", async () => {
    let semadaCoreInstance = await SemadaCore.deployed()
    
    let daoTrx = await semadaCoreInstance.createDao("test", {value: 10})
    let tokenNumberIndex = daoTrx.logs[0].args.tokenNumberIndex
    
    await semadaCoreInstance.joinDao(tokenNumberIndex, {value: 8})
    
    let repContractAddress = await semadaCoreInstance
      .getTokenAddress(tokenNumberIndex)
      
    
    let repContract = Rep.at(repContractAddress)
    
    let totalSupply = await repContract.totalSupply()
    
    assert.equal(totalSupply, 18, `Total supply is not 18, was: ${totalSupply}`)
  });
  
  it("Submit proposal to DAO", async () => {
    let semadaCoreInstance = await SemadaCore.deployed()
    
    let daoTrx = await semadaCoreInstance.createDao("test", {value: 10})
    let tokenNumberIndex = daoTrx.logs[0].args.tokenNumberIndex
    
    await semadaCoreInstance.newProposal(tokenNumberIndex, 
      "Test Proposal", 
      "Evidence", 
      {value: 10})
        
    let repContractAddress = await semadaCoreInstance
      .getTokenAddress(tokenNumberIndex)
    
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
    
    let repContractAddress = await semadaCoreInstance
      .getTokenAddress(tokenNumberIndex)
    
    let repContract = Rep.at(repContractAddress)
    
    await repContract.mintToken({from: accounts[0], value: 5})
    
    await semadaCoreInstance
      .vote(proposalIndex, true, 5)
    
    let vote = await semadaCoreInstance.getVote(proposalIndex, 0)
        
    let totalSupply = await repContract.totalSupply()
    
    assert.equal(vote[1].toNumber(), 5, "Vote REP was not 5")
    assert.equal(totalSupply, 25, "Total supply is not 25")
  });
  
  // it("Closes validation pool with YES votes winning", async () => {
  //   let semadaCoreInstance = await SemadaCore.deployed()
  // 
  //   let daoTrx = await semadaCoreInstance.createDao("test", 
  //     {from: accounts[0], value: 10})
  // 
  //   let tokenNumberIndex = daoTrx.logs[0].args.tokenNumberIndex
  // 
  //   let repContractAddress = await semadaCoreInstance
  //     .getTokenAddress(tokenNumberIndex)
  // 
  //   let repContract = Rep.at(repContractAddress)
  // 
  //   let proposalTrx = await semadaCoreInstance
  //     .newProposal(tokenNumberIndex, 
  //     "Test Proposal", 
  //     "Evidence", 
  //     {from: accounts[1], value: 10})
  // 
  //   let proposalIndex = proposalTrx.logs[0].args.proposalIndex
  // 
  //   await repContract.mintToken({from: accounts[2], value: 5})
  // 
  //   await semadaCoreInstance
  //     .vote(proposalIndex, true, 5, {from: accounts[2]})
  // 
  //   let daoMemberRepBalance
  //   let proposerRepBalance
  // 
  //   setTimeout(async () => {
  //     let trx = await semadaCoreInstance.checkVote(proposalIndex)
  // 
  //     let proposerRepBalance = await repContract.balanceOf(accounts[1])
  //     let daoMemberRepBalance = await repContract.balanceOf(accounts[2])
  // 
  //     assert.equal(daoMemberRepBalance, 5, "Member REP was not 5")
  //     assert.equal(proposerRepBalance, 10, "Proposer REP was not 10")
  // 
  // 
  //   }, 2500)
  // 
  //   let totalSupply = await repContract.totalSupply()
  // 
  //   assert.equal(totalSupply, 25, "Total supply is not 25")
  // 
  // });
  
});