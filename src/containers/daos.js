import React, { Component } from 'react'
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import DaosScreen from '../presenters/daos/screen'
import { getDaos } from '../actions/daos'

const mapStateToProps = (state, ownProps) => {  
  return {
    daos: state.daos,
    web3: state.auth.web3,
    daoFactoryContract: state.auth.daoFactoryContract,
    access_token: state.auth.access_token,
    publicAddress: state.auth.publicAddress
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getDaos: (daoFactoryContract) => {
      dispatch(getDaos(daoFactoryContract))
    }
  }
}

class DaoList extends Component {

  componentDidMount() {
    this.props.getDaos(this.props.daoFactoryContract)
  }

  render() {
    
    return (
      <div>
        <DaosScreen 
          {...this.props} 
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsWideLayout(DaoList)
)
