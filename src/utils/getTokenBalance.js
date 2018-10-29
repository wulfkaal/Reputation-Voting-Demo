import getWeb3 from './get-web3'
import truffleContract from "truffle-contract"
import SemadaCoreContract from '../contracts/SemadaCore.json';
import RepContract from '../contracts/REP.json'

const getTokenBalance = async (tokenNumberIndex) => {
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

export default getTokenBalance