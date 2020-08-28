import { post, get } from '../index';

const api = {
  post,
  get
}

export default {
  // 查询所有预约套餐
  queryMealList: param => api.get('/pet/mealList', param),
};
