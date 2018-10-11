import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import NewDaoScreen from '../presenters/new-dao/screen'
import {
  saveDao,
  persistDao
} from '../actions/daos'
import {
  persistProposal
} from '../actions/proposals'
import {
  getUser
} from '../actions/users'


const mapStateToProps = (state, ownProps) => {  
  return {
    web3: state.auth.web3,
    access_token: state.auth.access_token,
    daoFactoryContract: state.auth.daoFactoryContract,
    publicAddress: state.auth.publicAddress,
    proposal: state.proposal,
    dao: state.daos.new,
    user: state.users['wulf@semada.io']
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  
    saveDao: (dao) => {
      dispatch(saveDao(dao))
    },
    persistDao: async (dao) => {
      // TODO: call SemadaCore.newProposal()
      // TODO: link proposal in db to semadacore
      // API Create Proposal
      await dispatch(persistProposal({
        _id: 'new',
        name: 'New DAO',
        evidence: ''
      }))
      
      //TODO: Show waiting animation while voting occurs
      
      //TODO: Call SemadaCore.checkProposal() to close validation pool
      
      //TODO: if yes votes win, create DAO
      // TODO: link new DAO to proposal?
      // API Create DAO
      let newDao = await dispatch(persistDao(dao))
      
      // redirect to Proposal view for new DAO
      ownProps.history.push(`/daos/${newDao.dao._id}/proposals`)
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
