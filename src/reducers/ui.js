import merge from 'lodash/merge'
import {
  HANDLE_PROFILE_MENU
} from '../actions/ui'
import Notification from 'rc-notification'
let notification = null
Notification.newInstance({}, (n) => notification = n)

const initialState = {
  profileMenuAnchorEl: null,
  notification: notification
}

const ui = (state = initialState, action) => {
  switch(action.type) {
  case HANDLE_PROFILE_MENU:
    return merge({}, state, {profileMenuAnchorEl : action.profileMenuAnchorEl})
  default:
    return state
  }
}

export default ui