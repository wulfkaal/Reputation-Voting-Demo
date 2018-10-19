import React, { Component } from 'react'
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import DaosScreen from '../presenters/daos/screen'
import { 
  getDaos,
  receiveRepBalance,
  hideRepBalance,
 } from '../actions/daos'
import {
  persistProposal
} from '../actions/proposals'
import {PROPOSAL_STATUSES} from '../actions/proposals'
import getWeb3 from '../utils/get-web3'
import getTokenBalance from '../utils/getTokenBalance'


const mapStateToProps = (state, ownProps) => {  
  return {
    daos: state.daos
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getDaos: () => {
      dispatch(getDaos())
    },
    handleViewDaoClick: id => {
      ownProps.history.push(`/daos/${id}/proposals`)  
    },
    hideRepBalance: () => {
      dispatch(hideRepBalance())
    },
    joinDao: async (web3, semadaCoreContract, dao) => {
     
      web3 = getWeb3(web3)
      let publicAddress = await web3.eth.getCoinbase()
      semadaCoreContract.setProvider(web3.currentProvider)
      let semadaCoreInstance = await semadaCoreContract.deployed()
      
      try {        
        let trx = await semadaCoreInstance.joinDao(dao.tokenNumberIndex, 
          {from: publicAddress, value:20})  
          
        let proposalIndex = trx.logs[0].args.proposalIndex
        
        await dispatch(persistProposal({
          _id: 'new',
          daoId: dao._id,
          name: 'Join DAO',
          evidence: '',
          proposalIndex: proposalIndex,
          status: PROPOSAL_STATUSES.active
        }))
        let tokenBal = await getTokenBalance(web3, semadaCoreContract, dao.tokenNumberIndex)
        dispatch(receiveRepBalance(tokenBal))
      } catch (e) {
        alert(`Failed to submit new DAO proposal: ${e}`)  
      }
                 
      ownProps.history.push(`/daos/${dao._id}/proposals`)
    },
  }
}

class DaoList extends Component {

  componentDidMount() {
    this.props.getDaos()
    if(this.props.showRepBalance){
      this.props.hideRepBalance()
    }
  }

  render() {

    
    return (
      <div>
        <DaosScreen 
          {...this.props} 
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsWideLayout(DaoList)
)
