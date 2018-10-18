import React, { Component } from 'react'
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import ProposalSwimLanesScreen from '../presenters/proposal-swim-lanes/screen'
import {
  getProposals,
  saveProposal
} from '../actions/proposals'
import values from 'lodash/values'
import getTokenBalance from '../utils/getTokenBalance'
import { getDaos } from '../actions/daos'
import {
  receiveRepBalance
} from '../actions/daos'

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
    getDaos: () => {
      dispatch(getDaos())
    },
    getProposals: daoId => {
      dispatch(getProposals(daoId))
    },
    getRepBalance: async(web3, semadaCoreContract, tokenNumberIndex) => {
      let tokenBal = await getTokenBalance(web3, semadaCoreContract, tokenNumberIndex)
      console.log(tokenBal)
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
    this.props.getDaos()
    this.props.getProposals(daoId)
    
    // this.props.startTimer()
  }

  render() {
    this.props.semadaCore && this.props.dao && this.props.getRepBalance(this.props.web3, 
      this.props.semadaCore, 
      this.props.dao.tokenNumberIndex)
      
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
