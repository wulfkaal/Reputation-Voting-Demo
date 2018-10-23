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
import getWeb3 from '../utils/get-web3'
import getTokenBalance from '../utils/getTokenBalance'

const mapStateToProps = (state, ownProps) => {  
  let id = ownProps.match.params.id
  
  return {
    proposal: state.proposals[id],
    dao: state.daos.dao,
    user: state.users['wulf@semada.io']
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
    voteProposal: async (proposal, web3, semadaCoreContract) => {
      web3 = getWeb3(web3)
      let publicAddress = await web3.eth.getCoinbase()
      semadaCoreContract.setProvider(web3.currentProvider)
      let semadaCoreInstance = await semadaCoreContract.deployed()
      try {        
        await semadaCoreInstance.vote(
         proposal.proposalIndex,
         proposal.vote==='yes' ? true : false,
         proposal.stake,
         {from: publicAddress})
        if (proposal.vote==='yes') {
          proposal.yesRepStaked = parseInt(proposal.yesRepStaked) + parseInt(proposal.stake)
        } else {
          proposal.noRepStaked = parseInt(proposal.noRepStaked) + parseInt(proposal.stake)
        }
        proposal.vote='no'
        await dispatch(persistProposal(proposal))
        let tokenBal = await getTokenBalance(web3, semadaCoreContract, proposal.tokenNumberIndex)
        dispatch(receiveRepBalance(tokenBal))
        ownProps.history.push(`/proposals/${proposal._id}`)
      } catch (e) {
        alert(`Failed to vote for proposal: ${e}`)  
      }
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
