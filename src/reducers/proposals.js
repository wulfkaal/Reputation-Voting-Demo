import merge from 'lodash/merge'
import {
  UPDATE_SEM_BALANCE
} from '../actions/proposals'

const initialState = {
  1: {id: 1, url: 'https://www.hackernoon.com/', semBalance: 50},
  2: {id: 2, url: 'https://www.medium.com/', semBalance: 25}
}

const proposals = (state = initialState, action) => {
  switch(action.type) {
  case UPDATE_SEM_BALANCE:
    return merge({}, state, action.balance)
  default:
    return state
  }
}

export default proposals