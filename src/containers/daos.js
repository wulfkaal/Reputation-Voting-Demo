import React, { Component } from 'react'
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import DaosScreen from '../presenters/daos/screen'
import { 
  getDaos,
  hideRepBalance,
 } from '../actions/daos'
import values from 'lodash/values'

const mapStateToProps = (state, ownProps) => {  
  return {
    daos: values(state.daos).filter(d => {
      
      return d && d.hasOwnProperty('_id') && d._id !== 'new'
    })
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
    joinDao: (daoId) => {         
      ownProps.history.push(`/daos/${daoId}/join`)
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
