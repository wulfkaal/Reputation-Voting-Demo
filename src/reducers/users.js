import merge from 'lodash/merge'
import {
  RECEIVE_USER
} from '../actions/users'

const initialState = {
}

const users = (state = initialState, action) => {
  switch(action.type) {
  case RECEIVE_USER:
    let user = merge({}, state[action.user.email], action.user)
    return merge({}, state, {[action.user.email]: user})
  default:
    return state
  }
}

export default users