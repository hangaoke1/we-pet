import { SET_LOGIN, SET_USERINFO, SET_COUPONS, SET_POSITION } from '@/constants/user';
import token from '@/lib/token';

// 用户信息
const user = (
  state = {
    isLogin: token.isLogin(),
    position: null,
    userInfo: {},
    userCapital: {},
    coupons: [] // 用户优惠券
  },
  action
) => {
  switch (action.type) {
    case SET_LOGIN:
      return {
        ...state,
        isLogin: action.value
      };
    case SET_USERINFO:
      return {
        ...state,
        userInfo: action.value.user,
        userCapital: action.value.userCapital
      };
    case SET_COUPONS:
      return {
        ...state,
        coupons: action.value
      };
    case SET_POSITION:
      return {
        ...state,
        position: action.value
      };
    default:
      return state;
  }
};

export default user;
