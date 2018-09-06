import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'

const screen = (props) => {

  return (
    <div>
      <Card className={props.classes.cardWithHeader}>
        <CardHeader
          classes={{
            root: props.classes.cardHeader,
            title: props.classes.cardHeaderContent,
            subheader: props.classes.cardHeaderContent,
          }}
          title="DAO Details"
          subheader=""
        />
        <div className={props.classes.cardContent}>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6}>
              <Typography variant='title'>
                {props.dao.name}
              </Typography>
            </Grid>  
          </Grid>
        </div>
      </Card>
    </div>
  )

}

export default withStyles(baseComponentStyle)(screen)