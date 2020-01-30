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
};
