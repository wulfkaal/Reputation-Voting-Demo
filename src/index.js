import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import IndexContainer from './containers/index';
import ProposalsContainer from './containers/proposals';
import registerServiceWorker from './registerServiceWorker';
import store from './store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/proposals/:id" component={ProposalsContainer} />
        <Route path="/" component={IndexContainer} />
      </Switch>
    </Router>
  </Provider>, 
  document.getElementById('root')
);
registerServiceWorker();
