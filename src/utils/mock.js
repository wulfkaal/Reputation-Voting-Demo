import getWeb3 from './get-web3'

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
	    let web3 = getWeb3()
		let publicAddress = await web3.eth.getCoinbase()
		balances[publicAddress] = sem
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
	        return dao.balances[publicAddress]
	      }
	    }	
	}

	async joinDao(proposal, tokenNumberIndex) {
		// let web3 = getWeb3()
		// let publicAddress = await web3.eth.getCoinbase()
		// const semadaCore = truffleContract(SemadaCoreContract);
		// semadaCore.setProvider(web3.currentProvider)
		// let semadaCoreInstance = await semadaCore.deployed()
		// try {
	 //        let trx = await semadaCoreInstance.joinDao(
	 //        tokenNumberIndex,
	 //        {from: publicAddress, value: proposal.stake})
	 //        proposal.proposalIndex = trx.logs[0].args.proposalIndex
	 //        proposal.timeout = trx.logs[0].args.timeout
		// } catch (e) {
		// 	alert(`Failed to join DAO: ${e}`)  
		// }
		// return proposal
	}

	async newProposal(proposal, tokenNumberIndex) {
		// let web3 = getWeb3()
		// let publicAddress = await web3.eth.getCoinbase()
		// const semadaCore = truffleContract(SemadaCoreContract);
		// semadaCore.setProvider(web3.currentProvider)
		// let semadaCoreInstance = await semadaCore.deployed()
		// try {
		// 	let trx = await semadaCoreInstance.newProposal(
	 //         tokenNumberIndex,
	 //         proposal.name,
	 //         proposal.evidence,
	 //        {from: publicAddress, value: proposal.stake})
	 //        proposal.proposalIndex = trx.logs[0].args.proposalIndex
	 //        proposal.timeout = trx.logs[0].args.timeout
		// } catch (e) {
		// 	alert(`Failed to submit new proposal: ${e}`) 
		// }
		// return proposal
	}

	async voteProposal(proposal) {
		// let web3 = getWeb3()
		// let publicAddress = await web3.eth.getCoinbase()
		// const semadaCore = truffleContract(SemadaCoreContract);
		// semadaCore.setProvider(web3.currentProvider)
		// let semadaCoreInstance = await semadaCore.deployed()
		// try {        
	 //        await semadaCoreInstance.vote(
	 //         proposal.proposalIndex,
	 //         proposal.vote==='yes' ? true : false,
	 //         proposal.stake,
	 //         {from: publicAddress})
	 //        if (proposal.vote==='yes') {
	 //          proposal.yesRepStaked = parseInt(proposal.yesRepStaked) + parseInt(proposal.stake)
	 //        } else {
	 //          proposal.noRepStaked = parseInt(proposal.noRepStaked) + parseInt(proposal.stake)
	 //        }
	 //        proposal.vote='no'
		// } catch (e) {
		// 	alert(`Failed to vote for proposal: ${e}`)  
		// }
		// return proposal
	}

	async getProposalVotes(proposalIndex) {
		// let proposalStatus 
		// let web3 = getWeb3()
		// const semadaCore = truffleContract(SemadaCoreContract);
		// semadaCore.setProvider(web3.currentProvider)
		// let semadaCoreInstance = await semadaCore.deployed()
		// try {
		// 	proposalStatus = await semadaCoreInstance.getProposalVotes(
		// 		proposalIndex)
		// } catch (e) {
		// 	alert(`Failed to get proposal votes: ${e}`) 
		// }
		// return proposalStatus
	}

	async distributeRepAndSem(proposalIndex, totalRepStaked, yesRepStaked, noRepStaked, tokenNumberIndex) {
	  //   let web3 = getWeb3()
	  //   let publicAddress = await web3.eth.getCoinbase()
	  //   const semadaCore = truffleContract(SemadaCoreContract);
	  //   semadaCore.setProvider(web3.currentProvider)
	  //   let semadaCoreInstance = await semadaCore.deployed()
	  //   const repContract = truffleContract(RepContract)
	  //   repContract.setProvider(web3.currentProvider)
	  //   let rep
	  //   try {
	  //     await semadaCoreInstance.distributeRep(proposalIndex,
	  //           totalRepStaked,
	  //           yesRepStaked,
	  //           noRepStaked,
	  //           {from: publicAddress})
	  //     let repAddress = await semadaCoreInstance
	  //       .getTokenAddress(tokenNumberIndex)
	      
	  //     let repInstance = await repContract.at(repAddress)
	  //     await repInstance.distributeSem({from: publicAddress})
	  //     rep = await repInstance.balanceOf(publicAddress)
	  //   } catch (e) {
	  //     alert(`Failed to distribute Rep And Sem: ${e}`)
	  //   }
	 	// return rep.toNumber()
	}
}

export default Mock