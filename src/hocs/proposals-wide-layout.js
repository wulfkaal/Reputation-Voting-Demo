import React from 'react'
import AppWrapper from './app-wrapper'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import ListIcon from '@material-ui/icons/List'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import NotificationsActive from '@material-ui/icons/NotificationsActive'
import NotificationsNone from '@material-ui/icons/NotificationsNone'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import {connect} from 'react-redux'
import {getUser} from '../actions/users'
import {
  handleProfileMenu,
} from '../actions/ui'
import {
  logout
} from '../actions/auth'
import {markNotificationsAsSeen} from '../actions/notifications'
import {resetNewProposal} from '../actions/proposals'
import logoImage from './logo.png'

const styles = theme => ({
  logo: {
    maxHeight: '80px',
    maxWidth: '100px'
  },
  logoContainer: {
    flexGrow: 1
  },
  title: {
    marginRight: '20px',
    marginLeft: 'auto'
  },
  contentBase: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    marginTop: theme.spacing.unit * 2,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: `100%`
  },
  contentRoot: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
    marginTop: '40px'
  }
})

const mapStateToProps = (state, ownProps) => {  
  return {
    user: state.users['wulf@semada.io'],
    web3: state.auth.web3,
    access_token: state.auth.access_token,
    sem: state.auth.sem,
    profileMenuAnchorEl: state.ui.profileMenuAnchorEl,
    daoMenuAnchorEl: state.ui.daoMenuAnchorEl,
    repBalance: state.daos.rep
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getUser: email => {
      return dispatch(getUser(email))
    },
    markNotificationsAsSeen: email => {
      return dispatch(markNotificationsAsSeen(email))
    },
    handleNewProposalClick: () => {
      dispatch(resetNewProposal())
      ownProps.history.push('/proposals/new')  
    },
    handleViewDaosClick: () => {
      ownProps.history.push('/daos')  
    },
    handleProfileMenu: (event) => {
      dispatch(handleProfileMenu(event.currentTarget))
    },
    handleCloseProfileMenu: () => {
      dispatch(handleProfileMenu(null))
    },
    logout: () =>{
      dispatch(logout())
    }
  }
}


const LayoutHOC = Page => class Layout extends React.Component {

  componentDidMount() {
    // TODO : Remove hard coding
    this.props.getUser('wulf@semada.io')
  }
  
  render () {
    
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <div className={this.props.classes.logoContainer}>
              <img src={logoImage} className={this.props.classes.logo} alt='Semada' />  
            </div>
            { (this.props.dao && this.props.dao.name) && (
              <Typography className={this.props.classes.title} >
                DAO Name: <b> {this.props.dao.name}</b>
              </Typography>
            )}
            { (this.props.access_token) && (
              <Typography>
                SEM Balance: <b> {
                  isNaN(this.props.sem) ? '' : this.props.sem
                }</b>
              </Typography>
            )}
            { (this.props.showRepBalance) && (
              <Typography>
                REP Balance: <b> {
                  isNaN(this.props.repBalance) ? '' : this.props.repBalance
                }</b>
              </Typography>
            )}

            <Button color='inherit'
              onClick={() => {
                this.props.handleViewDaosClick()
              }}
            >
              <ListIcon />
              View DAO's
            </Button>

            { ( this.props.access_token ) && (
            <div>
              <IconButton
                aria-owns={ 
                Boolean(this.props.profileMenuAnchorEl) ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.props.handleProfileMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={this.props.profileMenuAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={ Boolean(this.props.profileMenuAnchorEl) }
                onClose={this.props.handleCloseProfileMenu}
              >
                <MenuItem onClick={() => {
                  this.props.handleCloseProfileMenu()
                  this.props.history.push(`/users/${this.props.user.email}`)
                }} >Profile</MenuItem>
                <MenuItem onClick={ () => {
                  this.props.handleCloseProfileMenu()
                  this.props.logout()
                  }}>Logout</MenuItem>
              </Menu>
            </div>
            )}   
            <IconButton
                onClick={() => {
                  this.props.markNotificationsAsSeen('wulf@semada.io')
                  this.props.history.push(`/notifications/${this.props.user.email}`)
                }}
                color="inherit"
              >
                { ( this.props.noOfUnseenNotification > 0 ) && (
                  <NotificationsActive />
                )} 
                { ( this.props.noOfUnseenNotification === 0 ) && (
                  <NotificationsNone />
                )}
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={this.props.classes.contentBase}>
          <div className={this.props.classes.contentRoot}>
            <div className={this.props.classes.content}>
              <Page {...this.props} /> 
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Page => withStyles(styles)(AppWrapper(
  connect(mapStateToProps, mapDispatchToProps)(LayoutHOC(Page))
))