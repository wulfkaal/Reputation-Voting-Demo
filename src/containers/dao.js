import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import DaoScreen from '../presenters/dao/screen'
import { 
  getDao,
  receiveRepBalance,
  showRepBalance
} from '../actions/daos'
import SemadaCore from '../utils/semada-core'
import getWeb3 from '../utils/get-web3'

const mapStateToProps = (state, ownProps) => {  
  let id = ownProps.match.params.id
  
  return {
    dao: state.daos[id]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getDao: id => {
      return dispatch(getDao(id))
    },
    getRepBalance: async(dao) =>{
      let web3 = await getWeb3()
      let publicAddress = await web3.eth.getCoinbase()
      let tokenBal = 
        await SemadaCore.getRepBalance(dao.tokenNumberIndex, publicAddress)
      dispatch(receiveRepBalance(tokenBal))
    },
    showRepBalance: () => {
      dispatch(showRepBalance())
    },
  }
}

class Dao extends Component {
  
  componentDidMount() {
    let id = this.props.match.params.id
    this.props.getDao(id)
    .then(response => {
      this.props.getRepBalance(response.dao)
    })
    if(!this.props.showRepBalance){
      this.props.showRepBalance()
    }
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