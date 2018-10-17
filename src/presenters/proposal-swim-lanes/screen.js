import React from 'react'
import values from 'lodash/values'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import {PROPOSAL_STATUSES} from '../../actions/proposals'
import List from '@material-ui/core/List';
import ProposalItem from './proposal-item'
import ActiveProposalItem from './active-proposal-item'
import Button from '@material-ui/core/Button';

const screen = (props) => {
  
  let active = values(props.proposals)
  .filter(p => p._id !== 'new' && p.status === PROPOSAL_STATUSES.active)
  .map((proposal, i) => {
    return (
      <ActiveProposalItem 
        key={proposal._id}
        proposal={proposal}
        history={props.history}
        vote={() => props.vote(proposal._id)}
        />
    )
  })
    
  let pass = values(props.proposals)
  .filter(p => p.status === PROPOSAL_STATUSES.pass)
  .map((proposal, i) => {
    return (
      <ProposalItem 
        key={proposal._id}
        proposal={proposal}
        history={props.history} />
    )
  })
  
  let fail = values(props.proposals)
  .filter(p => p.status === PROPOSAL_STATUSES.fail)
  .map((proposal, i) => {
    return (
      <ProposalItem 
        key={proposal._id}
        proposal={proposal}
        history={props.history} />
    )
  })
  
  let timeout = values(props.proposals)
    .filter(p => p.status === PROPOSAL_STATUSES.timeout)
    .map((proposal, i) => {
      return (
        <ProposalItem 
          key={proposal._id}
          proposal={proposal}
          history={props.history} />
      )
    })
  
  return (
    <div>
      {(props.access_token) && (
        <Grid align="center" >
          <Grid item xs={12} sm={6} md={3}  >
            <Card className={props.classes.cardWithHeader}>
              <div className={props.classes.cardContent}>
                <Button className={props.classes.button}
            onClick={() => 
              props.history.push(`/${props.dao._id}/proposals/new`)
            }>Create Proposal</Button>
              <br/>
              <br/>
              </div>
            </Card> 
            <br/>
            <br/>           
          </Grid>
        </Grid>
      )}
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={props.classes.cardWithHeader}>
              <CardHeader
                classes={{
                  root: props.classes.cardHeader,
                  title: props.classes.cardHeaderContent,
                  subheader: props.classes.cardHeaderContent,
                }}
                title="Active"
                subheader="Voting is under way"
              />
              <div className={props.classes.cardContent}>
                <List component="nav">
                  {active}
                </List>
              </div>
            </Card>            
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={props.classes.cardWithHeader}>
              <CardHeader
                classes={{
                  root: props.classes.cardHeader,
                  title: props.classes.cardHeaderContent,
                  subheader: props.classes.cardHeaderContent,
                }}
                title="Pass"
                subheader="Majority 'Yes' votes (Yes wins tie)"
              />
              <div className={props.classes.cardContent}>
                <List component="nav">
                  {pass}
                </List>
              </div>
            </Card>            
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={props.classes.cardWithHeader}>
              <CardHeader
                classes={{
                  root: props.classes.cardHeader,
                  title: props.classes.cardHeaderContent,
                  subheader: props.classes.cardHeaderContent,
                }}
                title="Fail"
                subheader="Majority 'No' votes"
              />
              <div className={props.classes.cardContent}>
                <List component="nav">
                  {fail}
                </List>
              </div>
            </Card>            
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={props.classes.cardWithHeader}>
              <CardHeader
                classes={{
                  root: props.classes.cardHeader,
                  title: props.classes.cardHeaderContent,
                  subheader: props.classes.cardHeaderContent,
                }}
                title="Timeout"
                subheader="Voting time elapsed before quorum reached"
              />
              <div className={props.classes.cardContent}>
                <List component="nav">
                  {timeout}
                </List>
              </div>
            </Card>            
          </Grid>
        </Grid>

    </div>
  )
}

export default withStyles(baseComponentStyle)(screen)