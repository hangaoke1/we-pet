import Taro from '@tarojs/taro'
import storeApi from '@/api/store'
import gc from '@/global_config'
import { GET_STORE, SET_STORE } from '@/constants/store'

export const getStore = async function() {
  const dispatch = gc.get('store').dispatch
  const data = await storeApi.queryStore()
  dispatch({
    type: GET_STORE,
    value: data || {}
  })
}

export const setStore = async function(id) {
  const dispatch = gc.get('store').dispatch
  dispatch({
    type: SET_STORE,
    value: id
  })
}
