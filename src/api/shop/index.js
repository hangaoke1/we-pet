/**
 * 商城接口
 */
import { post, get } from '../index';

const api = {
  post,
  get
}

export default {
  // 获取商品种类
  queryProductCategory: param => api.post('/pet/queryProductCategory', param),
  // 查询商品
  queryProducts: param => api.post('/pet/queryProducts', param),
  // 查询品牌和地址
  getFilter: param => api.post('/pet/getFilter', param),
  // 查询商品详情
  queryProductFullInfoById: params => api.post('/pet/queryProductFullInfoById', params),
  // 加入购物车
  addShoppingCart: params => api.post('/pet/addShoppingCart', params),
  // 查询购物车
  queryShoppingCart: params => api.post('/pet/queryShoppingCart', params),
  // 删除购物车商品
  clearShoppingCart: params => api.post('/pet/clearShoppingCart', params),
  // 修改购物车商品数量
  alterShoppingCartQuantity: params => api.post('/pet/alterShoppingCartQuantity', params)
};
