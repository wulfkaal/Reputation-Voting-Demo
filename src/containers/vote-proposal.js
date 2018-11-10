import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import VoteProposalScreen from '../presenters/vote-proposal/screen'
import {
  getProposal,
  saveProposal,
  persistProposal,
  saveVote
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
    dao: state.daos.dao,
    vote: state.proposals.vote,
    rep: state.proposals.rep
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
    saveVote: (vote, rep) => {
      dispatch(saveVote(vote, rep))
    },
    voteProposal: async (proposal, vote, rep) => {
      let web3 = await getWeb3()
      let publicAddress = await web3.eth.getCoinbase()
      
      await SemadaCore.vote(proposal.tokenNumberIndex, 
        proposal.proposalIndex,
        publicAddress,
        vote,
        parseInt(rep)
        )
      
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
