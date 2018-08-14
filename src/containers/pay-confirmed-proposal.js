import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import PayConfirmedProposalScreen from '../presenters/pay-confirmed-proposal/screen'
import {
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
      dispatch(getProposal(id))
    },
  }
}

class PayConfirmedProposal extends Component {
  
  componentDidMount() {
    let id = this.props.match.params.id
    this.props.getProposal(id)
  }

  render() {
    if(this.props.proposal) {
      return (
        <div>
          <PayConfirmedProposalScreen {...this.props} />
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(PayConfirmedProposal)
)
