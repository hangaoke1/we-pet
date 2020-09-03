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
  queryCoupons: param => api.post('/pet/coupons', param)
};
