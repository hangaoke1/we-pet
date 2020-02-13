import { combineReducers } from 'redux'
import user from './user'
import address from './address'
import cart from './cart'

export default combineReducers({
  user,
  address,
  cart
})
