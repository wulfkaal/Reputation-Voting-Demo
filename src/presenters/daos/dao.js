import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

const dao = (props) => {
  return (
    <div>
      <ListItem 
        button
        key={props.dao._id}
        role={undefined}
        onClick={() => props.handleViewDaoClick()}
        >
        
        <Typography variant='body1'>
          <ListItemText primary={ props.dao.name } />
        </Typography>
      
        <ListItemSecondaryAction>
          <Button className={props.classes.button}
            onClick={() => props.joinDao()} >
            Join DAO
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  )
}

export default withStyles(baseComponentStyle)(dao)