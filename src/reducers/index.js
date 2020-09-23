import { combineReducers } from 'redux'
import user from './user'
import address from './address'
import cart from './cart'
import pet from './pet'
import store from './store'
import washService from './washService'

export default combineReducers({
  user,
  address,
  cart,
  pet,
  store,
  washService
})
