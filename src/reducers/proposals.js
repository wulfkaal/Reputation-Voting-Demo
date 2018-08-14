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
    //HACK: setting proposal status in reducer.
    //This should probably happen in the API.
    let now = new Date().getTime()
    if(proposal.yesVotes >= 5) {
      proposal.status = PROPOSAL_STATUSES.pass
    } else if(proposal.noVotes >= 5) {
      proposal.status = PROPOSAL_STATUSES.fail
    } else if(proposal.voteTimeEnd < now) {
      proposal.status = PROPOSAL_STATUSES.timeout
    } else {
      proposal.status = PROPOSAL_STATUSES.active
    }
    
    
    return merge({}, state, {[action.proposal._id]: proposal})
  case RESET_NEW_PROPOSAL:
    return merge({}, state, initialState)
  default:
    return state
  }
}

export default proposals