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
import getSemBalance from '../utils/getSemBalance'
import createDao from '../utils/createDao'


const mapStateToProps = (state, ownProps) => {  
  return {
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
    saveSem: async() => {
      let semBalance = await getSemBalance()
      dispatch(saveSemBalance(semBalance))
    },
    persistDao: async(dao) => {
      
      dao = await createDao(dao, 20, false)
      await dispatch(persistProposal({
        _id: 'new',
        name: 'New DAO',
        evidence: ''
      }))
      // This proposal belongs to the Anchor DAO
      let newDao = await dispatch(persistDao(dao))
      await dispatch(resetNewDao())
      
      ownProps.history.push(`/daos/${newDao.dao._id}/proposals`)
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
    this.props.saveSem()
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
