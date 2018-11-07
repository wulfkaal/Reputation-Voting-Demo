import SemadaCore from '../utils/semada-core'

test('Create DAO and mint 10 REP', async () => {
  let dao = {
    name: 'Test'
  }
  
  let sem = 10
  
  let newDao = await SemadaCore.createDao(0, dao, sem)
  let totalSupply = await SemadaCore.getRepTotalSupply(newDao.tokenNumberIndex)
  
  expect(totalSupply).toBe(10)
})

test('Create DAO and Distribute REP', async () => {
  let fees = 1000000000000000000
  
  await SemadaCore.setSemBalance(0, 0)
  let startingSemBalance = await SemadaCore.getSemBalance(0)
  let newDao = await SemadaCore.createDao(0, {name:'test'}, fees)
  let now = Math.floor(new Date().getTime()/1000) +  180
  let proposalStatus = await SemadaCore.getProposalVotes(newDao.proposalIndex, now)
  await SemadaCore.distributeRep(
    newDao.proposalIndex,
    parseInt(proposalStatus[1]) + parseInt(proposalStatus[2]),
    parseInt(proposalStatus[1]),
    parseInt(proposalStatus[2]),
    parseInt(proposalStatus[3])
  )
  
  await SemadaCore.distributeSem(newDao.tokenNumberIndex)
  
  let repBalance = await SemadaCore.getRepBalance(newDao.tokenNumberIndex, 0)
  let semBalance = await SemadaCore.getSemBalance(0)
  
  let totalSupply = await SemadaCore.getRepTotalSupply(newDao.tokenNumberIndex)
  
  expect(parseInt(repBalance)).toBe(fees)
  expect(semBalance).toBeGreaterThan(startingSemBalance)
  expect(totalSupply).toBe(fees)
})

test('Join DAO and mint 8 REP', async () => {
  let newDao = await SemadaCore.createDao(0, {name: 'test'}, 10)
  await SemadaCore.joinDao(newDao.tokenNumberIndex, 0, 8)
  let totalRepSupply = await SemadaCore
    .getRepTotalSupply(newDao.tokenNumberIndex)

  expect(totalRepSupply).toBe(18)
})

test('Submit proposal to DAO', async () => {
  await SemadaCore.setSemBalance(0, 10)
  let startingSemBalance = await SemadaCore.getSemBalance(0)
  
  let newDao = await SemadaCore.createDao(0, {name: 'test'}, 10)
  let startingRepBalance = 
    await SemadaCore.getRepBalance(newDao.tokenNumberIndex, 0)
  let repContract = 
      await SemadaCore.getRepContract(newDao.tokenNumberIndex)
  let startingRepContractSemBalance = repContract.sem
  
  await SemadaCore.newProposal(newDao.tokenNumberIndex,
    "Test Proposal",
    "Evidence",
    0,
    10)

  let totalRepSupply = await SemadaCore
    .getRepTotalSupply(newDao.tokenNumberIndex)

  let endingSemBalance = await SemadaCore.getSemBalance(0)
  let endingRepBalance = 
    await SemadaCore.getRepBalance(newDao.tokenNumberIndex, 0)
    
  repContract = 
      await SemadaCore.getRepContract(newDao.tokenNumberIndex)
  let endingRepContractSemBalance = repContract.sem

  expect(totalRepSupply).toBe(20)
  expect(startingSemBalance).toBe(10)
  expect(endingSemBalance).toBe(0)
  expect(startingRepBalance).toBe(0)
  expect(endingRepBalance).toBe(0)
  expect(startingRepContractSemBalance).toBe(10)
  expect(endingRepContractSemBalance).toBe(20)
})

test('Vote on proposal', async () => {
  let newDao = await SemadaCore.createDao(0, {name: 'test'}, 10)

  await SemadaCore.newProposal(newDao.tokenNumberIndex,
    "Test Proposal",
    "Evidence",
    0,
    10)

  await SemadaCore.mintRep(newDao.tokenNumberIndex, 0, 5)

  await SemadaCore.vote(
    newDao.tokenNumberIndex, 
    newDao.proposalIndex, 
    0, 
    true, 
    5
  )

  let vote = await SemadaCore.getVote(newDao.proposalIndex, 0)

  let totalRepSupply = await SemadaCore
    .getRepTotalSupply(newDao.tokenNumberIndex)

  expect(vote[1]).toBe(5)
  expect(totalRepSupply).toBe(25)
})

