import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import baseComponentStyle from '../../jss/base-component'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator'

const screen = (props) => {
  return (
    <div>
      <ValidatorForm
        name="form"
        onSubmit={e => {
          props.persistDao(props.dao)
        }} 
        onError={errors => console.log(errors)}
      >
        <Card className={props.classes.cardWithHeader}>
          <CardHeader
            classes={{
              root: props.classes.cardHeader,
              title: props.classes.cardHeaderContent,
              subheader: props.classes.cardHeaderContent,
            }}
            title="Specify the name of the dao"
            subheader="Enter name"
          />
          <div className={props.classes.cardContent}>
             <Grid container spacing={16}>
              <Grid item xs={10}>
                <TextValidator
                  name="name"
                  label="name"
                  placeholder="name"
                  className={props.classes.inputFullWidth}
                  margin="normal"
                  autoFocus={true}
                  value={props.dao.name}
                  validators={['required']}
                  errorMessages={['required']}
                  onChange={(e) => {
                   props.saveDao({
                     _id: props.dao._id, 
                     name: e.target.value
                   })
                  }}
                />
              </Grid>  
            </Grid>
            <Grid container spacing={16}>
              <Grid item xs={10}>
                <TextValidator
                  name="sem"
                  label="WEI"
                  placeholder="WEI"
                  className={props.classes.inputFullWidth}
                  margin="normal"
                  autoFocus={true}
                  value={props.dao.sem}
                  validators={['required']}
                  errorMessages={['required']}
                  onChange={(e) => {
                    if (isNaN(e.target.value)){
                      alert("Stake has to be a number")
                    } else if ( e.target.value > props.semBalance ) {
                      alert("Stake cannot be greater than your sem balance")
                    } else {
                      props.saveDao({
                        _id: props.dao._id, 
                        sem: e.target.value
                      })
                    }
                  }}
                />
              </Grid>  
            </Grid>
            <Grid container spacing={16}>
              <Grid item xs={12} className={props.classes.contentRight}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="secondary" 
                  className={props.classes.button}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </div>
        </Card>
      </ValidatorForm>
    </div>
  )
}

export default withStyles(baseComponentStyle)(screen)