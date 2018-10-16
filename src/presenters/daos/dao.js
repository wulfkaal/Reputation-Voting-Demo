import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import Grid from '@material-ui/core/Grid'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

const dao = (props) => {
  // TODO: make button click take precedence over list click
  return (
    <div>
      <ListItem 
        button
        onClick={() => props.joinDao()}>
        <Grid item xs={12} sm={6}>
          <Typography variant='body1'>
            <ListItemText primary={ props.dao.name } />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} className={props.classes.contentRight}>
          <ListItemSecondaryAction>
            <Button className={props.classes.button}
              onClick={() => props.joinDao()} >
              Join DAO
            </Button>
          </ListItemSecondaryAction>
        </Grid>
      </ListItem>
    </div>
  )
}

export default withStyles(baseComponentStyle)(dao)