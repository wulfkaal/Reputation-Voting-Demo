import merge from 'lodash/merge'
import {
  RECEIVE_NOTIFICATION,
  RECEIVE_NOTIFICATIONS,
  RESET_NEW_NOTIFICATION,
  MARK_NOTIFICATIONS_AS_SEEN
} from '../actions/notifications'

const initialState = {
  new: {
    _id: 'new', 
    userId: null,
    title: null,
    message: null
  },
  notifications: null,
  noOfUnseenNotification: 0
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
  case RECEIVE_NOTIFICATIONS:
    if(!action.notifications){
      console.log(`NOTIFICATIONS: ${action.notifications}`)
    }
    return merge({}, state, {notifications: action.notifications})
  case RESET_NEW_NOTIFICATION:
    return merge({}, state, initialState)
  case MARK_NOTIFICATIONS_AS_SEEN:
    return merge({}, state, {noOfUnseenNotification:0})
  default:
    return state
  }
}

export default notifications