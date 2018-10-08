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
    persistDao: (publicAddress, dao, userId, web3, access_token, daoFactoryContract) => {
      dao.userId = userId
      dispatch(persistDao(publicAddress, dao, web3, access_token, daoFactoryContract))
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
