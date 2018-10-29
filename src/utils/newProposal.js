import truffleContract from "truffle-contract";
import getWeb3 from './get-web3'
import SemadaCoreContract from '../contracts/SemadaCore.json';

var newProposal = async(proposal, tokenNumberIndex, mock) => {

	if(mock){

	} else {
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
	}
	return proposal
}

export default newProposal
