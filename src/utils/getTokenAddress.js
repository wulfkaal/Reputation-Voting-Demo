import truffleContract from "truffle-contract";
import getWeb3 from './get-web3'
import SemadaCoreContract from '../contracts/SemadaCore.json';

var getTokenAddress = async(tokenNumberIndex, mock) => {
	let repAddress
	if(mock){

	} else {
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
	}
	return repAddress
}

export default getTokenAddress
