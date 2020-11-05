/**
 * 商城接口
 */
import { post, get } from '../index';

const api = {
  post,
  get
};

export default {
  // 获取商品种类
  queryProductCategory: (param) => api.post('/pet/queryProductCategory', param),
  // 查询商品
  queryProducts: (param) => api.post('/pet/queryProducts', param),
  // 查询品牌和地址
  getFilter: (param) => api.post('/pet/getFilter', param),
  // 查询商品详情
  queryProductFullInfoById: (params) => api.get('/pet/queryProductFullInfoById', params),
  // 加入购物车
  addShoppingCart: (params) => api.post('/pet/addShoppingCart', params),
  // 查询购物车
  queryShoppingCart: (params) => api.post('/pet/queryShoppingCart', params),
  // 删除购物车商品
  clearShoppingCart: (params) => api.post('/pet/clearShoppingCart', params),
  // 修改购物车商品数量
  alterShoppingCartQuantity: (params) => api.post('/pet/alterShoppingCartQuantity', params),
  // 下单
  insertOrder: (params) => api.post('/pet/insertOrder', params),
  // 查询订单数量
  queryOrderCount: (params) => api.post('/pet/queryOrderCount', params),
  // 查询订单 订单状态: 为空表示查询全部。100待支付，200待发货，300待收货，400已完成，900已取消
  queryOrder: (params) => api.post('/pet/queryOrder', params),
  // 取消订单
  cancelOrder: (params) => api.post('/pet/cancelOrder', params),
  // 重新支付
  againPayOrder: (params) => api.post('/pet/againPayOrder', params),
  // 确认收货
  deliveryOrder: (params) => api.get('/pet/deliveryOrder', params),
  // 退货
  refund: (params) => api.post('/pet/applyRefund', params),
  // 查询完整订单
  queryOrderById: (params) => api.get('/pet/queryOrderById', params),
  // 物流查询
  queryLogistics: (params) => api.get('/pet/queryLogistics', params)
};
