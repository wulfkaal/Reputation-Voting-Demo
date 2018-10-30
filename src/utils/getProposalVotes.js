import truffleContract from "truffle-contract";
import getWeb3 from './get-web3'
import SemadaCoreContract from '../contracts/SemadaCore.json';

var getProposalVotes = async(proposalIndex, mock) => {
	let proposalStatus 
	if(mock){

	} else {
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
	}
	return proposalStatus
}

export default getProposalVotes
