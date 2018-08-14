import merge from 'lodash/merge'
import {
  PROPOSAL_STATUSES,
  RECEIVE_PROPOSAL,
  RESET_NEW_PROPOSAL
} from '../actions/proposals'

const initialState = {
  new: {
    _id: 'new', 
    url: '', 
    stake: true, 
    status: PROPOSAL_STATUSES.active,
    voteTimeRemaining: ''
  }
}

const proposals = (state = initialState, action) => {
  switch(action.type) {
  case RECEIVE_PROPOSAL:
    let proposal = merge({}, state[action.proposal._id], action.proposal)
    return merge({}, state, {[action.proposal._id]: proposal})
  case RESET_NEW_PROPOSAL:
    return merge({}, state, {new: {_id: 'new', url: '', stake: true}})
  default:
    return state
  }
}

export default proposals