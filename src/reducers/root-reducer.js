import {combineReducers} from 'redux'
import daos from './daos'
import proposals from './proposals'
import users from './users'

const rootReducer = combineReducers({
  daos,
  proposals, 
  users
})

export default rootReducer