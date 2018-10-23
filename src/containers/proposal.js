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
import { 
  showRepBalance,
  getDao
} from '../actions/daos'

const mapStateToProps = (state, ownProps) => {  
  let id = ownProps.match.params.id
  let daoId = ownProps.match.params.daoId
  return {
    proposal: state.proposals[id],
    dao: state.daos[daoId]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showRepBalance: () => {
      dispatch(showRepBalance())
    },
    getProposal: id => {
      return dispatch(getProposal(id))
    },
    getDao: daoId => {
      dispatch(getDao(daoId))
    },
    vote: (id, daoId) => {
      ownProps.history.push(`/${daoId}/proposals/${id}/vote`)
    },
  }
}

class Proposal extends Component {
  
  componentDidMount() {
    let id = this.props.match.params.id
    this.props.getProposal(id)
    this.props.getDao(this.props.match.params.daoId)
    if(!this.props.showRepBalance){
      this.props.showRepBalance()
    }
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
