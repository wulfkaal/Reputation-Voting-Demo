import React from 'react'
import AppWrapper from './app-wrapper'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import ListIcon from '@material-ui/icons/List'
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {connect} from 'react-redux'
import {getUser} from '../actions/users'
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
    user: state.users['wulf@semada.io']
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getUser: email => {
      return dispatch(getUser(email))
    },
    handleNewProposalClick: () => {
      dispatch(resetNewProposal())
      ownProps.history.push('/proposals/new')  
    }
  }
}

const LayoutHOC = Page => class Layout extends React.Component {

  componentWillMount(){
    this.setState({
      auth: true,
      anchorEl: null,
    });
  }

  componentDidMount() {
    // TODO : Remove hard coding
    this.props.getUser('wulf@semada.io')
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  
  render () {
    
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <div className={this.props.classes.logoContainer}>
              <img src={logoImage} className={this.props.classes.logo} alt='Semada' />  
            </div>
            
            <Typography>
              SEM Balance: <b>{this.props.user ? this.props.user.sem: ''}</b>
            </Typography>
            &nbsp;
            <Typography>
              REP Balance: <b>{this.props.user ? this.props.user.rep: ''}</b>
            </Typography>

            <Button color='inherit'
              onClick={() => {
                this.props.history.push('/daos')
              }}
            >
              <ListIcon />
              View All Daos
            </Button>
            
            <Button color='inherit'
              onClick={() => {
                this.props.history.push('/proposals')
              }}
            >
              <ListIcon />
              View All Proposals
            </Button>
              
            <Button color='inherit'
              onClick={() => {
                this.props.handleNewProposalClick()
              }}
            >
              <AddIcon />
              New Proposal
            </Button>
            { this.state.auth && (
              <div>
                <IconButton
                  aria-owns={ Boolean(this.state.anchorEl) ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={ Boolean(this.state.anchorEl) }
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={() => this.props.history.push(`/users/${this.props.user.email}`)} >Profile</MenuItem>
                  <MenuItem onClick={this.handleClose} >My account</MenuItem>
                </Menu>
              </div>
            )}
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