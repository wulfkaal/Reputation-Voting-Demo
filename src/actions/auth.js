export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SAVE_CONTRACT_DETAILS = 'SAVE_CONTRACT_DETAILS'

export const login = (publicAddress, web3, accessToken) => {
  return {
    publicAddress: publicAddress,
    web3: web3,
    access_token: accessToken,
    type: LOGIN
  }
}


export const logout = () => {
  return {
    access_token: null,
    type: LOGOUT
  }
}


export const saveContractDetails = (publicAddress, web3) => {
  return async (dispatch) => {
    let url = `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/contracts`          
    let response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    let body = await response.json()
    var daoFactoryContractAbi;
    var daoFactoryContractAddress;
    var repContractAbi;
    var repContractAddress;
    var repBalance;
    for (var i = 0; i < body.length; i++) {
        let contractJson = body[i];
        if(contractJson.name && contractJson.name === "daoFactory"){
          daoFactoryContractAbi=contractJson.abi
          daoFactoryContractAddress=contractJson.address
        }else if(contractJson.name && contractJson.name === "Sem1"){
          repContractAbi=contractJson.abi
          repContractAddress=contractJson.address
        }
    }

    var repContract = new web3.eth.Contract(repContractAbi, repContractAddress, {
      from: publicAddress, // default from address
      gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    });
    repContract.methods.balanceOf(publicAddress).call()
    .then(function(receipt){
      repBalance = receipt
      repContract.methods.decimals().call(function(err, decimals){
        if(!err){
          const repBalanceBN = new web3.utils.BN(repBalance.toString())
          const decimalsBN = new web3.utils.BN(decimals)
          const divisor = new web3.utils.BN(10).pow(decimalsBN)
          repBalance = (repBalanceBN.div(divisor)).toString()
        }
        return dispatch({
          repBalance: repBalance,
          daoFactoryContractAbi: daoFactoryContractAbi,
          daoFactoryContractAddress: daoFactoryContractAddress,
          repContractAbi: repContractAbi,
          repContractAddress: repContractAddress,
          type: SAVE_CONTRACT_DETAILS
        })
      })
    })
    .catch(function(error){
        console.log(error)
    });
  }
}