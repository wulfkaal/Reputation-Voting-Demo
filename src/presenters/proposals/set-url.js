import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import baseComponentStyle from '../../jss/base-component'

const setUrl = (props) => {
  return (
    <div>
      <Paper className={props.classes.paper}>
        URL: {props.proposal.url}
      </Paper>
    </div>
  )
}

export default withStyles(baseComponentStyle)(setUrl)