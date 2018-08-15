import {combineReducers} from 'redux'
import proposals from './proposals'
import users from './users'

const rootReducer = combineReducers({
  proposals, 
  users
})

export default rootReducer