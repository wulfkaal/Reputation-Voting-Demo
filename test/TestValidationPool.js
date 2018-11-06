var SemadaCore = artifacts.require("SemadaCore");
var Rep = artifacts.require("REP");
var Factory = artifacts.require("Factory")
var Dao = artifacts.require("Dao")

contract('SemadaCore', function(accounts) {
  it("Factory creates instance", async () => {
    let factoryInstance = await Factory.deployed()
    let daoInstance = await Dao.deployed()
    
    let trx = await daoInstance.createProposal(factoryInstance.address)
    
    assert.equal(trx.logs[0].args._address.length, 42, "Not a valid address")
  })
  
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
    
    let daoTrx = await semadaCoreInstance
      .createDao("test", {from: accounts[0], value: fees})
    
    let tokenNumberIndex = daoTrx.logs[0].args.tokenNumberIndex
    let proposalIndex = daoTrx.logs[1].args.proposalIndex
    
    let repContractAddress = await semadaCoreInstance
      .getTokenAddress(tokenNumberIndex)
    let repContract = Rep.at(repContractAddress)
    
    let proposalStatus = await semadaCoreInstance
      .getProposalVotes(proposalIndex)
    
    await semadaCoreInstance.distributeRep(
        proposalIndex, 
        Number(proposalStatus[1]) + Number(proposalStatus[2]),
        Number(proposalStatus[1]),
        Number(proposalStatus[2]),
        Number(proposalStatus[3])
      )
    
    await semadaCoreInstance.distributeSem(tokenNumberIndex)
    
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
    let fees = 10
    
    let daoTrx = await semadaCoreInstance
      .createDao("test", {from: accounts[1], value: fees})
    
    let tokenNumberIndex = daoTrx.logs[0].args.tokenNumberIndex
    let proposalIndex = daoTrx.logs[1].args.proposalIndex
  
    let repContractAddress = await semadaCoreInstance
      .getTokenAddress(tokenNumberIndex)
    let repContract = Rep.at(repContractAddress)
    
    await repContract.mintToken({from: accounts[1], value: fees})
    
    let voteTrx = await semadaCoreInstance
      .vote(proposalIndex, true, fees, {from: accounts[1]})
    
    let proposalStatus = await semadaCoreInstance
      .getProposalVotes(proposalIndex)
    
    await semadaCoreInstance.distributeRep(
        proposalIndex, 
        Number(proposalStatus[1]) + Number(proposalStatus[2]),
        Number(proposalStatus[1]),
        Number(proposalStatus[2]),
        Number(proposalStatus[3])
      )
    
    await semadaCoreInstance.distributeSem(tokenNumberIndex)
    
    let repBalance = await repContract.balanceOf(accounts[1])
    let semBalance = await web3.eth.getBalance(accounts[1])
  
    assert.equal(repBalance, 
      19, 
      `REP Balance is not ${19}, was ${repBalance}`)
  
    assert.isAbove(Number(semBalance), 
      Number(startingSemBalance * 0.9), 
      `SEM Balance is not above ${startingSemBalance * 0.9}, was ${semBalance}`)
  
    let totalSupply = await repContract.totalSupply()
    assert.equal(Number(totalSupply), 20, `Total supply is not ${20}`)
  
  });
  
  it("NO votes win", async () => {
    let semadaCoreInstance = await SemadaCore.deployed()

    let startingSemBalance2 = web3.eth.getBalance(accounts[2])
    let startingSemBalance3 = web3.eth.getBalance(accounts[3])
    
    let fees = 10
    
    let daoTrx = await semadaCoreInstance
      .createDao("test", {from: accounts[2], value: fees})
    
    let tokenNumberIndex = daoTrx.logs[0].args.tokenNumberIndex
    let proposalIndex = daoTrx.logs[1].args.proposalIndex
  
    let repContractAddress = await semadaCoreInstance
      .getTokenAddress(tokenNumberIndex)
    let repContract = Rep.at(repContractAddress)
    
    await repContract.mintToken({from: accounts[2], value: 5})
    await repContract.mintToken({from: accounts[3], value: 6})
    await repContract.mintToken({from: accounts[4], value: 4})
    
    let voteTrx1 = await semadaCoreInstance
      .vote(proposalIndex, true, 5, {from: accounts[2]})
    
    let voteTrx2 = await semadaCoreInstance
      .vote(proposalIndex, false, 6, {from: accounts[3]})
      
    let voteTrx3 = await semadaCoreInstance
      .vote(proposalIndex, false, 2, {from: accounts[4]})
    
    let proposalStatus = await semadaCoreInstance
      .getProposalVotes(proposalIndex)
    
    await semadaCoreInstance.distributeRep(
        proposalIndex, 
        Number(proposalStatus[1]) + Number(proposalStatus[2]),
        Number(proposalStatus[1]),
        Number(proposalStatus[2]),
        Number(proposalStatus[3])
      )
    
    let repBalance2 = await repContract.balanceOf(accounts[2])
    let repBalance3 = await repContract.balanceOf(accounts[3])
    let repBalance4 = await repContract.balanceOf(accounts[4])
    let semBalance2 = await web3.eth.getBalance(accounts[2])
    let semBalance3 = await web3.eth.getBalance(accounts[3])
    let semBalance4 = await web3.eth.getBalance(accounts[4])
  
  
    assert.equal(repBalance2, 
      0, 
      `Account 2 REP Balance is not ${0}, was ${repBalance2}`)

    assert.equal(repBalance3, 
      13, 
      `Account 3 REP Balance is not ${13}, was ${repBalance3}`)
      
    assert.equal(repBalance4, 
      6, 
      `Account 4 REP Balance is not ${6}, was ${repBalance4}`)
    
    assert.isAbove(Number(semBalance2), 
      Number(startingSemBalance2 * 0.9), 
      `SEM Balance is not above ${startingSemBalance2 * 0.9}, was ${semBalance2}`)

    assert.isAbove(Number(semBalance3), 
      Number(startingSemBalance3 * 0.9), 
      `SEM Balance is not above ${startingSemBalance3 * 0.9}, was ${semBalance3}`)
  
    let totalSupply = await repContract.totalSupply()
    assert.equal(Number(totalSupply), 20, `Total supply is not ${20}, was ${totalSupply}`)
  
  });
  
});