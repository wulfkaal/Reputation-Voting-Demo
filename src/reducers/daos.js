import merge from 'lodash/merge'
import {
  RECEIVE_DAO,
  RESET_NEW_DAO
} from '../actions/daos'

const initialState = {
  new: {
    _id: 'new', 
    name: ''
  }
}

const daos = (state = initialState, action) => {
  switch(action.type) {
  case RECEIVE_DAO:
    let dao = merge({}, state[action.dao._id], action.dao)
    return merge({}, state, {[action.dao._id]: dao})
  case RESET_NEW_DAO:
    return merge({}, state, initialState)
  default:
    return state
  }
}

export default daos