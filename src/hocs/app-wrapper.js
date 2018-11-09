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
import {
  login,
  logout
} from '../actions/auth'
import { receiveRepBalance } from '../actions/daos'
import getWeb3 from '../utils/get-web3'
import SemadaCore from '../utils/semada-core'

const mapStateToProps = (state, ownProps) => {  
  return {
    showRepBalance: state.daos.showRepBalance,
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
    baseSaveProposal: async (proposal) => {
      dispatch(saveProposal(proposal))
    },
    basePersistProposal: async (proposal) => {
      dispatch(persistProposal(proposal))
    },
    saveRepBalance: async (tokenBal) => {
      dispatch(receiveRepBalance(tokenBal))
    },
    login: async () =>{
      let web3 = await getWeb3()
      let publicAddress = await web3.eth.getCoinbase()
      let nonce = Math.floor(Math.random() * 10000)
      let email = "test20@test.com"
      let signature = null
      
      try {
        let response = await fetch(
                `${process.env.REACT_APP_SEMADA_DEMO_API_URL}/users/publicaddress/${publicAddress}`
                )
        const usersRes = await response.json()
        let userRes
        if(usersRes['users'].length){
          userRes = usersRes['users'][0]
        } else {
          let user = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/users`, {
                              body: JSON.stringify({ publicAddress, nonce, email }),
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              method: 'POST'
                                                    })
          userRes = await user.json()
        }
        nonce = userRes['nonce']
        signature = await web3.eth.personal.sign(
                                  web3.utils.utf8ToHex(`I am signing my one-time nonce: ${nonce}`),
                                  publicAddress
                                )
      // Send signature to backend on the /auth route
        let authRes = await fetch(`${process.env.REACT_APP_SEMADA_DEMO_API_URL}/users/auth`, {
          body: JSON.stringify({ publicAddress, signature }),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        })
        let tokenRes = await authRes.json()
        dispatch(login(tokenRes['accessToken']))
        
        try {
          //this is to handle initializing the wallet when using the 
          //API persistence layer instead of blockchain
          let balance = await SemadaCore.getSemBalance(publicAddress)
          if(balance === 0){
            await SemadaCore.setSemBalance(publicAddress, 0)
          }
        } catch (err) {
          //do nothing as the blockchain layer doesn't need this.
        }
      } catch (err) {
        alert('Please sign in with MetaMask')
      }
    }
  }
}

const AppWrapperHOC = Page => class AppWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
  }
    
  pageContext = null;


  componentDidMount() {

    if (!(this.props.access_token)){
      this.props.login() 
    }
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
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