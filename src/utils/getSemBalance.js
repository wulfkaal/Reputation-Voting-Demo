import getWeb3 from './get-web3'

const getSemBalance = async() => {
    let web3 = getWeb3()
    let publicAddress = await web3.eth.getCoinbase()
    let balance = await web3.eth.getBalance(publicAddress)
	return balance
}

export default getSemBalance
