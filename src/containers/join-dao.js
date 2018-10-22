import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import JoinDaoScreen from '../presenters/join-dao/screen'
import {
  saveProposal,
  persistProposal,
  resetNewProposal,
  PROPOSAL_STATUSES
} from '../actions/proposals'
import { 
  getDaos,
  receiveRepBalance,
  showRepBalance
} from '../actions/daos'
import getWeb3 from '../utils/get-web3'
import getTokenBalance from '../utils/getTokenBalance'


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
    showRepBalanceFunc: () => {
      dispatch(showRepBalance())
    },
    getDaos: () => {
      dispatch(getDaos())
    },
    saveProposal: proposal => {
      dispatch(saveProposal(proposal))
    },
    joinDao: async (proposal, userId, dao, web3, semadaCoreContract) => {
      web3 = getWeb3(web3)
      let publicAddress = await web3.eth.getCoinbase()
      semadaCoreContract.setProvider(web3.currentProvider)
      let semadaCoreInstance = await semadaCoreContract.deployed()
     
      try {        
        let trx = await semadaCoreInstance.joinDao(
        dao.tokenNumberIndex,
        {from: publicAddress, value: proposal.stake})
        let proposalIndex = trx.logs[0].args.proposalIndex
        let timeout = trx.logs[0].args.timeout
        await dispatch(persistProposal({
            _id: proposal._id,
            userId: userId,
            daoId: dao._id,
            name: 'Join DAO',
            evidence: '',
            proposalIndex: proposalIndex,
            tokenNumberIndex: dao.tokenNumberIndex,
            status: PROPOSAL_STATUSES.active,
            voteTimeEnd: timeout,
            voteTimeRemaining: timeout - (parseInt(new Date()/1000)),
            noRepStaked: proposal.stake/2,
            yesRepStaked: proposal.stake/2
          }))
        let tokenBal = await getTokenBalance(web3, semadaCoreContract, dao.tokenNumberIndex)
        dispatch(receiveRepBalance(tokenBal))
        dispatch(resetNewProposal())
        ownProps.history.push(`/daos/${dao._id}/proposals`)
      } catch (e) {
        alert(`Failed to submit join dao: ${e}`)  
      }
    }
  }
}

class JoinDao extends Component {

  componentDidMount() {
    this.props.getDaos()
    if(!this.props.showRepBalance){
      this.props.showRepBalanceFunc()
    }
  }

  render() {
    return (
      <div>
        <JoinDaoScreen {...this.props} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(JoinDao)
)
