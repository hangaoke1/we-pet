/**
 * 地址接口
 */
import { post, get } from '../index';

const api = {
  post,
  get
}

export default {
  // 查询地址
  queryUserAddress: param => api.post('/pet/queryUserAddress', param),
  // 添加地址
  insertUserAddress: param => api.post('/pet/insertUserAddress', param),
  // 删除地址
  deleteUserAddress: param => api.get('/pet/deleteUserAddress', param),
  // 更新地址
  updateUserAddress: param => api.post('/pet/updateUserAddress', param),
};
