import React, { Component } from 'react';
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import ErrorScreen from '../presenters/error-page/404'

const mapStateToProps = (state, ownProps) => {  
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}


class Error404 extends Component {
  render() {
    return (
      <div>
        <ErrorScreen {...this.props} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsWideLayout(Error404)
)