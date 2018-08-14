import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import baseComponentStyle from '../../jss/base-component'

const styles = theme => ({
  iOSSwitchBase: {
    '&$iOSChecked': {
      color: theme.palette.common.white,
      '& + $iOSBar': {
        backgroundColor: '#52d869',
      },
    },
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp,
    }),
  },
  iOSChecked: {
    transform: 'translateX(15px)',
    '& + $iOSBar': {
      opacity: 1,
      border: 'none',
    },
  },
  iOSBar: {
    borderRadius: 13,
    width: 42,
    height: 26,
    marginTop: -13,
    marginLeft: -21,
    border: 'solid 1px',
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  iOSIcon: {
    width: 24,
    height: 24,
  },
  iOSIconChecked: {
    boxShadow: theme.shadows[1],
  },
})


const proposalType = (props) => {
  let switchSubText = 'Your REP tokens will be staked'
  if(!props.proposal.stake){
    switchSubText = 'No REP tokens at stake'
  }
  
  return (
    <div>
      <Grid container spacing={16}> 
        <Grid item xs={12}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  classes={{
                    switchBase: props.classes.iOSSwitchBase,
                    bar: props.classes.iOSBar,
                    icon: props.classes.iOSIcon,
                    iconChecked: props.classes.iOSIconChecked,
                    checked: props.classes.iOSChecked,
                  }}
                  disableRipple
                  checked={props.proposal.stake}
                  onChange={(e) => {
                    props.saveProposal({
                      _id: props.proposal._id, 
                      stake: e.target.checked
                    })
                  }}
                  value="checkedB"
                />
              }
              label="VOTE AND PUBLISH"
              labelPlacement='start'
            />
          </FormGroup>
        </Grid>  
      </Grid>
      <Grid container spacing={16}> 
        <Grid item xs={12}>
          <Typography variant='caption'>
            {switchSubText}
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles((theme) => ({
  ...styles(theme),
  ...baseComponentStyle(theme)
}),
{withTheme: true}
)(proposalType)