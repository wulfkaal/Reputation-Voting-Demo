import truffleContract from "truffle-contract";
import getWeb3 from './get-web3'
import SemadaCoreContract from '../contracts/SemadaCore.json';

var createDao = async(dao, sem, mock) => {

	if(mock){
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
		   // Get latest proposal Index and add one 
		let proposalsResponse = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/proposals`, {
	      method: 'GET',
	      mode: 'cors'
	    })
	    let proposalsBody = await proposalsResponse.json()
	    const greatestProposalIndex = proposalsBody['greatestProposalIndex']
	    dao.proposalIndex = greatestProposalIndex + 1
	} else {
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
	}
	return dao
}

export default createDao
