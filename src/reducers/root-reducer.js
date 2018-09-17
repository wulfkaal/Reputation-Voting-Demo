import {combineReducers} from 'redux'
import daos from './daos'
import proposals from './proposals'
import users from './users'
import ui from './ui'
import auth from './auth'

const rootReducer = combineReducers({
  ui,
  daos,
  proposals, 
  auth,
  users
})

export default rootReducer