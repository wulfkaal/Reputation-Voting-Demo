import merge from 'lodash/merge'
import {
  RECEIVE_DAO,
  RESET_NEW_DAO,
  RECEIVE_REP_BALANCE,
  DISPLAY_REP_BALANCE
} from '../actions/daos'

const initialState = {
  new: {
    _id: 'new', 
    name: '',
    tokenNumberIndex: null,
    proposalIndex: null,
    tokenAddress: null,
    sem: 0
  },
  showRepBalance: true,
  rep: 0,
  sem: 0
}

const daos = (state = initialState, action) => {
  switch(action.type) {
  case RECEIVE_DAO:
    if(!action.dao){
      console.log(`DAO: ${action.dao}`)
    }
    
    let dao = merge({}, state[action.dao._id], action.dao)
    return merge({}, state, {[action.dao._id]: dao})
  case RESET_NEW_DAO:
    return merge({}, state, initialState)
  case RECEIVE_REP_BALANCE:
    return merge({}, state, {rep: action.rep})
  case DISPLAY_REP_BALANCE:
    return merge({}, state, {showRepBalance: action.showRepBalance})
  default:
    return state
  }
}

export default daos