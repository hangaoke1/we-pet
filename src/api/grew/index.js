/**
 * 寄养接口
 */
import { post, get } from '../index';

const api = {
  post,
  get
}

export default {
  // 寄养
  doGrew: param => api.post('/pet/grew', param),
  // 获取寄养列表
  queryGrew: param => api.post('/pet/queryGrew', param),
};
