import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
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
        }}
        onError={errors => console.log(errors)}
      >
        <Paper className={props.classes.paper}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant='display1'>
                User Profile
              </Typography>
            </Grid>  
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant='subheading'>
                Email: {props.user.email}
              </Typography>
              <Typography variant='subheading'>
                Name: {props.user.name }
              </Typography>
              <Typography variant='subheading'>
                Your REP balance: { props.user.rep } REP
              </Typography>
              <Typography variant='subheading'>
                Your SEM Balance: { props.user.sem } SEM
              </Typography>
            </Grid>  
          </Grid>
        </Paper>
      </ValidatorForm>
    </div>
  )
}

export default withStyles(baseComponentStyle)(screen)