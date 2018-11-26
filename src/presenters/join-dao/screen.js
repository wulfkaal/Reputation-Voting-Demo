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
import {BigNumber} from 'bignumber.js'

const screen = (props) => {
  return (
    <div>
      <ValidatorForm
        name="form"
        onSubmit={e => {
          props.joinDao({...props.proposal}, props.dao, props.notification)
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
            title="Join Dao by staking SEM amount"
            subheader="Enter SEM fee"
          />
          <div className={props.classes.cardContent}>
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
                  value={Number(props.proposal.stake)}
                  validators={['required']}
                  errorMessages={['required']}
                  onChange={(e) => {
                    if (isNaN(e.target.value)){
                      alert("Stake has to be a number")
                    } else if ( e.target.value > props.semBalance ) {
                      alert("Stake cannot be greater than your sem balance")
                    } else {
                      props.saveProposal({
                        _id: props.proposal._id, 
                        stake: e.target.value
                      })
                    }
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