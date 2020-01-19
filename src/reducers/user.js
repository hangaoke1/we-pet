import { SET_LOGIN, SET_USERINFO } from '@/constants/user';
import token from '@/lib/token';

// 用户信息
const user = (state = {
  isLogin: token.isLogin(),
  userInfo: {}
}, action) => {
  switch(action.type){
    case SET_LOGIN:
      return {
        ...state,
        isLogin: action.value
      }
    case SET_USERINFO:
      return {
        ...state,
        userInfo: action.value
      }
    default:
      return state;
  }
}


export default user;
