import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import NewProposalScreen from '../presenters/new-proposal/screen'
import {
  saveProposal,
  persistProposal,
  PROPOSAL_STATUSES
} from '../actions/proposals'
import { getDaos } from '../actions/daos'
import getWeb3 from '../utils/get-web3'


const mapStateToProps = (state, ownProps) => {  
  let daoId = ownProps.match.params.id
  
  return {
    dao: state.daos[daoId],
    proposal: state.proposals.new,
    user: state.users['wulf@semada.io']
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getDaos: () => {
      dispatch(getDaos())
    },
    saveProposal: proposal => {
      dispatch(saveProposal(proposal))
    },
    persistProposal: async (proposal, userId, dao, web3, semadaCore) => {
      web3 = getWeb3(web3)
      let publicAddress = await web3.eth.getCoinbase()
      semadaCore.setProvider(web3.currentProvider)
      let semadaCoreInstance = await semadaCore.deployed()
      
      try {        
        let trx = await semadaCoreInstance.newProposal(
         dao.tokenNumberIndex,
         proposal.evidence,
         proposal.evidence,
        {from: publicAddress, value:2})  
        let proposalIndex = trx.logs[0].args.proposalIndex
        let result = await dispatch(persistProposal({
                        _id: proposal._id,
                        userId: userId,
                        daoId: dao._id,
                        name: proposal.evidence,
                        evidence: proposal.evidence,
                        proposalIndex: proposalIndex,
                        status: PROPOSAL_STATUSES.active
                      }))
        ownProps.history.push(`/proposals/${result.proposal._id}`)
      } catch (e) {
        alert(`Failed to submit new proposal: ${e}`)  
      }
    }
  }
}

class NewProposal extends Component {

  componentDidMount() {
    this.props.getDaos()
  }

  render() {
    return (
      <div>
        <NewProposalScreen {...this.props} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(NewProposal)
)
