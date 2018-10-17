import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ProposalItem from './proposal-item'


import baseComponentStyle from '../../jss/base-component'


const activeProposalItem = (props) => {
  return (
    <div>
      <ProposalItem 
        proposal={props.proposal}
        history={props.history} />
      <Button className={props.classes.button}
        onClick={() => props.vote()} >
        Vote
      </Button>
    </div>
  )
}

export default withStyles(baseComponentStyle)(activeProposalItem)