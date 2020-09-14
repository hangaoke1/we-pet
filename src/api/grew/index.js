/**
 * 寄养接口
 */
import { post, get } from '../index';

const api = {
  post,
  get
}

export default {
  // 查询地址
  doGrew: param => api.post('/pet/grew', param),
};
