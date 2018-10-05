export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SAVE_DAO_FACTORY = 'SAVE_DAO_FACTORY'

export const login = (web3, accessToken) => {
  return {
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


export const saveDaoFactory = () => {
  console.log("enter saveDaoFactory")
  return async (dispatch) => {
    let url = `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/contracts/daoFactory`          
    let response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    let body = await response.json()
    if(body._id) {
      return dispatch({
        daoFactoryContractAbi: body['abi'],
        daoFactoryContractAddress: body['address'],
        type: SAVE_DAO_FACTORY
      })
    }
  }
}