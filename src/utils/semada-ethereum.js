import truffleContract from 'truffle-contract'
import getWeb3 from './get-web3'
import SemadaCoreContract from '../contracts/SemadaCore.json';
import RepContract from '../contracts/REP.json'

class SemadaEthereum {

	async getSemBalance() {
	    let web3 = getWeb3()
	    let publicAddress = await web3.eth.getCoinbase()
	    let balance = await web3.eth.getBalance(publicAddress)
		return balance
	}

	async createDao(dao, sem) {
		let web3 = getWeb3()
		let publicAddress = await web3.eth.getCoinbase()
		const semadaCore = truffleContract(SemadaCoreContract);
		semadaCore.setProvider(web3.currentProvider)
		let semadaCoreInstance = await semadaCore.deployed()
		try {
			let trx = await semadaCoreInstance.createDao(dao.name, 
			  {from: publicAddress, value:parseInt(sem)})  
			// get the proposalIndex to use for checking the vote outcome later
			if (trx.logs[0].args.tokenNumberIndex) {
			  let tokenNumberIndex = trx.logs[0].args.tokenNumberIndex.toNumber()
			  let proposalIndex = trx.logs[1].args.proposalIndex.toNumber()
			  dao.tokenNumberIndex = tokenNumberIndex
			  dao.proposalIndex = proposalIndex
			} else if (trx.logs[1].args.tokenNumberIndex){
			  let tokenNumberIndex = trx.logs[1].args.tokenNumberIndex.toNumber()
			  let proposalIndex = trx.logs[0].args.proposalIndex.toNumber()
			  dao.tokenNumberIndex = tokenNumberIndex
			  dao.proposalIndex = proposalIndex
			}
		} catch (e) {
			alert(`Failed to submit new DAO proposal: ${e}`)  
		}
		return dao
	}

	async getTokenAddress(tokenNumberIndex) {
		let repAddress
		let web3 = getWeb3()
		const semadaCore = truffleContract(SemadaCoreContract);
		semadaCore.setProvider(web3.currentProvider)
		let semadaCoreInstance = await semadaCore.deployed()
		try {
	        repAddress = await semadaCoreInstance
	          .getTokenAddress(tokenNumberIndex)
		} catch (e) {
			alert(`Failed to get token address for tokenNumberIndex: ${e}`)  
		}
		return repAddress
	}

	async getTokenBalance(tokenNumberIndex) {
	    let web3 = getWeb3()
	    let publicAddress = await web3.eth.getCoinbase()
	    const semadaCore = truffleContract(SemadaCoreContract);
	    semadaCore.setProvider(web3.currentProvider)
	    let semadaCoreInstance = await semadaCore.deployed()

	        
	    const repContract = truffleContract(RepContract)
	    repContract.setProvider(web3.currentProvider)
	    let rep
	        
	    try {
	      let repAddress = await semadaCoreInstance
	        .getTokenAddress(tokenNumberIndex)
	      
	      let repInstance = await repContract.at(repAddress)
	      rep = await repInstance.balanceOf(publicAddress)
	    } catch (e) {
	      alert(`Failed to get REP balance: ${e}`)
	    }
	 	return rep.toNumber()
	}

	async joinDao(proposal, tokenNumberIndex) {
		let web3 = getWeb3()
		let publicAddress = await web3.eth.getCoinbase()
		const semadaCore = truffleContract(SemadaCoreContract);
		semadaCore.setProvider(web3.currentProvider)
		let semadaCoreInstance = await semadaCore.deployed()
		try {
	        let trx = await semadaCoreInstance.joinDao(
	        tokenNumberIndex,
	        {from: publicAddress, value: proposal.stake})
	        proposal.proposalIndex = trx.logs[0].args.proposalIndex
	        proposal.timeout = trx.logs[0].args.timeout
		} catch (e) {
			alert(`Failed to join DAO: ${e}`)  
		}
		return proposal
	}

	async newProposal(proposal, tokenNumberIndex) {
		let web3 = getWeb3()
		let publicAddress = await web3.eth.getCoinbase()
		const semadaCore = truffleContract(SemadaCoreContract);
		semadaCore.setProvider(web3.currentProvider)
		let semadaCoreInstance = await semadaCore.deployed()
		try {
			let trx = await semadaCoreInstance.newProposal(
	         tokenNumberIndex,
	         proposal.name,
	         proposal.evidence,
	        {from: publicAddress, value: proposal.stake})
	        proposal.proposalIndex = trx.logs[0].args.proposalIndex
	        proposal.timeout = trx.logs[0].args.timeout
		} catch (e) {
			alert(`Failed to submit new proposal: ${e}`) 
		}
		return proposal
	}

	async voteProposal(proposal) {
		let web3 = getWeb3()
		let publicAddress = await web3.eth.getCoinbase()
		const semadaCore = truffleContract(SemadaCoreContract);
		semadaCore.setProvider(web3.currentProvider)
		let semadaCoreInstance = await semadaCore.deployed()
		try {        
	        await semadaCoreInstance.vote(
	         proposal.proposalIndex,
	         proposal.vote==='yes' ? true : false,
	         proposal.stake,
	         {from: publicAddress})
	        if (proposal.vote==='yes') {
	          proposal.yesRepStaked = parseInt(proposal.yesRepStaked) + parseInt(proposal.stake)
	        } else {
	          proposal.noRepStaked = parseInt(proposal.noRepStaked) + parseInt(proposal.stake)
	        }
	        proposal.vote='no'
		} catch (e) {
			alert(`Failed to vote for proposal: ${e}`)  
		}
		return proposal
	}

	async getProposalVotes(proposalIndex, proposalId) {
		let proposalStatus 
		let web3 = getWeb3()
		const semadaCore = truffleContract(SemadaCoreContract);
		semadaCore.setProvider(web3.currentProvider)
		let semadaCoreInstance = await semadaCore.deployed()
		try {
			proposalStatus = await semadaCoreInstance.getProposalVotes(
				proposalIndex)
		} catch (e) {
			alert(`Failed to get proposal votes: ${e}`) 
		}
		return proposalStatus
	}

	async distributeRepAndSem(proposalId, proposalIndex, 
		totalRepStaked, yesRepStaked, noRepStaked, tokenNumberIndex) {
	    let web3 = getWeb3()
	    let publicAddress = await web3.eth.getCoinbase()
	    const semadaCore = truffleContract(SemadaCoreContract);
	    semadaCore.setProvider(web3.currentProvider)
	    let semadaCoreInstance = await semadaCore.deployed()
	    const repContract = truffleContract(RepContract)
	    repContract.setProvider(web3.currentProvider)
	    let rep
	    try {
	      await semadaCoreInstance.distributeRep(proposalIndex,
	            totalRepStaked,
	            yesRepStaked,
	            noRepStaked,
	            {from: publicAddress})
	      let repAddress = await semadaCoreInstance
	        .getTokenAddress(tokenNumberIndex)
	      
	      let repInstance = await repContract.at(repAddress)
	      await repInstance.distributeSem({from: publicAddress})
	      rep = await repInstance.balanceOf(publicAddress)
	    } catch (e) {
	      alert(`Failed to distribute Rep And Sem: ${e}`)
	    }
	 	return rep.toNumber()
	}
}

export default SemadaEthereum
