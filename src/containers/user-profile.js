import React, { Component } from 'react'
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import UserProfileScreen from '../presenters/user-profile/screen'
import {
  getUser
} from '../actions/users'

const mapStateToProps = (state, ownProps) => {  
  let email = ownProps.match.params.email
  
  return {
    user: state.users[email]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getUser: email => {
      return dispatch(getUser(email))
    },
  }
}

class User extends Component {
  
  async componentDidMount() {
    let email = this.props.match.params.email
    this.props.getUser(email)
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
