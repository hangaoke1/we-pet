import { post, get } from '../index';

const api = {
  post,
  get
}

export default {
  // 门店查询
  queryStore: param => api.post('/pet/queryStore', param),
  // 预约洗护
  insertReserveWash: param => api.post('/pet/insertReserveWash', param),
  // 查询预约订单
  queryMyReserveWash: param => api.post('/pet/queryMyReserveWash', param)
};
