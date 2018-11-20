import React, { Component } from 'react'
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import ProposalSwimLanesScreen from '../presenters/proposal-swim-lanes/screen'
import {
  getProposals,
  saveProposal
} from '../actions/proposals'
import values from 'lodash/values'
import { getDao } from '../actions/daos'
import {
  receiveRepBalance,
  showRepBalance
} from '../actions/daos'
import SemadaCore from '../utils/semada-core'
import getWeb3 from '../utils/get-web3'

const mapStateToProps = (state, ownProps) => {  
  let daoId = ownProps.match.params.id
  return {
    notification: state.ui.notification,
    dao: state.daos[daoId],
    proposals: values(state.proposals)
      .filter(e => e.daoId === daoId)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showRepBalanceFunc: () => {
      dispatch(showRepBalance())
    },
    getDao: id => {
      return dispatch(getDao(id))
    },
    getProposals: daoId => {
      dispatch(getProposals(daoId))
    },
    getRepBalance: async(dao) => {
      let web3 = await getWeb3()
      let publicAddress = await web3.eth.getCoinbase()
      let tokenBal = 
        await SemadaCore.getRepBalance(dao.tokenNumberIndex, publicAddress)
      dispatch(receiveRepBalance(tokenBal))
    },
    addNotification: (notification, content) => {
      notification.notice({
        content: <span>{ content }</span>,
        duration: null,
        onClose() {
          console.log('closed notification')
        },
        closable: true,
      })
    }
  }
}

class ProposalSwimLanes extends Component {

  componentDidMount() {
    let daoId = this.props.match.params.id
    
    this.props.getDao(daoId)
    .then(response => {
      this.props.getProposals(daoId)
      this.props.getRepBalance(response.dao)
    })
    
    if(!this.props.showRepBalance){
      this.props.showRepBalanceFunc()
    }
    
    clearInterval(this.timer)
    this.timer = setInterval(() => {
     this.props.getDao(daoId)
     .then(response => {
       this.props.getProposals(daoId)
       this.props.getRepBalance(response.dao)
     })
   }, 5000)
   this.props.addNotification(this.props.notification, 'blah')

  }
  
  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render() {
      
    return (
      <div>
        <ProposalSwimLanesScreen 
          {...this.props} 
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsWideLayout(ProposalSwimLanes)
)
