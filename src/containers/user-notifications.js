import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import UserNotificationsScreen from '../presenters/user-notifications/screen'
import {
  getUser
} from '../actions/users'
import { hideRepBalance } from '../actions/daos'
import { getNotifications } from '../actions/notifications'

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
    }
  }
}

class UserNotifications extends Component {
  
  async componentDidMount() {
    let email = this.props.match.params.email
    if(this.props.showRepBalance){
      this.props.hideRepBalance()
    }
  }

  render() {
    if(this.props.user) {    
      return (
        <div>
          <UserNotificationsScreen {...this.props} />
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(UserNotifications)
)
