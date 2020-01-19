/**
 * 用户登录接口
 */
import { post, get } from '../index';

const api = {
  post,
  get
}

export default {
  login: param => api.post('/pet/login', param),
  getUserInfo: param => api.get('/pet/userInfo', param)
};
