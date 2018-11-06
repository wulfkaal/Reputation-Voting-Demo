import semadaCoreFactory from './semada-core-factory'

const SemadaCore = {
  createDao: async (fromAccount, dao, sem) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    let newDao = await persistence.createDao(fromAccount, dao.name, sem)
    
    dao.tokenNumberIndex = newDao.tokenNumberIndex
    dao.proposalIndex = newDao.proposalIndex
    
    return dao
  },
  
  getRepTotalSupply: async (tokenNumberIndex) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    let totalSupply = await persistence.getRepTotalSupply(tokenNumberIndex)
    
    return totalSupply
  },
  
  getRepBalance: async (tokenNumberIndex, account) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    let repBalance = await persistence.getRepBalance(tokenNumberIndex, account)
    
    return repBalance
  },
  
  setSemBalance: async (account, sem) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    await persistence.setSemBalance(account, sem)
  },
  
  getSemBalance: async (account) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    let semBalance = await persistence.getSemBalance(account)
    
    return semBalance
  },
  
  getProposalVotes: async (proposalIndex, now) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    let proposalVotes = await persistence.getProposalVotes(proposalIndex, now)
    
    return proposalVotes
  },
  
  distributeRep: async (
    proposalIndex, 
    totalRepStaked, 
    yesRepStaked, 
    noRepStaked, 
    noSlashRep) => {
      
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    
    await persistence.distributeRep(
      proposalIndex, 
      totalRepStaked, 
      yesRepStaked,
      noRepStaked,
      noSlashRep)
  },
  
  distributeSem: async (tokenNumberIndex) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    
    await persistence.distributeSem(tokenNumberIndex)
  },

  joinDao: async (tokenNumberIndex, sem) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    
    await persistence.joinDao(tokenNumberIndex, sem)
  },
  
  newProposal: async (tokenNumberIndex, name, description, sem) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    
    await persistence.newProposal(tokenNumberIndex, name, description, sem)
  },
  
  mintRep: async (tokenNumberIndex, account, sem) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    
    await persistence.mintRep(tokenNumberIndex, account, sem)
  },
  
  vote: async (proposalIndex, fromAccount, vote, rep) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    
    await persistence.vote(proposalIndex, fromAccount, vote, rep)
  },
  
  getVote: async (proposalIndex, voteIndex) => {
    let persistence = await semadaCoreFactory.getPersistenceLayer()
    
    let vote = await persistence.getVote(proposalIndex, voteIndex)
    
    return vote
  }

}

export default SemadaCore