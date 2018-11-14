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
import { saveSemBalance } from '../actions/auth'
import SemadaCore from '../utils/semada-core'
import getWeb3 from '../utils/get-web3'

const mapStateToProps = (state, ownProps) => {  
  let daoId = ownProps.match.params.id
  return {
    rep: state.daos.rep,
    dao: state.daos[daoId],
    proposal: state.proposals.new
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
    persistProposal: async (proposal, dao) => {
      let web3 = await getWeb3()
      let publicAddress = await web3.eth.getCoinbase()
      let coreProposal = await SemadaCore.newProposal(dao.tokenNumberIndex,
        proposal.name,
        proposal.evidence,
        publicAddress,
        proposal.stake)
      
      let result = await dispatch(persistProposal({
                      _id: proposal._id,  
                      daoId: dao._id,
                      tokenNumberIndex: dao.tokenNumberIndex,
                      proposalIndex: coreProposal.proposalIndex,
                      name: proposal.name,
                      evidence: proposal.evidence,
                      status: PROPOSAL_STATUSES.active,
                      voteTimeEnd: coreProposal.timeout,
                      voteTimeRemaining: 
                          coreProposal.timeout - (parseInt(new Date()/1000)),
                      yesRepStaked: proposal.stake/2,
                      noRepStaked: proposal.stake/2,
                      totalRepStaked: proposal.stake
                    }))
      
      let semBalance = await SemadaCore.getSemBalance(publicAddress)
      dispatch(saveSemBalance(publicAddress))
      
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
    let screen 
    if(this.props.proposal && this.props.dao) {
      screen = <NewProposalScreen {...this.props} />
    }
    
    return (
      <div>
        {screen}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(NewProposal)
)
