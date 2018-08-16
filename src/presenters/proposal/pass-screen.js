import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import VoteChart from './vote-chart'

const screen = (props) => {
  let voteTimeEnd = new Date(props.proposal.voteTimeEnd)
  .toUTCString()
  
  return (
    <div>
      <Card className={props.classes.cardWithHeader}>
        <CardHeader
          classes={{
            root: props.classes.cardHeader,
            title: props.classes.cardHeaderContent,
            subheader: props.classes.cardHeaderContent,
          }}
          title="Proposal Status: Pass"
          subheader="'Yes' votes met minimum quorum required"
        />
        <div className={props.classes.cardContent}>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6}>
              <Typography variant='caption'>
                News Article
              </Typography>
              <Typography variant='title'>
                {props.proposal.url}
              </Typography>
              <br/>
              <Typography variant='caption'>
                Minimum Quorum Required
              </Typography>
              <Typography variant='title'>
                6 votes (60% of total votes)
              </Typography>
              <br/>
              <Typography variant='caption'>
                Yes Votes
              </Typography>
              <Typography variant='title'>
                {props.proposal.yesVotes}
              </Typography>
              <br/>
              <Typography variant='caption'>
                No Votes
              </Typography>
              <Typography variant='title'>
                {props.proposal.noVotes}
              </Typography>
              <br/>
              <Typography variant='caption'>
                Voting End Time
              </Typography>
              <Typography variant='title'>
                {voteTimeEnd}
              </Typography>
              <br/>
            </Grid>  
            <Grid item xs={12} sm={6}>
              <VoteChart 
                yes={props.proposal.yesVotes} 
                no={props.proposal.noVotes} />
            </Grid>
          </Grid>
        </div>
      </Card>
    </div>
  )

}

export default withStyles(baseComponentStyle)(screen)