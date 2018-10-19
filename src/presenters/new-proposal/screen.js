import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'

const screen = (props) => {
  return (
    <div>
      <ValidatorForm
        name="form"
        onSubmit={e => {
          props.persistProposal({...props.proposal}, props.user._id, props.dao, props.web3, props.semadaCore)
        }}
        onError={errors => console.log(errors)}
      >
        <Card className={props.classes.cardWithHeader}>
          <CardHeader
            classes={{
              root: props.classes.cardHeader,
              title: props.classes.cardHeaderContent,
              subheader: props.classes.cardHeaderContent,
            }}
            title="Submit a proposal to be verified"
            subheader="Enter URL (website address) to be verified"
          />
          <div className={props.classes.cardContent}>
            <Grid container spacing={16}>
              <Grid item xs={10}>
                <TextValidator
                  name="Name"
                  label="Name"
                  placeholder="Name"
                  className={props.classes.inputFullWidth}
                  margin="normal"
                  autoFocus={true}
                  value={props.proposal.name}
                  validators={['required']}
                  errorMessages={['required']}
                  onChange={(e) => {
                   props.saveProposal({
                     _id: props.proposal._id, 
                     name: e.target.value
                   })
                  }}
                />
              </Grid>  
            </Grid>
            <Grid container spacing={16}>
              <Grid item xs={10}>
                <TextValidator
                  name="url"
                  label="URL"
                  placeholder="URL"
                  className={props.classes.inputFullWidth}
                  margin="normal"
                  autoFocus={true}
                  value={props.proposal.evidence}
                  validators={['required']}
                  errorMessages={['required']}
                  onChange={(e) => {
                   props.saveProposal({
                     _id: props.proposal._id, 
                     evidence: e.target.value
                   })
                  }}
                  InputProps={{
                    startAdornment: 
                    <InputAdornment position="start">https://</InputAdornment>
                  }}
                />
              </Grid>  
            </Grid>
            <br/>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <Typography variant='title'>
                  <TextValidator
                  name="sem"
                  label="SEM Fee"
                  placeholder="SEM Fee"
                  className={props.classes.inputFullWidth}
                  margin="normal"
                  autoFocus={true}
                  value={props.proposal.stake}
                  validators={['required']}
                  errorMessages={['required']}
                  onChange={(e) => {
                   props.saveProposal({
                     _id: props.proposal._id, 
                     stake: Number(e.target.value)
                   })
                  }}
                  InputProps={{
                    endAdornment: 
                    <InputAdornment position="end">SEM</InputAdornment>
                  }}
                />
                </Typography>
              </Grid>  
            </Grid>
            <br/>
            <Grid container spacing={16}>
              <Grid item xs={12} className={props.classes.contentRight}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="secondary" 
                  className={props.classes.button}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </div>
        </Card>
      </ValidatorForm>
    </div>
  )
}

export default withStyles(baseComponentStyle)(screen)