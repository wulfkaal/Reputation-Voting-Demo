import React, { Component } from 'react'
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import DaosScreen from '../presenters/daos/screen'
import { getDaos } from '../actions/daos'
import {
  persistProposal
} from '../actions/proposals'
import {PROPOSAL_STATUSES} from '../actions/proposals'
import getWeb3 from '../utils/get-web3'

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
    joinDao: async (web3, semadaCore, dao) => {
     
      web3 = getWeb3(web3)
      let publicAddress = await web3.eth.getCoinbase()
      semadaCore.setProvider(web3.currentProvider)
      let semadaCoreInstance = await semadaCore.deployed()
      
      try {        
        let trx = await semadaCoreInstance.joinDao(dao.tokenNumberIndex, 
          {from: publicAddress, value:2000000})  
          
        let proposalIndex = trx.logs[0].args.proposalIndex
        
        await dispatch(persistProposal({
          _id: 'new',
          daoId: dao._id,
          name: 'Join DAO',
          evidence: '',
          proposalIndex: proposalIndex,
          status: PROPOSAL_STATUSES.active
        }))
      } catch (e) {
        alert(`Failed to submit new DAO proposal: ${e}`)  
      }
           
      //TODO: Show waiting animation while voting occurs
      
      //TODO: Call SemadaCore.checkProposal() to close validation pool
      
      //TODO: notify user whether they were voted in
      
      ownProps.history.push(`/daos/${dao._id}/proposals`)
    },
  }
}

class DaoList extends Component {

  componentDidMount() {
    this.props.getDaos()
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
