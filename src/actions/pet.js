import Taro from '@tarojs/taro'
import petApi from '@/api/pet'
import gc from '@/global_config'
import { SET_PET } from '@/constants/pet'

// 获取宠物信息
export const getPet = async function() {
  const dispatch = gc.get('store').dispatch
  try {
    const data = await petApi.queryPetRecord()
    dispatch({
      type: SET_PET,
      value: data || []
    })
  } catch (err) {
    dispatch({
      type: SET_PET,
      value: []
    })
  }
}
