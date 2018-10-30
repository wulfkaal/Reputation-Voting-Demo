import truffleContract from "truffle-contract";
import getWeb3 from './get-web3'
import SemadaCoreContract from '../contracts/SemadaCore.json';

var voteProposal = async(proposal, mock) => {

	if(mock){

	} else {
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
	}
	return proposal
}

export default voteProposal
