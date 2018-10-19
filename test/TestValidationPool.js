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
  
  it("Create DAO and Distribute REP", async () => {
    let semadaCoreInstance = await SemadaCore.deployed()
    let startingSemBalance = web3.eth.getBalance(accounts[0])
    let fees = 1000000000000000000
    console.log("HERE 1")
    let daoTrx = await semadaCoreInstance
      .createDao("test", {from: accounts[0], value: fees})
    
    let tokenNumberIndex = daoTrx.logs[0].args.tokenNumberIndex
    let proposalIndex = daoTrx.logs[1].args.proposalIndex
    console.log("HERE 2")
    let repContractAddress = await semadaCoreInstance
      .getTokenAddress(tokenNumberIndex)
    let repContract = Rep.at(repContractAddress)
    
    let proposalStatus = await semadaCoreInstance
      .getProposalVotes(proposalIndex)
    console.log(`HERE 3 ${proposalStatus}`)
    await semadaCoreInstance.distributeRep(
        proposalIndex, 
        Number(proposalStatus[1]) + Number(proposalStatus[2]),
        Number(proposalStatus[1]),
        Number(proposalStatus[2])
      )
    console.log("HERE 4")
    await semadaCoreInstance.distributeSem(tokenNumberIndex)
    console.log("HERE 5")
    let repBalance = await repContract.balanceOf(accounts[0])
    let semBalance = await web3.eth.getBalance(accounts[0])
    
    assert.equal(repBalance, 
      fees, 
      `REP Balance is not ${fees}, was ${repBalance}`)
      
    assert.isAbove(Number(semBalance), 
      Number(startingSemBalance * 0.9), 
      `SEM Balance is not above ${startingSemBalance * 0.9}, was ${semBalance}`)
  
    let totalSupply = await repContract.totalSupply()
    assert.equal(Number(totalSupply), fees, `Total supply is not ${fees}`)
  
  });
  
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
  
  it("YES votes win", async () => {
    let semadaCoreInstance = await SemadaCore.deployed()
    let startingSemBalance = web3.eth.getBalance(accounts[1])
    let fees = 1000000000000000000
    console.log(`HERE 1`)
    let daoTrx = await semadaCoreInstance
      .createDao("test", {from: accounts[1], value: fees})
    console.log(`HERE 2`)
    let tokenNumberIndex = daoTrx.logs[0].args.tokenNumberIndex
    let proposalIndex = daoTrx.logs[1].args.proposalIndex
  
    let repContractAddress = await semadaCoreInstance
      .getTokenAddress(tokenNumberIndex)
    let repContract = Rep.at(repContractAddress)
    console.log(`HERE 3`)
    await repContract.mintToken({from: accounts[1], value: fees})
    console.log(`HERE 4`)
    let voteTrx = await semadaCoreInstance
      .vote(proposalIndex, true, fees, {from: accounts[1]})
    console.log(`HERE 5`)
    let proposalStatus = await semadaCoreInstance
      .getProposalVotes(proposalIndex)
    console.log(`HERE 6 ${proposalStatus}`)
    await semadaCoreInstance.distributeRep(
        proposalIndex, 
        Number(proposalStatus[1]) + Number(proposalStatus[2]),
        Number(proposalStatus[1]),
        Number(proposalStatus[2])
      )
    console.log(`HERE 7`)
    await semadaCoreInstance.distributeSem(tokenNumberIndex)
    console.log(`HERE 8`)
    let repBalance = await repContract.balanceOf(accounts[1])
    let semBalance = await web3.eth.getBalance(accounts[1])
  
    assert.equal(repBalance, 
      fees, 
      `REP Balance is not ${fees}, was ${repBalance}`)
  
    assert.isAbove(Number(semBalance), 
      Number(startingSemBalance * 0.9), 
      `SEM Balance is not above ${startingSemBalance * 0.9}, was ${semBalance}`)
  
    let totalSupply = await repContract.totalSupply()
    assert.equal(Number(totalSupply), fees, `Total supply is not ${fees}`)
  
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