import React from 'react'
import AppWrapper from './app-wrapper'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  pageTitle: {
    flexGrow: 1,
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
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2
  },
})

const LayoutHOC = Page => class Layout extends React.Component {

  render () {
    
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={this.props.classes.pageTitle}>
            Index Toolbar
            </Typography>
            <Button color='inherit'
              onClick={() => this.props.history.push('/proposals/1')}
            >
              Proposal 1
            </Button>
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

export default Page => withStyles(styles)(AppWrapper(LayoutHOC(Page)))