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
    startTimer: () => {
      return setInterval(() => {
        let proposalList = values(ownProps.proposals)
        for(let i = 0; i < proposalList.length; i++){
          let remaining = proposalList[i].voteTimeEnd - (new Date().getTime())
          remaining = remaining < 0 ? 0 : Math.floor(remaining / 1000)
          
          dispatch(saveProposal({
            _id: proposalList[i]._id,
            voteTimeRemaining: remaining
          }))
        }

      }, 1000)
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
    // this.props.startTimer()
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
