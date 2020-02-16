import { combineReducers } from 'redux'
import user from './user'
import address from './address'
import cart from './cart'
import pet from './pet'

export default combineReducers({
  user,
  address,
  cart,
  pet
})
