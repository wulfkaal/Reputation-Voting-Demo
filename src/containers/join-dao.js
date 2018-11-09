import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import JoinDaoScreen from '../presenters/join-dao/screen'
import {
  saveProposal,
  persistProposal,
  resetNewProposal,
  PROPOSAL_STATUSES
} from '../actions/proposals'
import { saveSemBalance } from '../actions/auth'
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
    // user: state.users['wulf@semada.io']
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showRepBalanceFunc: () => {
      dispatch(showRepBalance())
    },
    getDaos: () => {
      dispatch(getDaos())
    },
    saveProposal: proposal => {
      dispatch(saveProposal(proposal))
    },
    joinDao: async (proposal, dao) => {
      let web3 = await getWeb3()
      let publicAddress = await web3.eth.getCoinbase()
      let coreProposal = await SemadaCore
        .joinDao(dao.tokenNumberIndex, publicAddress, proposal.stake)
      
      await dispatch(persistProposal({
          _id: proposal._id,
          daoId: dao._id,
          tokenNumberIndex: dao.tokenNumberIndex,
          proposalIndex: coreProposal.proposalIndex,
          name: 'Join DAO',
          evidence: '',
          status: PROPOSAL_STATUSES.active,
          voteTimeEnd: coreProposal.timeout,
          voteTimeRemaining: coreProposal.timeout - (parseInt(new Date()/1000)),
          noRepStaked: proposal.stake/2,
          yesRepStaked: proposal.stake/2,
          totalRepStaked: proposal.stake
        }))
      
      dispatch(resetNewProposal())
      
      let semBalance = await SemadaCore.getSemBalance(publicAddress)
      dispatch(saveSemBalance(publicAddress))
      
      ownProps.history.push(`/daos/${dao._id}/proposals`)
    }
  }
}

class JoinDao extends Component {

  componentDidMount() {
    this.props.getDaos()
    if(!this.props.showRepBalance){
      this.props.showRepBalanceFunc()
    }
  }

  render() {
    let screen 
    if(this.props.proposal) {
      screen = <JoinDaoScreen {...this.props} />
    }
    
    return (
      <div>
        {screen}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(JoinDao)
)
