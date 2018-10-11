import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const dao = (props) => {
  // TODO: make button click take precedence over list click
  return (
    <div>
      <ListItem 
        button
        onClick={() => props.handleViewDaoClick()}>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1'>
            { props.dao.name }
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} className={props.classes.contentRight}>
          <Button className={props.classes.button}
            onClick={() => props.joinDao()}>
            Join DAO
          </Button>
        </Grid>
      </ListItem>
    </div>
  )
}

export default withStyles(baseComponentStyle)(dao)