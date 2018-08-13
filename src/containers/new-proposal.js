import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import NewProposalScreen from '../presenters/new-proposal/screen'
import {
  saveProposal,
  persistProposal
} from '../actions/proposals'


const mapStateToProps = (state, ownProps) => {  
  return {
    proposal: state.proposals.new
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveProposal: proposal => {
      dispatch(saveProposal(proposal))
    },
    persistProposal: proposal => {
      dispatch(persistProposal(proposal))
    }
  }
}

class NewProposal extends Component {

  render() {
    return (
      <div>
        <NewProposalScreen {...this.props} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(NewProposal)
)
