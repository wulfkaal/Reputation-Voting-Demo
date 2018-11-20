export const RECEIVE_NOTIFICATION = 'RECEIVE_NOTIFICATION'
export const RESET_NEW_NOTIFICATION = 'RESET_NEW_NOTIFICATION'

export const saveNotification = (notification) => {
  return {
    notification: notification,
    type: RECEIVE_NOTIFICATION
  }
}

export const resetNewNotification = () => {
  return {
    type: RESET_NEW_NOTIFICATION
  }
}

export const persistNotification = (notification) => {
  return async (dispatch) => {
    
    let url = `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/notifications`
    
    // mongo requires _id to be a valid 24 char hex string, so remove new
    if(notification._id === 'new'){
      delete notification._id  
    } else {
      url = url + `/${notification._id}`
    }
            
    let response = await fetch(url, {
      method: notification._id ? 'PUT' : 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notification)
    })
    
    let body = await response.json()
    
    if(body._id) {
      return dispatch({
        notification: body,
        type: RECEIVE_NOTIFICATION
      })
    }
  }
}

export const getNotifications = (userId) => {
  return async (dispatch) => {
    let response = await fetch(
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/notifications/${userId}`, {
      method: 'GET',
      mode: 'cors'
    })
    
    let body = await response.json()
    for(let i=0; i < body.notifications.length; i++){
      let notification = body.notifications[i]
      
      dispatch({
        notification: notification,
        type: RECEIVE_NOTIFICATION
      })
    }    
  }
}
