import merge from 'lodash/merge'
import {
  LOGIN,
  LOGOUT,
} from '../actions/auth'

const initialState = {
  access_token: null,
  web3: null,
  publicAddress: null,
  repBalance: null
}

const auth = (state = initialState, action) => {
  switch(action.type) {
  case LOGIN:
    return merge({}, state, {
      "web3": action.web3, 
      "access_token" : action.access_token, 
      "semadaCore": action.semadaCore
    })
  case LOGOUT:
    return merge({}, state, initialState)
  default:
    return state
  }
}

export default auth