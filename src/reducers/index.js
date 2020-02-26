import { combineReducers } from 'redux'
import user from './user'
import address from './address'
import cart from './cart'
import pet from './pet'
import store from './store'

export default combineReducers({
  user,
  address,
  cart,
  pet,
  store
})
