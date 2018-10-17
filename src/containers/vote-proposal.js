import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import VoteProposalScreen from '../presenters/vote-proposal/screen'
import {
  getProposal,
  saveProposal
} from '../actions/proposals'
import getWeb3 from '../utils/get-web3'

const mapStateToProps = (state, ownProps) => {  
  let id = ownProps.match.params.id
  
  return {
    proposal: state.proposals[id],
    user: state.users['wulf@semada.io']
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getProposal: id => {
      dispatch(getProposal(id))
    },
    saveProposal: (proposal) => {
      dispatch(saveProposal(proposal))
    },
    voteProposal: async (proposal, web3, semadaCore) => {
      console.log("In Vote Proposal")
      console.log(proposal)
      web3 = getWeb3(web3)
      let publicAddress = await web3.eth.getCoinbase()
      semadaCore.setProvider(web3.currentProvider)
      let semadaCoreInstance = await semadaCore.deployed()
      
      try {        
        await semadaCoreInstance.vote(
         proposal.proposalIndex,
         proposal.vote==='yes' ? true : false,
        {from: publicAddress, value:proposal.stake})  
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
