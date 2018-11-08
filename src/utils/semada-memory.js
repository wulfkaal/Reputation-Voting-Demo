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
    
    let now = Math.floor(new Date().getTime()/1000)
    let timeout = now + 180
    
    //insert dao
    repContracts[tokenNumberIndex] = {
      totalSupply: sem,
      balances: {
        'semcore' : {
          account: 'semcore',
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
        from: 'semcore',
        rep: sem / 2,
        vote: false
      }
    )
    return {
      tokenNumberIndex: tokenNumberIndex,
      proposalIndex: proposalIndex
    }
    
	},
  
  getRepContract: async (tokenNumberIndex) => {
    return repContracts[tokenNumberIndex]
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
    for(let i = 0; i<pool.votes.length; i++) {
      totalRep += pool.votes[i].rep
      
      if(pool.votes[i].vote){
        totalYesRep += pool.votes[i].rep
      } else if (!pool.votes[i].vote && pool.votes[i].from === 'semcore') {
        noSlashRep += pool.votes[i].rep
      }
    }
    if(now >= pool.timeout){
      if(totalYesRep >= totalRep / 2){
        status = 2;
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
    return [status , totalYesRep, totalRep - totalYesRep, noSlashRep]
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
      rep.balances['semcore']['rep'] -= noSlashRep
    }
    for(let j = 0; j < pool.votes.length; j++){
      let betAmtWon = 0
      if(noSlashRep == 0 && pool.votes[j].vote){
        betAmtWon = parseFloat(((pool.votes[j].rep / yesRepStaked) * totalRepStaked).toFixed(2))
        rep.balances['semcore']['rep'] -= betAmtWon
        if (rep.balances[pool.votes[j].from]){
          rep.balances[pool.votes[j].from]['rep'] += betAmtWon
        } else {
          let act = {}
          act['account'] = pool.votes[j].from
          act['rep'] = betAmtWon
          rep.balances[pool.votes[j].from] = act
        }
      } else if (noSlashRep > 0
          && !pool.votes[j].vote 
          && pool.votes[j].from !== 'semcore'){
        
        betAmtWon = parseFloat(((pool.votes[j].rep / noRepStaked) * totalRepStaked).toFixed(2))
        rep.balances['semcore']['rep'] -= betAmtWon
        if (rep.balances[pool.votes[j].from]){
          rep.balances[pool.votes[j].from]['rep'] += betAmtWon
        } else {
          let act = {}
          act['account'] = pool.votes[j].from
          act['rep'] = betAmtWon
          rep.balances[pool.votes[j].from] = act
        }

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

  joinDao: async (tokenNumberIndex, fromAccount , sem) => {

    proposalIndex += 1
    
    let timeout = 180
    
    repContracts[tokenNumberIndex].totalSupply += parseInt(sem)
    if(repContracts[tokenNumberIndex].balances[fromAccount]){
      repContracts[tokenNumberIndex].balances[fromAccount]['rep'] += sem
    } else {
      let act = {}
      act['account'] = fromAccount
      act['rep'] = sem
      repContracts[tokenNumberIndex].balances[fromAccount] = act
    }
    repContracts[tokenNumberIndex].sem += sem

    if(!semBalances[`${fromAccount}`]){
      semBalances[`${fromAccount}`] = {account: fromAccount, sem: sem}
    } else {
      semBalances[`${fromAccount}`].sem += sem  
    }

    //insert proposal
    validationPool[proposalIndex] = {
      from: fromAccount,
      tokenNumberIndex: tokenNumberIndex,
      name: "Join DAO",
      timeout: timeout,
      evidence: "Join DAO"
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

  newProposal: async (tokenNumberIndex, name, description, fromAccount, sem) => {
    proposalIndex += 1

    let timeout = 180
    
    //subtract SEM from fromAccount
    //add SEM to repContract
    //mint REP in repContract for 0 address and increase totalSupply
    
    repContracts[tokenNumberIndex].totalSupply += sem

    if(repContracts[tokenNumberIndex].balances['semcore']){
      repContracts[tokenNumberIndex].balances['semcore']['rep'] += sem
    } else {
      let act = {}
      act['account'] = 'semcore'
      act['rep'] = sem
      repContracts[tokenNumberIndex].balances['semcore'] = act
    }
    repContracts[tokenNumberIndex].sem += sem

    if(semBalances[`${fromAccount}`]){
      semBalances[`${fromAccount}`].sem -= sem
    }

    //insert proposal
    validationPool[proposalIndex] = {
      from: fromAccount,
      tokenNumberIndex: tokenNumberIndex,
      name: name,
      timeout: timeout,
      evidence: description
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
      proposalIndex: proposalIndex
    }
  },
  
  mintRep: async (tokenNumberIndex, account, sem) => {
    repContracts[tokenNumberIndex].totalSupply += parseInt(sem)
    if(repContracts[tokenNumberIndex].balances[account]){
      repContracts[tokenNumberIndex].balances[account]['rep'] += sem
    } else {
      let act = {}
      act['account'] = account
      act['rep'] = sem
      repContracts[tokenNumberIndex].balances[account] = act
    }
    repContracts[tokenNumberIndex].sem += sem

    semBalances[`${account}`].sem -= sem  
    
  },
  
  vote: async (tokenNumberIndex, proposalIndex, fromAccount, vote, rep) => {
    let pool = validationPool[proposalIndex]
    let now = Math.floor(new Date().getTime()/1000)
    if (now > pool.timeout && repContracts[tokenNumberIndex].balances[fromAccount]['rep'] < rep){
      return
    }
    validationPool[proposalIndex].votes.push(
      {
        from: fromAccount,
        rep: rep,
        vote: vote         
      }
    )
    repContracts[tokenNumberIndex].balances[fromAccount]['rep'] -= rep
    repContracts[tokenNumberIndex].balances['semcore']['rep'] += rep
  },
  
  getVote: async (proposalIndex, voteIndex) => {
    let vote = validationPool[proposalIndex].votes[voteIndex]
    return [vote.vote, vote.rep]
  },


}

export default SemadaMemory