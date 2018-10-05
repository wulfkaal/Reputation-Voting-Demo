import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import DaoScreen from '../presenters/dao/screen'
import { getDao } from '../actions/daos'

const mapStateToProps = (state, ownProps) => {  
  let id = ownProps.match.params.id
  
  return {
    dao: state.daos[id],
    web3: state.auth.web3,
    daoFactoryContractAbi: state.auth.daoFactoryContractAbi,
    daoFactoryContractAddress: state.auth.daoFactoryContractAddress,
    access_token: state.auth.access_token
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getDao: id => {
      return dispatch(getDao(id))
    },
  }
}

class Dao extends Component {
  
  componentDidMount() {
    let id = this.props.match.params.id
    this.props.getDao(id)
  }

  render() {
    if(this.props.dao) {
      return (
        <div>
          <DaoScreen {...this.props} />
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(Dao)
)