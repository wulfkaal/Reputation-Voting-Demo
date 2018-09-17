import React, { Component } from 'react';
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import loading from './loading.svg';
import { authenticate } from '../actions/auth'

const mapStateToProps = (state, ownProps) => {  
  return {
    auth0: state.auth.auth0
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleAuthentication: async (auth0) => {
      let result = await authenticate(auth0)
      dispatch(result)
      ownProps.history.push('/')      
    }
  }
}


class Callback extends Component {

  componentDidMount() {
    if (/access_token|id_token|error/.test(this.props.history.location.hash)) {
      this.props.handleAuthentication(this.props.auth0);
    }
  }


  render() {
    const style = {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    }

    return (
      <div style={style}>
        <img src={loading} alt="loading"/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsWideLayout(Callback)
)