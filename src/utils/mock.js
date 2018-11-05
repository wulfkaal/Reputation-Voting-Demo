import getWeb3 from './get-web3'
import {BigNumber} from 'bignumber.js';

class Mock {

	async getSemBalance() {
	    let web3 = getWeb3()
	    let publicAddress = await web3.eth.getCoinbase()
	    let balance = await web3.eth.getBalance(publicAddress)
		return balance
	}

	async createDao(dao, sem) {
		let response = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let body = await response.json()
	    const greatestTokenNumber = body.daos
	    						.filter(dao => dao.tokenNumberIndex)
	    						.reduce((greatest, dao) => { 
	    							return (greatest || 0) > parseInt(dao.tokenNumberIndex) ? greatest : parseInt(dao.tokenNumberIndex) 
	    						}, {})
		dao.tokenNumberIndex = greatestTokenNumber + 1

		let text = ""
		let possible = "abcdefghijklmnopqrstuvwxyz0123456789"

		for (let i = 0; i < 43; i++){
			text += possible.charAt(Math.floor(Math.random() * possible.length))
		}
		dao.tokenAddress = text
		   // Get latest proposal Index and add one 
		let proposalsResponse = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/proposals`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let proposalsBody = await proposalsResponse.json()
	    const greatestProposalIndex = proposalsBody['greatestProposalIndex']
	    dao.proposalIndex = greatestProposalIndex + 1
	    let balances = {}
		balances["semcore"] = sem
		dao.balances = balances
	    return dao
	}

	async getTokenAddress(tokenNumberIndex) {
		let response = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    
	    let body = await response.json()
	    for(let i=0; i < body.daos.length; i++){
	      let dao = body.daos[i]
	      if(dao.tokenNumberIndex 
	      	&& dao.tokenNumberIndex===tokenNumberIndex 
	      	&& dao.chain===process.env.REACT_APP_SEMADA_DEMO_SEMADA_NETWORK){
	        return dao.tokenAddress
	      }
	    }
	}

	async getTokenBalance(tokenNumberIndex) {
		let response = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let body = await response.json()
	    let web3 = getWeb3()
		let publicAddress = await web3.eth.getCoinbase()
	    for(let i=0; i < body.daos.length; i++){
	      let dao = body.daos[i]
	      if(dao.tokenNumberIndex 
	      	&& dao.tokenNumberIndex===tokenNumberIndex 
	      	&& dao.chain===process.env.REACT_APP_SEMADA_DEMO_SEMADA_NETWORK){
	        return parseInt(dao.balances[publicAddress])
	      }
	    }	
	}

	async joinDao(proposal, tokenNumberIndex) {
		let response = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let body = await response.json()
	    let dao
	    for(let i=0; i < body.daos.length; i++){
	      dao = body.daos[i]
	      if(dao.tokenNumberIndex 
	      	&& dao.tokenNumberIndex===tokenNumberIndex 
	      	&& dao.chain===process.env.REACT_APP_SEMADA_DEMO_SEMADA_NETWORK){
	        dao.balances["semcore"] += proposal.stake
	        dao.totalSupply += proposal.stake 
	        break
	      }
	    }
	    // persist dao
	    let url = `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos/${dao._id}`
	    await fetch(url, {
	      method: 'PUT',
	      mode: 'cors',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify(dao)
	    })

	    // get latest proposalIndex for this dao in this chain
	    let proposalsResponse = await fetch(
	      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/proposals/dao/${dao._id}`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let proposalsbody = await proposalsResponse.json()
	    let proposals = proposalsbody.proposals.filter((p) => p.chain===process.env.REACT_APP_SEMADA_DEMO_SEMADA_NETWORK) 
	    let greatestProposalIndex = 0
	    if(proposals.length){
			for(let i = 0; i < proposals.length; i++){
				let temp = proposals[i]
				if ( temp.proposalIndex > greatestProposalIndex ){
					greatestProposalIndex = temp.proposalIndex
				}
			}
	    }
	    proposal.proposalIndex = greatestProposalIndex + 1
	    proposal.timeout = parseInt(new Date()/1000) + 180

	    let web3 = getWeb3()
		let publicAddress = await web3.eth.getCoinbase()

	    let yesVote = {}
		yesVote["from"] = publicAddress
		yesVote["rep"] = parseInt(proposal.stake/2)
		yesVote["vote"] = true

		let noVote = {}
		noVote["from"] = 0
		noVote["rep"] = parseInt(proposal.stake/2)
		noVote["vote"] = true

		let votes = []
		votes.push(yesVote)
		votes.push(noVote)

		proposal.votes = votes
	    return proposal
	}

