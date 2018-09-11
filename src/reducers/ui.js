import merge from 'lodash/merge'
import {
  HANDLE_PROFILE_MENU,
  HANDLE_DAO_MENU
} from '../actions/ui'

const initialState = {
  profileMenuAnchorEl: null,
  daoMenuAnchorEl: null
}

const ui = (state = initialState, action) => {
  switch(action.type) {
  case HANDLE_PROFILE_MENU:
    return merge({}, state, {profileMenuAnchorEl : action.profileMenuAnchorEl});
  case HANDLE_DAO_MENU:
    return merge({}, state, {daoMenuAnchorEl : action.daoMenuAnchorEl});
  default:
    return state
  }
}

export default ui