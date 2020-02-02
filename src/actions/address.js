import Taro from '@tarojs/taro'
import apiAddress from '@/api/address'
import gc from '@/global_config'
import { GET_ADDRESS, SET_ADDRESS_USED } from '@/constants/address'

export const getAddress = async function() {
  const dispatch = gc.get('store').dispatch
  const data = await apiAddress.queryUserAddress()
  dispatch({
    type: GET_ADDRESS,
    value: data || {}
  })
}

export const setAddress = async function(id) {
  const dispatch = gc.get('store').dispatch
  dispatch({
    type: SET_ADDRESS_USED,
    value: id
  })
}
