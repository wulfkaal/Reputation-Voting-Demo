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
import {
  persistProposal
} from '../actions/proposals'
import {
  getUser
} from '../actions/users'
import getWeb3 from '../utils/get-web3'
import getSemBalance from '../utils/getSemBalance'


const mapStateToProps = (state, ownProps) => {  
  return {
    access_token: state.auth.access_token,
    publicAddress: state.auth.publicAddress,
    proposal: state.proposal,
    dao: state.daos.new,
    semBalance: state.auth.semBalance,
    user: state.users['wulf@semada.io']
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
    saveSemBalanceFunc: async(web3) => {
      let semBalance = await getSemBalance(web3)
      dispatch(saveSemBalance(semBalance))
    },
    persistDao: async (web3, semadaCore, dao) => {
      
      // This proposal belongs to the Anchor DAO
      await dispatch(persistProposal({
        _id: 'new',
        name: 'New DAO',
        evidence: ''
      }))
      
      web3 = getWeb3(web3)
      
      let publicAddress = await web3.eth.getCoinbase()
      semadaCore.setProvider(web3.currentProvider)
      let semadaCoreInstance = await semadaCore.deployed()
      
      try {
        let trx = await semadaCoreInstance.createDao(dao.name, 
          {from: publicAddress, value:parseInt(dao.sem)})  
        // get the proposalIndex to use for checking the vote outcome later
        if (trx.logs[0].args.tokenNumberIndex) {
          let tokenNumberIndex = trx.logs[0].args.tokenNumberIndex.toNumber()
          let proposalIndex = trx.logs[1].args.proposalIndex.toNumber()
          dao.tokenNumberIndex = tokenNumberIndex
          dao.proposalIndex = proposalIndex
        } else if (trx.logs[1].args.tokenNumberIndex){
          let tokenNumberIndex = trx.logs[1].args.tokenNumberIndex.toNumber()
          let proposalIndex = trx.logs[0].args.proposalIndex.toNumber()
          dao.tokenNumberIndex = tokenNumberIndex
          dao.proposalIndex = proposalIndex
        }

        // API Create DAO
        let newDao = await dispatch(persistDao(web3, semadaCore, dao))
        await dispatch(resetNewDao())
        
        // redirect to Proposal view for new DAO
        ownProps.history.push(`/daos/${newDao.dao._id}/proposals`)
      } catch (e) {
        alert(`Failed to submit new DAO proposal: ${e}`)  
      }
      
      //TODO: Show waiting animation while voting occurs
      
      //TODO: Call SemadaCore.checkProposal() to close validation pool
      
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
    this.props.saveSemBalanceFunc(this.props.web3)
    if(this.props.showRepBalance){
      this.props.hideRepBalance()
    }
  }

  render() {
    return (
      <div>
        <NewDaoScreen {...this.props} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(NewDao)
)
