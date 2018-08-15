import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import PayProposalScreen from '../presenters/pay-proposal/screen'
import {
  getProposal,
  saveProposal,
  persistProposal
} from '../actions/proposals'
import {
  saveUser,
  persistUser
} from '../actions/users'

const mapStateToProps = (state, ownProps) => {  
  let id = ownProps.match.params.id
  
  return {
    proposal: state.proposals[id],
    user: state.users['wulf@semada.io']
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getProposal: id => {
      dispatch(getProposal(id))
    },
    payProposal: async (user, proposal) => {
      proposal.voteTimeEnd = (new Date().getTime()) + (10 * 1000)
      
      // TODO: don't hardcode SEM reduction
      user.sem = user.sem - 1
      await dispatch(saveUser(user))
      
      await dispatch(persistUser(user))
      
      await dispatch(saveProposal(proposal))
      
      await dispatch(persistProposal(proposal))
      
      ownProps.history.push(`/proposals/${proposal._id}/payconfirmed`)
    }
  }
}

class PayProposal extends Component {
  
  componentDidMount() {
    let id = this.props.match.params.id
    this.props.getProposal(id)
  }

  render() {
    if(this.props.proposal) {
      return (
        <div>
          <PayProposalScreen {...this.props} />
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(PayProposal)
)
