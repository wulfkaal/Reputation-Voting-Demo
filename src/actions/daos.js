export const RECEIVE_DAO = 'RECEIVE_DAO'
export const RESET_NEW_DAO = 'RESET_NEW_DAO'
export const RECEIVE_REP_BALANCE = 'RECEIVE_REP_BALANCE'

export const saveDao = (dao) => {
  return {
    dao: dao,
    type: RECEIVE_DAO
  }
}

export const resetNewDao = () => {
  return {
    type: RESET_NEW_DAO
  }
}

export const receiveRepBalance = (rep) => {
  return {
    rep: rep,
    type: RECEIVE_REP_BALANCE
  }
}

export const persistDao = (dao) => {
  return async (dispatch) => {
    let url = `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos`
    
    // mongo requires _id to be a valid 24 char hex string, so remove new
    if(dao._id === 'new'){
      delete dao._id  
    } else {
      url = url + `/${dao._id}`
    }
            
    let response = await fetch(url, {
      method: dao._id ? 'PUT' : 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dao)
    })
    
    let body = await response.json()
    
    if(body._id) {
      return dispatch({
        dao: body,
        type: RECEIVE_DAO
      })
    }
  }
  
  
  // daoFactoryContract.methods.createChildContract(dao.name, 100, 100).send({from: publicAddress})
  // .then(function(receipt){
  //   console.log("Receipt : ")
  //   console.log(receipt)
  // })
  // .catch(function(error){
  //     console.log(error)
  // });
  // return async (dispatch) => {
  //   let url = `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos`
  // 
  //   // mongo requires _id to be a valid 24 char hex string, so remove new
  //   if(dao._id === 'new'){
  //     delete dao._id  
  //   } else {
  //     url = url + `/${dao._id}`
  //   }
  // 
  //   let response = await fetch(url, {
  //     method: dao._id ? 'PUT' : 'POST',
  //     mode: 'cors',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(dao)
  //   })
  // 
  //   let body = await response.json()
  // 
  //   if(body._id) {
  //     return dispatch({
  //       dao: body,
  //       type: RECEIVE_DAO
  //     })
  //   }
  // }
}

export const getDao = (id) => {
  return async (dispatch) => {
    let response = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos/${id}`, {
      method: 'GET',
      mode: 'cors'
    })
    
    let body = await response.json()
    
    return dispatch({
      dao: body,
      type: RECEIVE_DAO
    })
    
  }
}

export const getDaos = (daoFactoryContract, daoContractAbi, web3, publicAddress) => {
  return async (dispatch) => {
    let response = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/daos`, {
      method: 'GET',
      mode: 'cors'
    })
    
    let body = await response.json()
    
    for(let i=0; i < body.daos.length; i++){
      dispatch({
        dao: body.daos[i],
        type: RECEIVE_DAO
      })
    }    
  }
}
