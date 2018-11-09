// import getWeb3 from './get-web3'
import {BigNumber} from 'bignumber.js'
import fetch from 'isomorphic-fetch'

const SemadaApi = {

  createDao: async (fromAccount, dao, sem) => {
    
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/create-dao`
    
    try {
      let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account: fromAccount,
          dao: dao,
          sem: sem
        })
      })
      
      let body = await response.json()
      
      return body  
    } catch (err) {
      console.log(err)
    }
  
	},
  
  getRepContract: async (tokenNumberIndex) => {
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/daos/${tokenNumberIndex}`
    
    let response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    let body = await response.json()
    
    return body
  },
  
  getRepTotalSupply: async (tokenNumberIndex) => {
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/daos/${tokenNumberIndex}/total-supply`
    
    let response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    let body = await response.json()
    
    return body.totalSupply
  },
  
  getRepBalance: async (tokenNumberIndex, account) => {
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/daos/${tokenNumberIndex}/rep-balance/${account}`
    
    let response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    let body = await response.json()
    
    return body.balance
  },
  
  setSemBalance: async (account, sem) => {
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/balances/${account}`
    
    let response = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account: account,
        sem: sem
      })
    })
  
  },
  
	getSemBalance: async (account) => {
  
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/balances/${account}`
    
    let response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    let body = await response.json()
    
    return body.sem
  
	},
  
  getProposalVotes: async (proposalIndex, now) => {

    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/proposals/${proposalIndex}/votes/${now}/proposal-votes`
    
    let response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    let body = await response.json()
    
    return [
      body.status, 
      body.totalYesRep, 
      body.totalNoRep, 
      body.noSlashRep
    ]
  },
  
  distributeRep: async (proposalIndex, 
    totalRepStaked, 
    yesRepStaked, 
    noRepStaked, 
    noSlashRep) => {
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/proposals/${proposalIndex}/distribute-rep`
    
    let response = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        totalRepStaked: totalRepStaked,
        yesRepStaked: yesRepStaked,
        noRepStaked: noRepStaked,
        noSlashRep: noSlashRep
      })
    })
    
    let body = await response.json()
  },
  
  distributeSem: async (tokenNumberIndex) => {
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/daos/${tokenNumberIndex}/distribute-sem`
    
    let response = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    let body = await response.json()
  },
  
  joinDao: async (tokenNumberIndex, account , sem) => {
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/daos/${tokenNumberIndex}/join`
    
    let response = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account: account,
        sem: sem
      })
    })
    
    let proposal = await response.json()
    
    return proposal
  },
  
  newProposal: async (tokenNumberIndex, name, description, account, sem) => {
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/proposals`
    
    let response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tokenNumberIndex: tokenNumberIndex,
        name: name, 
        description: description,
        account: account, 
        sem: sem
      })
    })
    
    let body = await response.json()
    return body
  },
  
  mintRep: async (tokenNumberIndex, account, sem) => {
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/daos/${tokenNumberIndex}/mint-rep`
    
    let response = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account: account,
        sem: sem
      })
    })

  },
  
  vote: async (tokenNumberIndex, proposalIndex, fromAccount, vote, rep) => {
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/proposals/${proposalIndex}/vote`
    
    let response = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tokenNumberIndex: tokenNumberIndex,
        account: fromAccount,
        vote: vote,
        rep: rep
      })
    })
  },
  
  getVote: async (proposalIndex, voteIndex) => {
    let url = 
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/semada-core/proposals/${proposalIndex}/votes/${voteIndex}`
    
    let response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    let body = await response.json()
    
    return [body.vote, body.rep]
  },
	
}

export default SemadaApi