/**
 * 首页接口
 */
import { post, get } from '../index';

const api = {
  post,
  get
}

export default {
  // 获取轮播图
  queryBanners: param => api.post('/pet/queryBanners', param),
  // 获取公告
  queryNotice: param => api.get('/pet/queryNotice', param),
  // 获取推荐商品
  queryNewProducts: param => api.post('/pet/queryNewProducts', param)
};
