import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import IndexContainer from './containers/index'
import ProposalContainer from './containers/proposal'
import PayProposalContainer from './containers/pay-proposal'
import PayConfirmedProposalContainer from './containers/pay-confirmed-proposal'
import NewProposalContainer from './containers/new-proposal'
import registerServiceWorker from './registerServiceWorker'
import store from './store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/proposals/new" component={NewProposalContainer} />
        <Route path="/proposals/:id/pay" component={PayProposalContainer} />
        <Route path="/proposals/:id/payconfirmed" component={PayConfirmedProposalContainer} />
        <Route path="/proposals/:id" component={ProposalContainer} />
        <Route path="/" component={IndexContainer} />
      </Switch>
    </Router>
  </Provider>, 
  document.getElementById('root')
)
registerServiceWorker()
