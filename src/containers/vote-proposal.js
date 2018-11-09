import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import VoteProposalScreen from '../presenters/vote-proposal/screen'
import {
  getProposal,
  saveProposal,
  persistProposal
} from '../actions/proposals'
import { getDao } from '../actions/daos'
import { 
  receiveRepBalance,
  showRepBalance
} from '../actions/daos'
import SemadaCore from '../utils/semada-core'
import getWeb3 from '../utils/get-web3'

const mapStateToProps = (state, ownProps) => {  
  let id = ownProps.match.params.id
  
  return {
    proposal: state.proposals[id],
    dao: state.daos.dao
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showRepBalance: () => {
      dispatch(showRepBalance())
    },
    getProposal: id => {
      dispatch(getProposal(id))
    },
    getDao: daoId => {
      dispatch(getDao(daoId))
    },
    saveProposal: (proposal) => {
      dispatch(saveProposal(proposal))
    },
    voteProposal: async (proposal) => {
      let web3 = await getWeb3()
      let publicAddress = await web3.eth.getCoinbase()
      
      await SemadaCore.vote(proposal.tokenNumberIndex, 
        proposal.proposalIndex,
        publicAddress,
        proposal.vote,
        proposal.stake
        )
      
      if(proposal.vote){
        proposal.yesRepStaked = parseInt(proposal.yesRepStaked) + 
          parseInt(proposal.stake)
      } else {
        proposal.noRepStaked = parseInt(proposal.noRepStaked) +
          parseInt(proposal.stake)
      }
      proposal.totalRepStaked = parseInt(proposal.totalRepStaked) +
        parseInt(proposal.stake)
      
      await dispatch(persistProposal(proposal))
      // let tokenBal = await chain.getTokenBalance(proposal.tokenNumberIndex)
      let repBalance = 
        await SemadaCore.getRepBalance(proposal.tokenNumberIndex, publicAddress)
      dispatch(receiveRepBalance(repBalance))
      ownProps.history.push(`/proposals/${proposal._id}`)
    }
  }
}

class VoteProposal extends Component {
  
  componentDidMount() {
    let id = this.props.match.params.id
    this.props.getProposal(id)
    this.props.getDao(this.props.match.params.daoId)
    if(!this.props.showRepBalance){
      this.props.showRepBalance()
    }
  }

  render() {
    if(this.props.proposal) {
      return (
        <div>
          <VoteProposalScreen {...this.props} />
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(VoteProposal)
)
