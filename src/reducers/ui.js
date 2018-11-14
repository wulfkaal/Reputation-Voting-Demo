import merge from 'lodash/merge'
import {
  HANDLE_PROFILE_MENU
} from '../actions/ui'

const initialState = {
  profileMenuAnchorEl: null,
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