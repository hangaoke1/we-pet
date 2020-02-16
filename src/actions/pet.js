import Taro from '@tarojs/taro'
import petApi from '@/api/pet'
import gc from '@/global_config'
import { GET_PET } from '@/constants/pet'

export const getPet = async function() {
  const dispatch = gc.get('store').dispatch
  const data = await petApi.queryPetRecord()
  dispatch({
    type: GET_PET,
    value: data || []
  })
}
