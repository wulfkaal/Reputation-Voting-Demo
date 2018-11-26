import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import ProposalContainer from './containers/proposal'
import DaoContainer from './containers/dao'
import UserContainer from './containers/user-profile'
import NotificationsContainer from './containers/user-notifications'
import VoteProposalContainer from './containers/vote-proposal'
import NewProposalContainer from './containers/new-proposal'
import NewDaoContainer from './containers/new-dao'
import JoinDaoContainer from './containers/join-dao'
import ProposalSwimLanesContainer from './containers/proposal-swim-lanes'
import DaosContainer from './containers/daos'
import registerServiceWorker from './registerServiceWorker'
import store from './store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/:id/proposals/new" component={NewProposalContainer} />
        <Route path="/:daoId/proposals/:id/vote" component={VoteProposalContainer} />
        <Route path="/:daoId/proposals/:id" component={ProposalContainer} />
        <Route path="/daos/new" component={NewDaoContainer} />
        <Route path="/daos/:id/proposals" component={ProposalSwimLanesContainer} />
        <Route path="/daos/:id/join" component={JoinDaoContainer} />
        <Route path="/daos/:id" component={DaoContainer} />
        <Route path="/daos" component={DaosContainer} />
        <Route path="/users/:email" component={UserContainer} />
        <Route path="/notifications/:email" component={NotificationsContainer} />
        <Route path="/" component={DaosContainer} />
      </Switch>
    </Router>
  </Provider>, 
  document.getElementById('root')
)
registerServiceWorker()
