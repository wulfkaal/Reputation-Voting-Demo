import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import baseComponentStyle from '../../jss/base-component'

const information = (props) => {
  return (
    <div>
      <Paper className={props.classes.paper}>
        Proposal SEM Balance: {props.proposal.semBalance}
      </Paper>
    </div>
  )
}

export default withStyles(baseComponentStyle)(information)