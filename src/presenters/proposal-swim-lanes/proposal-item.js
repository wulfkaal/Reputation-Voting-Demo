import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import { ValidatorForm} from 'react-material-ui-form-validator'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {PROPOSAL_STATUSES} from '../../actions/proposals'
import Avatar from '@material-ui/core/Avatar';


const proposalItem = (props) => {
  //Data to display:
  // % of DAO REP tokens allocated (random)
  // yes votes
  // no votes
  let totalVotes = props.proposal.yesVotes + props.proposal.noVotes
  let yesVotes = props.proposal.yesVotes
  let noVotes = props.proposal.noVotes
  let yesVotePercent = Math.floor(100 * (props.proposal.yesVotes / totalVotes))
  let noVotePercent = Math.floor(100 * (props.proposal.noVotes / totalVotes))
  
  yesVotePercent = isNaN(yesVotePercent) ? 0 : yesVotePercent
  noVotePercent = isNaN(noVotePercent) ? 0 : noVotePercent
  
  let repPercent = Math.floor(100 * 
    (props.proposal.repStaked / props.totalRepStaked))
    
  return (
    <div>
      <ListItem 
        button
        onClick={() => props.history.push(`/proposals/${props.proposal._id}`)}>
        
        <Typography variant='body1'>
          {repPercent}%
          <br/>
          REP
        </Typography>
        <div className={props.classes.root}>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Typography 
                variant='caption' 
                className={props.classes.contentRight}>
                Yes
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='caption'>
                {props.proposal.yesVotes}&nbsp;
                ({yesVotePercent}%)
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Typography 
                variant='caption' 
                className={props.classes.contentRight}>
                No
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='caption'>
                {props.proposal.noVotes}&nbsp;
                ({noVotePercent}%)
              </Typography>
            </Grid>
          </Grid>
        </div>
      </ListItem>
    </div>
  )
}

export default withStyles(baseComponentStyle)(proposalItem)