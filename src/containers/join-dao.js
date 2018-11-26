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
import { persistNotification } from '../actions/notifications'
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
    notification: state.ui.notification,
    semBalance: state.auth.semBalance
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
    saveSemBalance: async() => {
      let web3 = await getWeb3()
      let publicAddress = await web3.eth.getCoinbase()
      let semBalance = await SemadaCore.getSemBalance(publicAddress)
      dispatch(saveSemBalance(semBalance))
    },
    joinDao: async (proposal, dao, notification) => {
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
      await dispatch(persistNotification({
        email : "wulf@semada.io", 
        title : "Joined a DAO with id : " + dao._id, 
        message : proposal.stake.toString() + " wei debited"
      }))
      notification.notice({
        content: <span>{ proposal.stake.toString() } wei debited to join DAO</span>,
        duration: null,
        onClose() {
          console.log('closed join dao notification')
        },
        closable: true,
      })
      
      dispatch(resetNewProposal())
      
      let semBalance = await SemadaCore.getSemBalance(publicAddress)
      dispatch(saveSemBalance(semBalance))
      
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
    this.props.saveSemBalance()
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
