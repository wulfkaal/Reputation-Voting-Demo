import React, { Component } from 'react';
import ProposalsLayout from '../hocs/proposals-layout'
import {connect} from 'react-redux'
import SetUrl from '../presenters/proposals/set-url'
import Information from '../presenters/proposals/information'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'

const mapStateToProps = (state, ownProps) => {
  let id = parseInt(ownProps.match.params.id, 10)
  
  return {
    proposal: state.proposals[id]
  }
}

const mapDispatchToProps = dispatch => {
  return {
    
  }
}

class Proposals extends Component {

  render() {
    return (
      <div>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant='headline'>
              Proposal ID: {this.props.proposal.id}
            </Typography>
          </Grid>  
        </Grid>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Information proposal={this.props.proposal} />
          </Grid>
        </Grid>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <SetUrl proposal={this.props.proposal} />
          </Grid>  
        </Grid>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsLayout(Proposals)
)
