import Taro from '@tarojs/taro'
import washApi from '@/api/wash'
import gc from '@/global_config'
import { SET_WASH_LIST } from '@/constants/washService'

export const getWashList = async function() {
  const dispatch = gc.get('store').dispatch
  try {
    const data = await washApi.queryMealList()
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
