import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
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
        <Card className={props.classes.cardWithHeader}>
          <CardHeader
            classes={{
              root: props.classes.cardHeader,
              title: props.classes.cardHeaderContent,
              subheader: props.classes.cardHeaderContent,
            }}
            title="Payment Confirmed"
            subheader="Verification has begun"
          />
          <div className={props.classes.cardContent}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <Typography variant='title'>
                  Thank you for your payment. 
                </Typography>
                <br/>
                <Typography variant='caption'>
                  New SEM balance
                </Typography>
                <Typography variant='title'>
                  {props.user ? props.user.sem : ''} SEM (pending)
                </Typography>
                <Typography variant='caption'>
                  <br/>
                  Your news article proposal has been submitted for voting by DAO
                  members
                </Typography>
                
              </Grid>  
            </Grid>
            <Grid container spacing={16}>
              <Grid item xs={12} className={props.classes.contentRight}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="secondary" 
                  className={props.classes.button}
                >
                  View Proposal Status
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