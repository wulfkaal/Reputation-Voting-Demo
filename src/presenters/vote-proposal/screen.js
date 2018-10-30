import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import InputAdornment from '@material-ui/core/InputAdornment'
import Switch from '@material-ui/core/Switch';

const screen = (props) => {
  return (
    <div>
      <ValidatorForm
        name="form"
        onSubmit={e => {
          props.voteProposal(props.proposal)
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
            title="Vote for Proposal"
            subheader="Vote using the REP tokens within time"
          />
          <div className={props.classes.cardContent}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <Typography variant='caption'>
                  Proposal to Verify
                </Typography>
                <Typography variant='title'>
                  {props.proposal.name}
                </Typography>
                <br/>
                <Typography variant='title'>
                  <TextValidator
                    name="rep"
                    label="REP to Stake"
                    placeholder="REP to Stake"
                    className={props.classes.inputFullWidth}
                    margin="normal"
                    autoFocus={true}
                    value={props.proposal.stake}
                    validators={['required']}
                    errorMessages={['required']}
                    onChange={(e) => {
                     if (e.target.value > props.repBalance){
                      alert("Stake cannot be greater than rep balance")
                     } else {
                       props.saveProposal({
                         _id: props.proposal._id, 
                         stake: e.target.value
                       })
                     }
                    }}
                    InputProps={{
                      endAdornment: 
                      <InputAdornment position="end">REP</InputAdornment>
                    }}
                  />
                </Typography>
              </Grid>  
            </Grid>
            <Grid container spacing={16}>
              <Grid item xs={10}>
                No
                <Switch
                  onChange={(e) => {
                   let vote
                   if (e.target.value==='yes'){
                     vote='no'
                   } else {
                     vote='yes'
                   }
                   props.saveProposal({
                     _id: props.proposal._id, 
                     vote: vote
                   })
                  }}
                  value={props.proposal.vote}
                />
                Yes
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
                  Vote
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