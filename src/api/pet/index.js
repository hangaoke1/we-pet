import { post, get } from '../index';

const api = {
  post,
  get
}

export default {
  // 查询宠物
  queryPetRecord: param => api.get('/pet/queryPetRecord', param),
  // 新增宠物
  insertPetRecord: param => api.post('/pet/insertPetRecord', param),
  // 删除宠物
  removePetRecord: param => api.post('/pet/removePetRecord', param),
  // 修改宠物
  updatePetRecord: param => api.post('/pet/updatePetRecord', param)
};
