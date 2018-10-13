import React, { Component } from 'react'
import ProposalsWideLayout from '../hocs/proposals-wide-layout'
import {connect} from 'react-redux'
import ProposalSwimLanesScreen from '../presenters/proposal-swim-lanes/screen'
import {
  getProposals,
  saveProposal
} from '../actions/proposals'
import values from 'lodash/values'

const mapStateToProps = (state, ownProps) => {  
  let daoId = ownProps.match.params.id
  
  return {
    proposals: values(state.proposals)
      .filter(e => e.daoId === daoId)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getProposals: daoId => {
      dispatch(getProposals(daoId))
    },
    startTimer: () => {
      return setInterval(() => {
        let proposalList = values(ownProps.proposals)
        for(let i = 0; i < proposalList.length; i++){
          let remaining = proposalList[i].voteTimeEnd - (new Date().getTime())
          remaining = remaining < 0 ? 0 : Math.floor(remaining / 1000)
          
          dispatch(saveProposal({
            _id: proposalList[i]._id,
            voteTimeRemaining: remaining
          }))
        }

      }, 1000)
    }
  }
}

class ProposalSwimLanes extends Component {

  componentDidMount() {
    let daoId = this.props.match.params.id
    this.props.getProposals(daoId)
    // this.props.startTimer()
  }

  render() {
    
    return (
      <div>
        <ProposalSwimLanesScreen 
          {...this.props} 
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProposalsWideLayout(ProposalSwimLanes)
)