test('YES votes win', async () => {
  let fees = 10
  let startingSemBalance = await SemadaCore.getSemBalance(1)
  let newDao = await SemadaCore.createDao(1, {name: 'test'}, fees)
  await SemadaCore.mintRep(newDao.tokenNumberIndex, 1, fees)
  await SemadaCore.vote(
    newDao.tokenNumberIndex, 
    newDao.proposalIndex, 
    1, 
    true, 
    fees)
  let now = Math.floor(new Date().getTime()/1000) +  180
  let proposalStatus = 
    await SemadaCore.getProposalVotes(newDao.proposalIndex, now)
  await SemadaCore.distributeRep(
    newDao.proposalIndex,
    parseInt(proposalStatus[1]) + parseInt(proposalStatus[2]),
    parseInt(proposalStatus[1]),
    parseInt(proposalStatus[2]),
    parseInt(proposalStatus[3])
  )
  await SemadaCore.distributeSem(newDao.tokenNumberIndex)
  let repBalance = await SemadaCore.getRepBalance(newDao.tokenNumberIndex,1)
  let semBalance = await SemadaCore.getSemBalance(1)
  let totalSupply = await SemadaCore.getRepTotalSupply(newDao.tokenNumberIndex)
  expect(repBalance).toBe(20)
  expect(semBalance).toBeGreaterThan(startingSemBalance)
  expect(totalSupply).toBe(20)
})

test('NO votes win', async () => {
  let fees = 10
  let startingSemBalance2 = await SemadaCore.getSemBalance(2)
  let startingSemBalance3 = await SemadaCore.getSemBalance(3)

  let newDao = await SemadaCore.createDao(2, {name: 'test'}, fees)

  await SemadaCore.mintRep(newDao.tokenNumberIndex, 2, 5)
  await SemadaCore.mintRep(newDao.tokenNumberIndex, 3, 6)
  await SemadaCore.mintRep(newDao.tokenNumberIndex, 4, 4)

  await SemadaCore
    .vote(newDao.tokenNumberIndex, newDao.proposalIndex, 2, true, 5)
  await SemadaCore
    .vote(newDao.tokenNumberIndex, newDao.proposalIndex, 3, false, 6)
  await SemadaCore
    .vote(newDao.tokenNumberIndex, newDao.proposalIndex, 4, false, 2)

  let now = Math.floor(new Date().getTime()/1000) +  180
  let proposalStatus = 
    await SemadaCore.getProposalVotes(newDao.proposalIndex, now)
  await SemadaCore.distributeRep(
    newDao.proposalIndex,
    proposalStatus[1] + proposalStatus[2],
    proposalStatus[1],
    proposalStatus[2],
    proposalStatus[3]
  )

  let repBalance2 = await SemadaCore.getRepBalance(newDao.tokenNumberIndex, 2)
  let repBalance3 = await SemadaCore.getRepBalance(newDao.tokenNumberIndex, 3)
  let repBalance4 = await SemadaCore.getRepBalance(newDao.tokenNumberIndex, 4)

  let semBalance2 = await SemadaCore.getSemBalance(2)
  let semBalance3 = await SemadaCore.getSemBalance(3)
  let semBalance4 = await SemadaCore.getSemBalance(4)

  let totalRepSupply = await SemadaCore.getRepTotalSupply(newDao.tokenNumberIndex)

  expect(repBalance2).toBe(0)
  expect(repBalance3).toBe(13.5)
  expect(repBalance4).toBe(6.5)

  expect(semBalance2).toBeGreaterThan(startingSemBalance2)
  expect(semBalance3).toBeGreaterThan(startingSemBalance3)

  expect(totalRepSupply).toBe(20)
})

