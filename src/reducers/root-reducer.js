import {combineReducers} from 'redux'
import daos from './daos'
import proposals from './proposals'
import users from './users'
import ui from './ui'
import auth from './auth'
import notifications from './notifications'

const rootReducer = combineReducers({
  ui,
  daos,
  proposals, 
  auth,
  users,
  notifications
})

export default rootReducer