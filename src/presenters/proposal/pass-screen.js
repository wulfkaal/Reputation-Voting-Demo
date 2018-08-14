import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'

const screen = (props) => {
  return (
    <div>
      <Paper className={props.classes.paper}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant='display1'>
              Proposal Status: Pass
            </Typography>
          </Grid>  
        </Grid>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant='subheading'>
              URL: {props.proposal.url}
            </Typography>
            <Typography variant='subheading'>
              Stake SEM Tokens: {props.proposal.stake ? 'YES' : 'NO'}
            </Typography>
            <Typography variant='subheading'>
              Cost: 50 SEM
            </Typography>
            <Typography variant='subheading'>
              Please wait while members are voting on your proposal
            </Typography>
            <Typography variant='display1'>
              Vote time remaining {props.proposal.voteTimeRemaining}
            </Typography>
          </Grid>  
        </Grid>
      </Paper>
    </div>
  )
}

export default withStyles(baseComponentStyle)(screen)