	async newProposal(proposal, tokenNumberIndex) {
		let web3 = getWeb3()
		let publicAddress = await web3.eth.getCoinbase()
		let yesVote = {}
		yesVote["from"] = publicAddress
		yesVote["rep"] = parseInt(proposal.stake/2)
		yesVote["vote"] = true

		let noVote = {}
		noVote["from"] = 0
		noVote["rep"] = parseInt(proposal.stake/2)
		noVote["vote"] = false

		let votes = []
		votes.push(yesVote)
		votes.push(noVote)

		proposal.votes = votes

		let response = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let body = await response.json()
	    let dao
	    for(let i=0; i < body.daos.length; i++){
	      dao = body.daos[i]
	      if(dao.tokenNumberIndex 
	      	&& dao.tokenNumberIndex===tokenNumberIndex 
	      	&& dao.chain===process.env.REACT_APP_SEMADA_DEMO_SEMADA_NETWORK){
	        dao.balances["semcore"] += proposal.stake
	        dao.totalSupply += proposal.stake 
	        break
	      }
	    }
		// persist dao
	    let url = `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos/${dao._id}`
	    await fetch(url, {
	      method: 'PUT',
	      mode: 'cors',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify(dao)
	    })

	    // get latest proposalIndex for this dao in this chain
	    let proposalsResponse = await fetch(
	      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/proposals/dao/${dao._id}`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let proposalsbody = await proposalsResponse.json()
	    let proposals = proposalsbody.proposals.filter((p) => p.chain===process.env.REACT_APP_SEMADA_DEMO_SEMADA_NETWORK) 
	    let greatestProposalIndex = 0
	    if(proposals.length){
			for(let i = 0; i < proposals.length; i++){
				let temp = proposals[i]
				if ( temp.proposalIndex > greatestProposalIndex ){
					greatestProposalIndex = temp.proposalIndex
				}
			}
	    }
	    proposal.proposalIndex = greatestProposalIndex + 1
	    proposal.timeout = parseInt(new Date()/1000) + 180
		return proposal
	}

	async voteProposal(proposal) {
		let web3 = getWeb3()
		let publicAddress = await web3.eth.getCoinbase()
		let tokenNumberIndex = proposal.tokenNumberIndex

		let response = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let body = await response.json()
	    let dao
	    for(let i=0; i < body.daos.length; i++){
	      dao = body.daos[i]
	      if(dao.tokenNumberIndex 
	      	&& dao.tokenNumberIndex===tokenNumberIndex 
	      	&& dao.chain===process.env.REACT_APP_SEMADA_DEMO_SEMADA_NETWORK){
	        dao.balances[publicAddress] -= proposal.stake
	    	dao.balances["semcore"] += proposal.stake
	    	break
	      }
	    }
	    let vote = {}
	    vote["from"] = publicAddress
	    vote["rep"] = parseInt(proposal.stake)
	    vote["vote"] = proposal.vote==='yes' ? true : false
	    proposal.votes.push(vote)
		// persist dao
	    let url = `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos/${dao._id}`
	    await fetch(url, {
	      method: 'PUT',
	      mode: 'cors',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify(dao)
	    })
        if (proposal.vote==='yes') {
          proposal.yesRepStaked = parseInt(proposal.yesRepStaked) + parseInt(proposal.stake)
        } else {
          proposal.noRepStaked = parseInt(proposal.noRepStaked) + parseInt(proposal.stake)
        }
        proposal.vote='no'
		return proposal
	}

	async getProposalVotes(proposalIndex, proposalId) {
		let response = await fetch(
	      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/proposals/${proposalId}`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let proposal = await response.json()
	    let votes = proposal.votes
	    let status = 1;
	    let totalRep = 0;
	    let totalYesRep = 0;
	    let noSlashRep = 0;

	    for(let i = 0; i < votes.length; i++){
	      totalRep += votes[i].rep
	      if(votes[i].vote){
	        totalYesRep += votes[i].rep
	      } else if(!votes[i].vote && votes[i].from === 0) {
	        noSlashRep = votes[i].rep
	      }
	    }
	    let now = Math.floor(new Date().getTime()/1000)
	    if(now >= proposal.voteTimeEnd){
	      if(totalYesRep >= Math.floor(totalRep/2)){
	        status = 2
	        //reset as we aren't going to slash rep if YES wins
	        noSlashRep = 0
	      } else {
	        status = 3
	        totalRep = totalRep - noSlashRep
	      }
	    } else {
	      if(totalYesRep >= Math.floor(totalRep/2)){
	        //reset as we aren't going to slash rep if YES wins
	        noSlashRep = 0
	      } else {
	        totalRep = totalRep - noSlashRep
	      }
	      status = 1
	    }

		let proposalStatus = []
		proposalStatus.push(parseInt(status))
		proposalStatus.push(parseInt(totalYesRep))
		proposalStatus.push(parseInt(totalRep - totalYesRep))
		proposalStatus.push(parseInt(noSlashRep))
		return proposalStatus
	}

	async distributeRepAndSem(proposalId, proposalIndex, 
		totalRepStaked, yesRepStaked, noRepStaked, tokenNumberIndex) {
	    let response = await fetch(
	      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/proposals/${proposalId}`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let proposal = await response.json()
	    let votes = proposal.votes
	    let noSlashRep = proposal.noSlashRep ? proposal.noSlashRep : 0

	    let dao
		let daosResponse = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let body = await daosResponse.json()
	    for(let i=0; i < body.daos.length; i++){
	      let temp = body.daos[i]
	      if(temp.tokenNumberIndex 
	      	&& temp.tokenNumberIndex===tokenNumberIndex 
	      	&& temp.chain===process.env.REACT_APP_SEMADA_DEMO_SEMADA_NETWORK){
	        dao = temp
	    	break
	      }
	    }
	    let balances = dao.balances 
	    let totalSupply = dao.totalSupply   
	    //slash the no REP if NO wins.
	    if(noSlashRep > 0) {
	      if (balances["semcore"]){
	      	let rem = balances["semcore"] - noSlashRep
	      	if (rem > 0){
	      		balances["semcore"] = rem
	      	} else {
	      		balances["semcore"] = 0
	      	}
	      	totalSupply -= noSlashRep
	      }
	    }
	  
	    for(let j = 0; j < votes.length; j++){
	      let betAmtWon;
	      if(noSlashRep === 0 && votes[j].vote){
	        betAmtWon = parseFloat(votes[j].rep * totalRepStaked / yesRepStaked).toFixed(2)
	        if (balances[votes[j].from]) {
		        balances[votes[j].from] += betAmtWon
		    } else {
		    	balances[votes[j].from] = betAmtWon
		    }
	        balances["semcore"] -= betAmtWon
	      } else if (noSlashRep > 0
	          && !votes[j].vote 
	          && votes[j].from !== 0){
	        betAmtWon = parseFloat(votes[j].rep * totalRepStaked / noRepStaked).toFixed(2)        
	        if (balances[votes[j].from]) {
		        balances[votes[j].from] += betAmtWon
		    } else {
		    	balances[votes[j].from] = betAmtWon
		    }
	        balances["semcore"] -= betAmtWon
	      }
	    }
	    dao.balances = balances
	    dao.totalSupply = totalSupply
	    let url = `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos/${dao._id}`
	    await fetch(url, {
	      method: 'PUT',
	      mode: 'cors',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify(dao)
	    })

	    let web3 = getWeb3()
		let publicAddress = await web3.eth.getCoinbase()
	    let rep = dao.balances[publicAddress]
	 	return rep
	}
}

export default Mock