import React from 'react'
import getPageContext from '../config/get-page-context';
import JssProvider from 'react-jss/lib/JssProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {connect} from 'react-redux'
import values from 'lodash/values'
import {
  PROPOSAL_STATUSES,
  saveProposal,
  persistProposal
} from '../actions/proposals'

const mapStateToProps = (state, ownProps) => {  
  return {
    baseProposals: values(state.proposals)
      .filter(p => p._id !== 'new' && p.status === PROPOSAL_STATUSES.active) 
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    baseSaveProposal: proposal => {
      dispatch(saveProposal(proposal))
    },
    basePersistProposal: (proposal) => {
      dispatch(persistProposal(proposal))
    },
  }
}

const AppWrapperHOC = Page => class AppWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
  }
    
  pageContext = null;

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
    
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.manageProposals()
    }, 1000)
    
  }
  
  async manageProposals() {
    let proposals = this.props.baseProposals
        
    for(let i = 0; i < proposals.length; i++){
      let proposal = {...proposals[i]}
      //check proposal voteTimeEnd, 
      // if time remaining, do random vote (yes, no, skip)
      // if no time remaining, update status based on votes
      // saveProposal,persistProposal every time anything is changed
      // (including voteTimeRemaining)
      let now = new Date().getTime()
      let remaining = proposal.voteTimeEnd - now
      
      remaining = remaining < 0 ? 0 : Math.floor(remaining / 1000)
      proposal.voteTimeRemaining = remaining
      
      if(remaining > 0) {
        // random vote
        let vote = Math.floor(Math.random() * 5)
        let repStaked = Math.floor(Math.random() * 5)
        switch(vote){
        case 0:
          proposal.yesVotes += 1
          proposal.repStaked += repStaked
          break;
        case 2:
          proposal.noVotes += 1
          proposal.repStaked += repStaked
          break;
        }
      } else {
        // out of time, update status
        let quorumReached = (proposal.yesVotes + proposal.noVotes) >= 6
        if(quorumReached && proposal.yesVotes >= proposal.noVotes) {
          proposal.status = PROPOSAL_STATUSES.pass
        } else if(quorumReached && proposal.yesVotes < proposal.noVotes) {
          proposal.status = PROPOSAL_STATUSES.fail
        } else {
          proposal.status = PROPOSAL_STATUSES.timeout
        }
      }
      this.props.baseSaveProposal(proposal)
      this.props.basePersistProposal(proposal)

    }
  }
  
  componentWillUnmount () {
    clearInterval(this.timer)
  }
  
  render () {
    // const { Component, pageProps, reduxStore } = this.props;
    
    return (
      <div>
        {/* Wrap every page in Jss and Theme providers */}
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            
            <Page pageContext={this.pageContext} {...this.props} />
          </MuiThemeProvider>
        </JssProvider>
      </div>
    )
  }
}

export default Page => connect(mapStateToProps, mapDispatchToProps)
  (AppWrapperHOC(Page))