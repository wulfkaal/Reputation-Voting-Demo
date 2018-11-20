import merge from 'lodash/merge'
import {
  RECEIVE_NOTIFICATION,
  RESET_NEW_NOTIFICATION
} from '../actions/notifications'

const initialState = {
  new: {
    _id: 'new', 
    userId: null,
    title: null,
    message: null
  }
}

const notifications = (state = initialState, action) => {
  switch(action.type) {
  case RECEIVE_NOTIFICATION:
    if(!action.notification){
      console.log(`NOTIFICATION: ${action.notification}`)
    }
    
    let notification = merge(
      {}, state[action.notification._id], action.notification)
    return merge({}, state, {[action.notification._id]: notification})
  case RESET_NEW_NOTIFICATION:
    return merge({}, state, initialState)
  default:
    return state
  }
}

export default notifications