import truffleContract from "truffle-contract";
import getWeb3 from './get-web3'
import SemadaCoreContract from '../contracts/SemadaCore.json';

var joinDao = async(dao, sem, mock) => {

	if(mock){

	} else {
		let web3 = getWeb3()
		let publicAddress = await web3.eth.getCoinbase()
		const semadaCore = truffleContract(SemadaCoreContract);
		semadaCore.setProvider(web3.currentProvider)
		let semadaCoreInstance = await semadaCore.deployed()
		console.log(semadaCoreInstance)
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
	}
	return dao
}

export default joinDao
