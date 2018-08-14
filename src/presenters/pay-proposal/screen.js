import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import { ValidatorForm} from 'react-material-ui-form-validator'

const screen = (props) => {
  return (
    <div>
      <ValidatorForm
        name="form"
        onSubmit={e => {
          props.payProposal(props.proposal)
        }}
        onError={errors => console.log(errors)}
      >
        <Paper className={props.classes.paper}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant='display1'>
                Pay for proposal to be validated
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
                Pay 50 SEM
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </ValidatorForm>
    </div>
  )
}

export default withStyles(baseComponentStyle)(screen)