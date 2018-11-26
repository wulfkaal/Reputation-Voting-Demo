import React from 'react'
import values from 'lodash/values'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const screen = (props) => {

  let notifications = values(props.notifications)
    .filter(p => p._id !== 'new')
    .map((notification, i) => {
      return (
        <ListItem 
        key={notification._id}
        role={undefined}
        >
          <Typography variant='body1'>
            <ListItemText primary={ notification.title } />
            <ListItemText primary={ notification.message } />
            <ListItemText> Created on : { 
              new Date(notification.createDate).toUTCString() }
            </ListItemText>
          </Typography>
        </ListItem>
      )
    })
  
  return (
    <div align="center">
      <Grid item xs={24} sm={12} md={6}>
        <Card className={props.classes.cardWithHeader}>
          <CardHeader
            classes={{
              root: props.classes.cardHeader,
              title: props.classes.cardHeaderContent,
              subheader: props.classes.cardHeaderContent,
            }}
            title="Notifications"
            subheader=""
          />
          <div className={props.classes.cardContent}>
            <List component="nav">
              {notifications}
            </List>
          </div>
        </Card>            
      </Grid>
    </div>
  )
}

export default withStyles(baseComponentStyle)(screen)

