import merge from 'lodash/merge'
import {
  PROPOSAL_STATUSES,
  RECEIVE_PROPOSAL,
  RESET_NEW_PROPOSAL,
  SAVE_VOTE
} from '../actions/proposals'

const initialState = {
  new: {
    _id: 'new', 
    stake: 0, 
    status: PROPOSAL_STATUSES.active,
    voteTimeRemaining: '',
    noRepStaked: 0,
    yesRepStaked: 0,
    evidence: '',
    name: ''
  },
  vote: false,
  rep: 0
}

const proposals = (state = initialState, action) => {
  switch(action.type) {
  case RECEIVE_PROPOSAL:
    let proposal = merge({}, state[action.proposal._id], action.proposal)
    return merge({}, state, {[action.proposal._id]: proposal})
  case RESET_NEW_PROPOSAL:
    return merge({}, state, {new: initialState.new})
  case SAVE_VOTE:
    return merge({}, state, action.vote)
  default:
    return state
  }
}

export default proposals