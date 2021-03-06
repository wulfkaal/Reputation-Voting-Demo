import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import NewDaoScreen from '../presenters/new-dao/screen'
import {
  saveDao,
  persistDao,
  resetNewDao,
  hideRepBalance
} from '../actions/daos'
import { saveSemBalance } from '../actions/auth'
import { persistNotification } from '../actions/notifications'
import {
  persistProposal,
  PROPOSAL_STATUSES
} from '../actions/proposals'
import {
  getUser
} from '../actions/users'
import SemadaCore from '../utils/semada-core'
import getWeb3 from '../utils/get-web3'

const mapStateToProps = (state, ownProps) => {  
  return {
    proposal: state.proposal,
    dao: state.daos.new,
    notification: state.ui.notification,
    semBalance: state.auth.semBalance
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideRepBalance: () => {
      dispatch(hideRepBalance())
    },
    saveDao: (dao) => {
      dispatch(saveDao(dao))
    },
    persistDao: async(dao, notification) => {
      let web3 = await getWeb3()
      let publicAddress = await web3.eth.getCoinbase()
      let proposal = await SemadaCore.createDao(publicAddress, dao, dao.sem)
      
      //save DAO
      dao.tokenNumberIndex = proposal.tokenNumberIndex
      let newDao = await dispatch(persistDao(dao))
      await dispatch(resetNewDao())
      
      //save Proposal - link to Dao (DaoID)
      await dispatch(persistProposal({
        _id: 'new',
        daoId: newDao.dao._id,
        tokenNumberIndex: proposal.tokenNumberIndex,
        proposalIndex: proposal.proposalIndex,
        name: 'New DAO',
        evidence: '',
        status: PROPOSAL_STATUSES.active,
        voteTimeEnd: proposal.timeout,
        voteTimeRemaining: proposal.timeout - (parseInt(new Date()/1000)),
        yesRepStaked: dao.sem / 2,
        noRepStaked: dao.sem / 2,
        totalRepStaked: dao.sem
      }))
      dispatch(saveSemBalance(publicAddress))
      await dispatch(persistNotification({
        email : "wulf@semada.io", 
        title : "New DAO created", 
        message : dao.sem.toString() + " wei debited"
      }))
      notification.notice({
        content: <span>{ dao.sem.toString() } wei debited to create DAO</span>,
        duration: null,
        onClose() {
          console.log('closed new dao notification')
        },
        closable: true,
      })
      
      let semBalance = await SemadaCore.getSemBalance(publicAddress)
      ownProps.history.push(`/daos/${newDao.dao._id}/proposals`)
      //TODO: Call SemadaCore.checkProposal() to close validation pool
      
    },
    saveSemBalance: async() => {
      let web3 = await getWeb3()
      let publicAddress = await web3.eth.getCoinbase()
      let semBalance = await SemadaCore.getSemBalance(publicAddress)
      dispatch(saveSemBalance(semBalance))
    },
    getUser: email => {
      return dispatch(getUser(email))
    }
  }
}

class NewDao extends Component {

  async componentDidMount() {
    // TODO : Remove hard coding
    this.props.getUser('wulf@semada.io')
    // this.props.saveSem()
    if(this.props.showRepBalance){
      this.props.hideRepBalance()
    }
    this.props.saveSemBalance()
  }

  render() {
    let screen
    if(this.props.dao) {
      screen = <NewDaoScreen {...this.props} />
    }
    
    return (
      <div>
        {screen}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(NewDao)
)
