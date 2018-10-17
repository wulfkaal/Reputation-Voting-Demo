import React, { Component } from 'react'
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import ProposalSwimLanesScreen from '../presenters/proposal-swim-lanes/screen'
import {
  getProposals,
  saveProposal
} from '../actions/proposals'
import {
  receiveRepBalance
} from '../actions/daos'
import values from 'lodash/values'
import RepContract from '../contracts/REP.json'
import getWeb3 from '../utils/get-web3'
import truffleContract from "truffle-contract"
import { getDaos } from '../actions/daos'

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
    getRepBalance: async (web3, semadaCoreContract, tokenNumberIndex) => {
      if(web3 && semadaCoreContract) {
        web3 = getWeb3(web3)
        
        let publicAddress = await web3.eth.getCoinbase()
        semadaCoreContract.setProvider(web3.currentProvider)
        let semadaCoreInstance = await semadaCoreContract.deployed()
        
        const repContract = truffleContract(RepContract)
        repContract.setProvider(web3.currentProvider)
        let rep
        
        try {
          let repAddress = await semadaCoreInstance
            .getTokenAddress(tokenNumberIndex)
          
          let repInstance = await repContract.at(repAddress)
          rep = await repInstance.balanceOf(publicAddress)
        } catch (e) {
          alert(`Failed to get REP balance: ${e}`)
        }
        
        dispatch(receiveRepBalance(rep.toNumber()))
      }
    },
    vote: (id) => {
      ownProps.history.push(`/proposals/${id}/vote`)
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
