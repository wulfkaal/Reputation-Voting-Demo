import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import UserProfileScreen from '../presenters/user-profile/screen'
import {
  getUser
} from '../actions/users'
import { hideRepBalance } from '../actions/daos'

const mapStateToProps = (state, ownProps) => {  
  let email = ownProps.match.params.email
  
  return {
    user: state.users[email]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideRepBalance: () => {
      dispatch(hideRepBalance())
    },
    getUser: email => {
      return dispatch(getUser(email))
    },
  }
}

class User extends Component {
  
  async componentDidMount() {
    let email = this.props.match.params.email
    this.props.getUser(email)
    if(this.props.showRepBalance){
      this.props.hideRepBalance()
    }
  }

  render() {
    if(this.props.user) {    
      return (
        <div>
          <UserProfileScreen {...this.props} />
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(User)
)
