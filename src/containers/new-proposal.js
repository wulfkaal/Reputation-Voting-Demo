import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import NewProposalScreen from '../presenters/new-proposal/screen'
import {
  saveProposal,
  persistProposal,
  resetNewProposal,
  PROPOSAL_STATUSES
} from '../actions/proposals'
import { 
  getDaos,
  receiveRepBalance,
  showRepBalance
} from '../actions/daos'
import SemadaCore from '../utils/semada-core'
import getWeb3 from '../utils/get-web3'

const mapStateToProps = (state, ownProps) => {  
  let daoId = ownProps.match.params.id
  
  return {
    dao: state.daos[daoId],
    proposal: state.proposals.new,
    user: state.users['wulf@semada.io']
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showRepBalance: () => {
      dispatch(showRepBalance())
    },
    getDaos: () => {
      dispatch(getDaos())
    },
    saveProposal: proposal => {
      dispatch(saveProposal(proposal))
    },
    persistProposal: async (proposal, userId, dao) => {
      let web3 = await getWeb3()
      let publicAddress = await web3.eth.getCoinbase()
      proposal = await SemadaCore.newProposal(proposal, dao.tokenNumberIndex)
      
      let result = await dispatch(persistProposal({
                      _id: proposal._id,
                      userId: userId,
                      daoId: dao._id,
                      name: proposal.name,
                      evidence: proposal.evidence,
                      proposalIndex: proposal.proposalIndex,
                      tokenNumberIndex: dao.tokenNumberIndex,
                      status: PROPOSAL_STATUSES.active,
                      voteTimeEnd: proposal.timeout,
                      voteTimeRemaining: proposal.timeout - (parseInt(new Date()/1000)),
                      noRepStaked: proposal.stake/2,
                      yesRepStaked: proposal.stake/2,
                      votes: proposal.votes
                    }))
      let tokenBal = await SemadaCore.getTokenBalance(dao.tokenNumberIndex)
      dispatch(receiveRepBalance(tokenBal))
      dispatch(resetNewProposal())
      ownProps.history.push(`/${dao._id}/proposals/${result.proposal._id}`)
    }
  }
}

class NewProposal extends Component {

  componentDidMount() {
    this.props.getDaos()
    if(!this.props.showRepBalance){
      this.props.showRepBalance()
    }
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
