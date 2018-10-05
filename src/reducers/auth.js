import merge from 'lodash/merge'
import {
  LOGIN,
  LOGOUT,
  SAVE_DAO_FACTORY
} from '../actions/auth'

const initialState = {
  access_token: null,
  web3: null,
  daoFactoryContractAbi: null,
  daoFactoryContractAddress: null
}

const auth = (state = initialState, action) => {
  switch(action.type) {
    case SAVE_DAO_FACTORY:
    return merge({}, state, {'daoFactoryContractAbi': action.daoFactoryContractAbi, 'daoFactoryContractAddress': action.daoFactoryContractAddress})
  case LOGIN:
    return merge({}, state, {"web3": action.web3, "access_token" : action.access_token})
  case LOGOUT:
    return merge({}, state, initialState)
  default:
    return state
  }
}

export default auth