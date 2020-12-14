/**
 * 用户登录接口
 */
import { post, get } from '../index';

const api = {
  post,
  get
}

export default {
  // 登录
  login: param => api.post('/pet/login', param),
  // 查询用户信息
  getUserInfo: param => api.get('/pet/userInfo', param),
  // 查询我的设备
  queryMyCameraList: param => api.get('/pet/queryMyCameraList', param),
  // 查询优惠券
  queryCoupons: param => api.post('/pet/coupons', param),
  // 添加用户至当前店铺会员
  userShopAdd: param => api.get('/pet/user/shopAdd', param),
  // 查询用户在所有店铺的资金信息
  queryAllBalance: param => api.get('/pet/full/balance', param),
};
