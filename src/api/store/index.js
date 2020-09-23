import { post, get } from '../index';

const api = {
  post,
  get
}

export default {
  // 门店查询
  queryStore: param => api.post('/pet/queryStore', param),
  // 查询所有预约套餐
  queryMealList: param => api.get('/pet/mealList', param),
  // 预约洗护下单
  insertReserveWash: param => api.post('/pet/insertReserveWash', param),
  // 查询预约订单
  queryMyReserveWash: param => api.post('/pet/queryMyReserveWash', param),
  // 取消订单
  cancelReserveWash: param => api.post('/pet/cancelReserveWash', param),
  // 重新发起支付
  repay: param => api.post('/pet/againPay/reserveOrder', param),
};
