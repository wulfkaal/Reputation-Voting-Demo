import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import ProposalType from './proposal-type'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import InputAdornment from '@material-ui/core/InputAdornment';

const screen = (props) => {
  return (
    <div>
      <ValidatorForm
        name="form"
        onSubmit={e => {
          props.persistProposal(props.proposal)
        }}
        onError={errors => console.log(errors)}
      >
        <Paper className={props.classes.paper}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant='display1'>
                Submit a news article URL for review / vote
              </Typography>
            </Grid>  
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <ProposalType 
                saveProposal={props.saveProposal} 
                proposal={props.proposal}
              />
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs={3}>
              <TextValidator
                name="url"
                label="URL"
                placeholder="URL"
                margin="normal"
                value={props.proposal.url}
                validators={['required']}
                errorMessages={['required']}
                onChange={(e) => {
                 props.saveProposal({
                   _id: props.proposal._id, 
                   url: e.target.value
                 })
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">https://</InputAdornment>,
                }}
              />
            </Grid>  
            <Grid item xs={6} className={props.classes.contentLeft}>
              <Button type="submit" variant="contained" color="primary" className={props.classes.button}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </ValidatorForm>
    </div>
  )
}

export default withStyles(baseComponentStyle)(screen)