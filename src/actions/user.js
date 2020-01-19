import gc from '@/global_config'
import { SET_LOGIN, SET_USERINFO } from '@/constants/user'

export const setLogin = function (login) {
  const dispatch = gc.get('store').dispatch
  dispatch({
    type: SET_LOGIN,
    value: login
  })
}

export const setUserInfo = function(userInfo) {
  const dispatch = gc.get('store').dispatch
  dispatch({
    type: SET_USERINFO,
    value: userInfo
  })
}

export const getUserInfo = async function() {}
