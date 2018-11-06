// import getWeb3 from './get-web3'
import {BigNumber} from 'bignumber.js';
import {values} from 'lodash'

let tokenNumberIndex = 1
let proposalIndex = 1
let validationPool = {}
let repContracts = {}
let semBalances = {}

const SemadaMemory = {

  createDao: async (fromAccount, dao, sem) => {
    tokenNumberIndex += 1
    proposalIndex += 1
    
    let timeout = 180
    
    //insert dao
    repContracts[tokenNumberIndex] = {
      totalSupply: sem,
      balances: {
        0: {
          account: 0,
          rep: sem
        }
      },
      sem: sem
    }
    
    //insert proposal
    validationPool[proposalIndex] = {
      from: fromAccount,
      tokenNumberIndex: tokenNumberIndex,
      name: dao.name,
      timeout: timeout,
      evidence: dao.name
    }
    
    //insert 2 votes
    validationPool[proposalIndex].votes = []
    validationPool[proposalIndex].votes.push(
      {
        from: fromAccount,
        rep: sem / 2,
        vote: true         
      }
    )
    validationPool[proposalIndex].votes.push(
      {
        from: 0,
        rep: sem / 2,
        vote: false
      }
    )
      
    
    
    return {
      tokenNumberIndex: tokenNumberIndex,
      proposalIndex: proposalIndex
    }
    
	},
  
  getRepTotalSupply: async (tokenNumberIndex) => {
    return repContracts[tokenNumberIndex].totalSupply
  },

  getRepBalance: async (tokenNumberIndex, account) => {
    let rep = repContracts[tokenNumberIndex]
    
    if(rep.balances[`${account}`]) {
      return rep.balances[`${account}`].rep
    } else {
      return 0
    }
  },

  setSemBalance: async (account, sem) => {
    if(!semBalances[`${account}`]){
      semBalances[`${account}`] = {account: account, sem: sem}
    } else {
      semBalances[`${account}`].sem = sem  
    }
    
  },

	getSemBalance: async (account) => {

    if(semBalances[`${account}`]) {
      return semBalances[`${account}`].sem
    } else {
      return 0
    }
    
	},

  getProposalVotes: async (proposalIndex, now) => {
    let status = 1
    let totalRep = 0
    let totalYesRep = 0
    let noSlashRep = 0
    
    let pool = validationPool[proposalIndex]
    
    for(let i = 0; i++; i<pool.votes.length) {
      totalRep += pool.votes[i].rep
      
      if(pool.votes[i].vote){
        totalYesRep += pool.votes[i].rep
      } else if (!pool.votes[i].vote && pool.votes[i].from === 0) {
        noSlashRep += pool.votes[i].rep
      }
      
      if(now >= pool.timeout){
        if(totalYesRep >= totalRep / 2){
          status = 2;
          
          //reset as we aren't going to slash rep if YES wins
          noSlashRep = 0;
        } else {
          status = 3;
          totalRep = totalRep - noSlashRep;
        }
      } else {
        if(totalYesRep >= totalRep / 2){
          //reset as we aren't going to slash rep if YES wins
          noSlashRep = 0;
        } else {
          totalRep = totalRep - noSlashRep;
        }
        
        status = 1;
      } 
      
    }
    
    return [status,totalYesRep,totalRep - totalYesRep, noSlashRep]
  },
  
  distributeRep: async (
    proposalIndex, 
    totalRepStaked, 
    yesRepStaked,
    noRepStaked,
    noSlashRep) => {
  
    let pool = validationPool[proposalIndex]
    let rep = repContracts[pool.tokenNumberIndex]
    
    if(noSlashRep > 0) {
      rep.totalSupply -= noSlashRep
      rep.balances[0] -= noSlashRep
    }
  
    for(let j = 0; j < pool.votes.length; j++){
      let betAmtWon = 0
      if(noSlashRep == 0 && pool.votes[j].vote){
        
        betAmtWon = (pool.votes[j].rep / yesRepStaked) * totalRepStaked
        rep.balances[0] -= betAmtWon
        rep.balances[pool.votes[j].from] += betAmtWon
                
      } else if (noSlashRep > 0
          && !pool.votes[j].vote 
          && pool.votes[j].from != 0){
        
        betAmtWon = (pool.votes[j].rep / noRepStaked) * totalRepStaked
        rep.balances[0] -= betAmtWon
        rep.balances[pool.votes[j].from] += betAmtWon

      }
    }
    
  },
  
  distributeSem: async (tokenNumberIndex) => {
    let rep = repContracts[tokenNumberIndex]
    let salary = 0
    
    let balances = values(rep.balances)
    
    for(let i = 0; i < balances.length; i++) {
      if(balances[i].rep > 0) {
        salary = (balances[i].rep / rep.totalSupply) * rep.sem
        
        semBalances[balances[i].account].sem += salary
      }
    }
    
    rep.sem = 0
  },

  joinDao: async (tokenNumberIndex, sem) => {
    
  },

  newProposal: async (tokenNumberIndex, name, description, sem) => {
    
  },
  
  mintRep: async (tokenNumberIndex, account, sem) => {
    
  },
  
  vote: async (proposalIndex, fromAccount, vote, rep) => {
    
  },
  
  getVote: async (proposalIndex, voteIndex) => {
    return [true, 0] // vote, amount of rep staked for vote
  },


}

export default SemadaMemory