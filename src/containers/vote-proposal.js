import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import VoteProposalScreen from '../presenters/vote-proposal/screen'
import {
  getProposal,
  saveProposal,
  persistProposal
} from '../actions/proposals'
import { getDao } from '../actions/daos'
import { 
  receiveRepBalance,
  showRepBalance
} from '../actions/daos'
import voteProposal from '../utils/voteProposal'
import getTokenBalance from '../utils/getTokenBalance'

const mapStateToProps = (state, ownProps) => {  
  let id = ownProps.match.params.id
  
  return {
    proposal: state.proposals[id],
    dao: state.daos.dao,
    user: state.users['wulf@semada.io']
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showRepBalance: () => {
      dispatch(showRepBalance())
    },
    getProposal: id => {
      dispatch(getProposal(id))
    },
    getDao: daoId => {
      dispatch(getDao(daoId))
    },
    saveProposal: (proposal) => {
      dispatch(saveProposal(proposal))
    },
    voteProposal: async (proposal) => {
      proposal = await voteProposal(proposal, false)
      await dispatch(persistProposal(proposal))
      let tokenBal = await getTokenBalance(proposal.tokenNumberIndex)
      dispatch(receiveRepBalance(tokenBal))
      ownProps.history.push(`/proposals/${proposal._id}`)
    }
  }
}

class VoteProposal extends Component {
  
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
      return (
        <div>
          <VoteProposalScreen {...this.props} />
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(VoteProposal)
)
