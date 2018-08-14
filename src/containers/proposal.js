import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import ActiveProposalScreen from '../presenters/proposal/active-screen'
import {
  PROPOSAL_STATUSES,
  getProposal,
  saveProposal
} from '../actions/proposals'

const mapStateToProps = (state, ownProps) => {  
  let id = ownProps.match.params.id
  
  return {
    proposal: state.proposals[id]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getProposal: id => {
      return dispatch(getProposal(id))
    },
    startTimer: proposal => {
      return setInterval(() => {
        
        let remaining = Math.floor(proposal.voteTimeEnd 
          - (new Date().getTime() / 1000))
        remaining = remaining < 0 ? 0 : remaining
        
        dispatch(saveProposal({
          _id: proposal._id,
          voteTimeRemaining: remaining
        }))
      }, 1000)
    }
  }
}

class Proposal extends Component {
  
  async componentDidMount() {
    let id = this.props.match.params.id
    let result = await this.props.getProposal(id)
    await this.props.startTimer(result.proposal)
  }

  render() {
    if(this.props.proposal) {
      let display
      
      switch(this.props.proposal.status){
      case PROPOSAL_STATUSES.active:
        display = <ActiveProposalScreen {...this.props} />
        break;
      default:
        display = <ActiveProposalScreen {...this.props} />
        break;
      }
      
      return (
        <div>
          {display}
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(Proposal)
)
