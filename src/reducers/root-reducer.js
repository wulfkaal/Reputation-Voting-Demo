import {combineReducers} from 'redux'
import daos from './daos'
import proposals from './proposals'
import users from './users'
import ui from './ui'

const rootReducer = combineReducers({
  ui,
  daos,
  proposals, 
  users
})

export default rootReducer