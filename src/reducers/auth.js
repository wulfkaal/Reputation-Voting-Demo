import merge from 'lodash/merge'
import {
  LOGIN,
  LOGOUT,
  SAVE_SEM_BALANCE,
  RECEIVE_SEM_BALANCE
} from '../actions/auth'

const initialState = {
  access_token: null,
  web3: null,
  publicAddress: null,
  repBalance: null
}

const auth = (state = initialState, action) => {
  switch(action.type) {
  case RECEIVE_SEM_BALANCE:
    return merge({}, state, {sem: action.sem})
  case SAVE_SEM_BALANCE:
    return merge({}, state, {semBalance: action.semBalance})
  case LOGIN:
    return merge({}, state, {"access_token" : action.access_token})
  case LOGOUT:
    return merge({}, state, initialState)
  default:
    return state
  }
}

export default auth