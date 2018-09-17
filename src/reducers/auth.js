import merge from 'lodash/merge'
import auth0 from 'auth0-js';
import {
  LOGIN,
  AUTHENTICATE,
  LOGOUT
} from '../actions/auth'

// TODO: do not include .env files in git, split out var's by environment
const initialState = {
  auth0: new auth0.WebAuth({
    domain: process.env.REACT_APP_AUTH_CONFIG_DOMAIN,
    clientID: process.env.REACT_APP_AUTH_CONFIG_CLIENTID,
    redirectUri: process.env.REACT_APP_AUTH_CONFIG_CALLBACK,
    responseType: 'token id_token',
    scope: 'openid'
  }),
  access_token: null,
  id_token: null,
  expires_at: null,
  auth: false
}

const auth = (state = initialState, action) => {
  switch(action.type) {
  case LOGIN:
    console.log(process.env.REACT_APP_AUTH_CONFIG_DOMAIN)
    let tempAuth0 = merge({}, state.auth0, action.auth0)
    return merge({}, state, {auth0: tempAuth0, auth : true})
  case AUTHENTICATE:
    return merge({}, state, {access_token : action.access_token, id_token : action.id_token, expires_at : action.expires_at })
  case LOGOUT:
    return merge({}, state, initialState)
  default:
    return state
  }
}

export default auth