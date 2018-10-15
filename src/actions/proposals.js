export const RECEIVE_PROPOSAL = 'RECEIVE_PROPOSAL'
export const RESET_NEW_PROPOSAL = 'RESET_NEW_PROPOSAL'

export const PROPOSAL_STATUSES = Object.freeze({
  active: 1, 
  pass: 2, 
  fail: 3, 
  timeout: 4
})

export const saveProposal = proposal => {
  return {
    proposal: proposal,
    type: RECEIVE_PROPOSAL
  }
}

export const resetNewProposal = () => {
  return {
    type: RESET_NEW_PROPOSAL
  }
}

export const persistProposal = (proposal) => {
  return async (dispatch) => {
    let url = `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/proposals`
    
    // mongo requires _id to be a valid 24 char hex string, so remove new
    if(proposal._id === 'new'){
      delete proposal._id  
    } else {
      url = url + `/${proposal._id}`
    }
            
    let response = await fetch(url, {
      method: proposal._id ? 'PUT' : 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(proposal)
    })
    
    let body = await response.json()
    
    if(body._id) {
      return dispatch({
        proposal: body,
        type: RECEIVE_PROPOSAL
      })
    }
  }
}

export const getProposal = (id) => {
  return async (dispatch) => {
    let response = await fetch(
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/proposals/${id}`, {
      method: 'GET',
      mode: 'cors'
    })
    
    let body = await response.json()
    
    return dispatch({
      proposal: body,
      type: RECEIVE_PROPOSAL
    })
    
  }
}

export const getProposals = (daoId) => {
  return async (dispatch) => {
    let response = await fetch(
      `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/proposals/dao/${daoId}`, {
      method: 'GET',
      mode: 'cors'
    })
    
    let body = await response.json()
    
    if(body.proposals.length){
      for(let i = 0; i < body.proposals.length; i++){
        dispatch({
          proposal: body.proposals[i],
          type: RECEIVE_PROPOSAL
        })
      }
    }
    
    return {
      proposals: body
    }
  }
}
