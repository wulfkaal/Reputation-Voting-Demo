import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import NewProposalScreen from '../presenters/new-proposal/screen'
import {
  saveProposal,
  persistProposal
} from '../actions/proposals'
import {
  getUser
} from '../actions/users'


const mapStateToProps = (state, ownProps) => {  
  return {
    proposal: state.proposals.new,
    user: state.users['wulf@semada.io']
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    saveProposal: proposal => {
      dispatch(saveProposal(proposal))
    },
    persistProposal: (proposal, userId) => {
      proposal.userId = userId
      // TODO: don't hardcode dao ID
      proposal.daoId = 1
      dispatch(persistProposal(proposal))
      .then((result) => {
        ownProps.history.push(`/proposals/${result.proposal._id}/pay`)
      })
    },
    getUser: email => {
      return dispatch(getUser(email))
    }
  }
}

class NewProposal extends Component {

  async componentDidMount() {
    // TODO : Remove hard coding
    this.props.getUser('wulf@semada.io')
  }

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
