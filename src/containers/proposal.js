import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import PassProposalScreen from '../presenters/proposal/pass-screen'
import FailProposalScreen from '../presenters/proposal/fail-screen'
import TimeoutProposalScreen from '../presenters/proposal/timeout-screen'
import ActiveProposalScreen from '../presenters/proposal/active-screen'
import {
  PROPOSAL_STATUSES,
  getProposal
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
  }
}

class Proposal extends Component {
  
  componentDidMount() {
    let id = this.props.match.params.id
    this.props.getProposal(id)
  }

  render() {
    if(this.props.proposal) {
      let display
      
      switch(this.props.proposal.status){
      case PROPOSAL_STATUSES.pass:
        display = <PassProposalScreen {...this.props} />
        break;
      case PROPOSAL_STATUSES.fail:
        display = <FailProposalScreen {...this.props} />
        break;
      case PROPOSAL_STATUSES.timeout:
        display = <TimeoutProposalScreen {...this.props} />
        break;
      case PROPOSAL_STATUSES.active:
        display = <ActiveProposalScreen {...this.props} />
        break;
      default:
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
