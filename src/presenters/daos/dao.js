import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem';


const dao = (props) => {

  return (
    <div>
      <ListItem 
        button
        onClick={() => props.history.push(`/daos/${props.dao._id}`)}>
        
        <Typography variant='body1'>
          { props.dao.name }
        </Typography>
      </ListItem>
    </div>
  )
}

export default withStyles(baseComponentStyle)(dao)