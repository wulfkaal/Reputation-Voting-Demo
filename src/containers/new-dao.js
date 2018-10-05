import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import NewDaoScreen from '../presenters/new-dao/screen'
import {
  saveDao,
  persistDao
} from '../actions/daos'
import {
  getUser
} from '../actions/users'


const mapStateToProps = (state, ownProps) => {  
  return {
    web3: state.auth.web3,
    access_token: state.auth.access_token,
    daoFactoryContractAbi: state.auth.daoFactoryContractAbi,
    daoFactoryContractAddress: state.auth.daoFactoryContractAddress,
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
    persistDao: (dao, userId, web3, access_token, daoFactoryContractAbi, daoFactoryContractAddress) => {
      dao.userId = userId
      dispatch(persistDao(dao, web3, access_token, daoFactoryContractAbi, daoFactoryContractAddress))
      .then((result) => {
        ownProps.history.push(`/daos/${result.dao._id}`)
      })
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
