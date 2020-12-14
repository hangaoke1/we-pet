import Taro from '@tarojs/taro'
import storeApi from '@/api/store'
import gc from '@/global_config'
import { SET_WASH_LIST } from '@/constants/washService'

// 获取服务列表
export const getWashList = async function() {
  const dispatch = gc.get('store').dispatch
  try {
    const data = await storeApi.queryMealList()
    dispatch({
      type: SET_WASH_LIST,
      value: data || []
    })
  } catch (err) {
    dispatch({
      type: SET_WASH_LIST,
      value: []
    })
  }
}
