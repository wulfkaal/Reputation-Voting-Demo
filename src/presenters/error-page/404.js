import React from 'react'
import Card from '@material-ui/core/Card'
import { withStyles } from '@material-ui/core/styles'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const screen = (props) => {

  return (
    <Card className={props.classes.card}>
      <CardContent>
        <Typography gutterBottom variant="headline" component="h2">
          Oops!
        </Typography>
        <Typography component="p">
          The page you are looking for is not found
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => props.history.push('/')}>
          Home
        </Button>
        <Button size="small" color="primary">
          Contact
        </Button>
      </CardActions>
    </Card>
  )
}

export default withStyles(baseComponentStyle)(screen)

