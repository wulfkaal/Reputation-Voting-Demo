export const RECEIVE_USER = 'RECEIVE_USER'
export const RESET_NEW_USER = 'RESET_NEW_USER'

export const saveUser = user => {
  return {
    user: user,
    type: RECEIVE_USER
  }
}

export const persistUser = (user) => {
  return async (dispatch) => {
    let url = 'http://localhost:3001/users'
    
    // mongo requires _id to be a valid 24 byte hex string, so remove new
    if(user._id === 'new'){
      delete user._id  
    } else {
      url = url + `/${user._id}`
    }
            
    let response = await fetch(url, {
      method: user._id ? 'PUT' : 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    
    let body = await response.json()
    
    if(body._id) {
      return dispatch({
        user: body,
        type: RECEIVE_USER
      })
    }

  }
}

export const getUser = (email) => {
  return async (dispatch) => {
    let response = await fetch(`http://localhost:3001/users/${email}`, {
      method: 'GET',
      mode: 'cors'
    })
    
    let body = await response.json()
    
    return dispatch({
      user: body,
      type: RECEIVE_USER
    })
    
  }
}
