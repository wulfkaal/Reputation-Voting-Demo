import Web3 from 'web3'

const getWeb3 = (web3) => {
  if (!window.web3) {
    window.alert('Please install MetaMask first.')
    return;
  }
  if (!web3) {
    web3 = new Web3(window.web3.currentProvider)
  }
  
  return web3
}

export default getWeb3