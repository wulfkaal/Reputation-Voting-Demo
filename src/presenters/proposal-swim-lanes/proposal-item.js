import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem';


const proposalItem = (props) => {

  let totalRepStaked = props.proposal.yesRepStaked + props.proposal.noRepStaked
  let yesRepPercent = Math.floor(100 * (props.proposal.yesRepStaked / totalRepStaked))
  let noRepPercent = Math.floor(100 * (props.proposal.noRepStaked / totalRepStaked))
  
  yesRepPercent = isNaN(yesRepPercent) ? 0 : yesRepPercent
  noRepPercent = isNaN(noRepPercent) ? 0 : noRepPercent
  
  return (
    <div>
      <ListItem 
        button
        onClick={() => props.history.push(`/proposals/${props.proposal._id}`)}>
        
        <div className={props.classes.root}>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <Typography 
                    variant='caption'>
                    {props.proposal.name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <Typography 
                    variant='caption'>
                    {props.proposal.evidence}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
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
                    {props.proposal.yesRepStaked}&nbsp;
                    ({yesRepPercent}%)
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
                    {props.proposal.noRepStaked}&nbsp;
                    ({noRepPercent}%)
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
        </div>
      </ListItem>
    </div>
  )
}

export default withStyles(baseComponentStyle)(proposalItem)