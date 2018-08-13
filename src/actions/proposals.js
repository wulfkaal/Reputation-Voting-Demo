export const RECEIVE_PROPOSAL = 'RECEIVE_PROPOSAL'
export const RESET_NEW_PROPOSAL = 'RESET_NEW_PROPOSAL'

export const saveProposal = proposal => {
  return {
    proposal: proposal,
    type: RECEIVE_PROPOSAL
  }
}

export const persistProposal = (proposal) => {
  return async (dispatch) => {
    // mongo requires _id to be a valid 24 byte hex string, so remove new
    if(proposal._id === 'new'){
      delete proposal._id  
    }
        
    let response = await fetch('http://localhost:3001/proposals', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(proposal)
    })
    
    let body = await response.json()
    
    await dispatch({
      proposal: body,
      type: RECEIVE_PROPOSAL
    })
    
    dispatch({
      type: RESET_NEW_PROPOSAL
    })
  }

}