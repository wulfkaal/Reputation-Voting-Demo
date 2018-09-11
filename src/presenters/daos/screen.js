import React from 'react'
import values from 'lodash/values'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import List from '@material-ui/core/List';
import Dao from './dao'

const screen = (props) => {

  let daos = values(props.daos)
    .filter(p => p._id !== 'new')
    .map((dao, i) => {
      return (
        <Dao 
          dao={dao}
          history={props.history} />
      )
    })
  
  return (
    <div align="center">
      <Grid item xs={12} sm={6} md={3}>
        <Card className={props.classes.cardWithHeader}>
          <div className={props.classes.cardContent}>
            <Button className={props.classes.button}
        onClick={() => props.history.push(`/daos/new`)}>Create DAO</Button>
          <br/>
          <br/>
          </div>
        </Card> 
        <br/>
        <br/>           
      </Grid>
      <Grid item xs={24} sm={12} md={6}>
        <Card className={props.classes.cardWithHeader}>
          <CardHeader
            classes={{
              root: props.classes.cardHeader,
              title: props.classes.cardHeaderContent,
              subheader: props.classes.cardHeaderContent,
            }}
            title="Daos"
            subheader=""
          />
          <div className={props.classes.cardContent}>
            <List component="nav">
              {daos}
            </List>
          </div>
        </Card>            
      </Grid>
    </div>
  )
}

export default withStyles(baseComponentStyle)(screen)

