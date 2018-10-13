import React, { Component } from 'react'
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import DaosScreen from '../presenters/daos/screen'
import { getDaos } from '../actions/daos'
import {
  persistProposal
} from '../actions/proposals'
import {PROPOSAL_STATUSES} from '../actions/proposals'

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
    joinDao: async (daoId) => {
      // TODO: call SemadaCore.newProposal()
      // TODO: link proposal in db to semadacore
      // API Create Proposal
      await dispatch(persistProposal({
        _id: 'new',
        daoId: daoId,
        name: 'Join DAO',
        evidence: '',
        status: PROPOSAL_STATUSES.active
      }))
      
      //TODO: Show waiting animation while voting occurs
      
      //TODO: Call SemadaCore.checkProposal() to close validation pool
      
      //TODO: notify user whether they were voted in
      
      // redirect to Proposal view for DAO they are joining
      ownProps.history.push(`/daos/${daoId}/proposals`)
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
