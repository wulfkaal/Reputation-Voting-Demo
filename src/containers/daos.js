import React, { Component } from 'react'
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import DaosScreen from '../presenters/daos/screen'
import { getDaos } from '../actions/daos'

const mapStateToProps = (state, ownProps) => {  
  return {
    daos: state.daos
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getDaos: () => {
      dispatch(getDaos())
    }
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
