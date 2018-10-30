import Web3 from 'web3'

const getWeb3 = () => {
  if (!window.web3) {
    window.alert('Please install MetaMask first.')
    return;
  }
  return new Web3(window.web3.currentProvider)
}

export default getWeb3