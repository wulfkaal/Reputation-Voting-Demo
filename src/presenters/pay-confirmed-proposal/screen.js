import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { Link } from 'react-router-dom'

const screen = (props) => {
  return (
    <div>
      <ValidatorForm
        name="form"
        onSubmit={e => {
          props.history.push(`/proposals/${props.proposal._id}`)
        }}
        onError={errors => console.log(errors)}
      >
        <Paper className={props.classes.paper}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant='display1'>
                Payment Confirmed
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
                Your SEM Balance: 100 SEM
              </Typography>
              <Typography variant='subheading'>
                Thank you for your payment. 
                Your current balance is 50 SEM (Pending)
                <br/>
                Your news article proposal is submitted for a vote by DAO
                members and can be viewed&nbsp;
                <Link to={{pathname: `/proposals/${props.proposal._id}`}}>
                  here
                </Link>
              </Typography>
              
            </Grid>  
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                className={props.classes.button}
              >
                View Proposal Status
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </ValidatorForm>
    </div>
  )
}

export default withStyles(baseComponentStyle)(screen)