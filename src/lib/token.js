import Taro from '@tarojs/taro'
import { setLogin } from '@/actions/user'

const TOKEN_KEY = 'session_pet'

const get = function () {
  return Taro.getStorageSync(TOKEN_KEY)
}
const set = function (token) {
  token && setLogin(true)
  return Taro.setStorageSync(TOKEN_KEY, token)
}
const clear = function () {
  setLogin(false)
  return Taro.setStorageSync(TOKEN_KEY, '')
}
const isLogin = function () {
  return !!Taro.getStorageSync(TOKEN_KEY)
}

export default {
  get, set, clear, isLogin
}
