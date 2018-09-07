import merge from 'lodash/merge'
import {
  HANDLE_MENU
} from '../actions/ui'

const initialState = {
  anchorEl: null
}

const ui = (state = initialState, action) => {
  switch(action.type) {
  case HANDLE_MENU:
    return merge({}, state, {anchorEl : action.anchorEl});
  default:
    return state
  }
}

export default ui