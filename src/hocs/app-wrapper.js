import React from 'react'
import Web3 from 'web3';
import truffleContract from "truffle-contract";
import SemadaCoreContract from '../contracts/SemadaCore.json';
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
import {
  login,
  logout
} from '../actions/auth'

const mapStateToProps = (state, ownProps) => {  
  return {
    web3: state.auth.web3,
    access_token: state.auth.access_token,
    semadaCore: state.auth.semadaCore,
    repBalance: state.daos.rep,
    baseProposals: values(state.proposals)
      .filter(p => p._id !== 'new' && 
        p.status === PROPOSAL_STATUSES.active)
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
    saveContractDetails: (publicAddress, web3) => {
      
    },
    login: (web3) =>{
      if (!window.web3) {
        window.alert('Please install MetaMask first.')
        return;
      }
      if (!web3) {
        web3 = new Web3(window.web3.currentProvider)
      }
      let promise = new Promise((resolve, reject) => {
        window.web3.eth.getCoinbase(function(err, account) {
          if(err === null) {
            return resolve({publicAddress: account})
          } else {
            return reject("error!")
          }
        })
      })

      // TODO: do something with this so not getting prompted to sign everytime
      if(true){
        promise.then(
          (result) => {
            let publicAddress = result['publicAddress']
            let nonce = Math.floor(Math.random() * 10000)
            let email = "test20@test.com"
            let signature = null
            console.log("Public Address : " + publicAddress)
            fetch(
              `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/users/publicaddress/${publicAddress}`
            ).then(response => response.json())
            // If yes, retrieve it. If no, create it.
            .then(
              (usersRes) => {
                return usersRes['users'].length ? usersRes['users'][0] : fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/users`, {
                                                    body: JSON.stringify({ publicAddress, nonce, email }),
                                                    headers: {
                                                      'Content-Type': 'application/json'
                                                    },
                                                    method: 'POST'
                                                  }).then(response => response.json())
            })
            // Popup MetaMask confirmation modal to sign message
            .then((res) => {
              nonce = res['nonce']
              return new Promise((resolve, reject) =>
                web3.eth.personal.sign(
                  web3.utils.utf8ToHex(`I am signing my one-time nonce: ${nonce}`),
                  publicAddress,
                  (err, signature) => {
                    if (err) return reject(err);
                    return resolve({ publicAddress, signature });
                  }
                )
              );
            })
            // Send signature to backend on the /auth route
            .then( (signRes) => {
              signature = signRes['signature']
              console.log("Signature : " +signature)
              fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/users/auth`, {
                body: JSON.stringify({ publicAddress, signature }),
                headers: {
                  'Content-Type': 'application/json'
                },
                method: 'POST'
              })
              .then(response => response.json()) 
              .then((tokenRes) => {
                const contract = truffleContract(SemadaCoreContract);
                dispatch(login(web3, tokenRes['accessToken'], contract))
              })
            })
            // Pass accessToken back to parent component (to save it in localStorage)
            .catch(err => {
              window.alert('Please ensure sign with MetaMask first.');
            });
          }
        ).catch(err => {
          alert('Please activate MetaMask first.') 
          return; 
        })
      }
      
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

    if (!(this.props.web3 && this.props.access_token)){
      this.props.login(this.props.web3) 
    }
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.refreshData(this.props.web3)
    }, 1000)
  }
  
  async refreshData(web3) {
    // 1. call SemadaCore.checkVote on all proposals that are not complete
    // update API with proposal status if it changes (pass/fail)
        
    let proposals = this.props.baseProposals
        
    for(let i = 0; i < proposals.length; i++){
      let proposal = {...proposals[i]}
      
      // call SemadaCore.checkVote()
      let publicAddress = await web3.eth.getCoinbase()
      const semadaCore = truffleContract(SemadaCoreContract)
      semadaCore.setProvider(web3.currentProvider)
      let semadaCoreInstance = await semadaCore.deployed()
      
      let proposalStatus = await semadaCoreInstance
        .checkVote(proposal.proposalIndex)
      
      // event is emitted with outcome (active, pass, fail)
      // event is emitted with yes rep staked
      // event is emitted with no rep stated
      switch(trx.logs[0].args.status){
      case 'pass':
        proposal.status = PROPOSAL_STATUSES.pass
        proposal.yesRepStaked = trx.logs[0].args.yesRepStaked
        this.props.baseSaveProposal(proposal)
        this.props.basePersistProposal(proposal)
        break;
      case 'fail':
        proposal.status = PROPOSAL_STATUSES.fail
        this.props.baseSaveProposal(proposal)
        this.props.basePersistProposal(proposal)      
        break;
      case 'timeout':
        proposal.status = PROPOSAL_STATUSES.timeout
        this.props.baseSaveProposal(proposal)
        this.props.basePersistProposal(proposal)
        break;
      }
      
      // save/persist proposal to API with new status
    }
    
    // 2. refresh REP balance for DAO if a DAO is currently selected
  }
  
  //Voting simulation
  //This isn't used right now, but could be in the future so I'm not deleting
  async manageProposals() {
    let proposals = this.props.baseProposals
        
    for(let i = 0; i < proposals.length; i++){
      let proposal = {...proposals[i]}
      //check proposal voteTimeEnd, 
      // if time remaining, do random vote (yes, no, skip)
      // if no time remaining, update status based on votes
      // saveProposal,persistProposal every time anything is changed
      // (including voteTimeRemaining)
     
      if(proposal.voteTimeRemaining > 0) {
        // random vote
        let vote = Math.floor(Math.random() * 5)
        let repStaked = Math.floor(Math.random() * 5)
        switch(vote){
        case 0:
        case 1:
          proposal.yesVotes += 1
          proposal.yesRepStaked += repStaked
          break;
        case 2:
          proposal.noVotes += 1
          proposal.noRepStaked += repStaked
          break;
        default:
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
        
        //set random REP % once voting is complete/timed out
        proposal.repPercent = Math.floor(Math.random() * 100)
      }
      this.props.baseSaveProposal(proposal)
      this.props.basePersistProposal(proposal)
      
    }
  }
  
  componentWillUnmount () {
    clearInterval(this.timer)
  }
  
  render () {
    
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
            {/* CssBaseline kickstart an elegant, consistent, 
              and simple baseline to build upon. */}
            <CssBaseline />
            
            <Page pageContext={this.pageContext} {...this.props} />
          </MuiThemeProvider>
        </JssProvider>
      </div>
    )
  }
}

export default Page => 
  connect(mapStateToProps, mapDispatchToProps)(AppWrapperHOC(Page))