import Taro from '@tarojs/taro'
import { GET_ADDRESS, SET_ADDRESS_USED } from '@/constants/address'
import _ from '@/lib/lodash'

// 用户信息
const address = (
  state = {
    list: [],
    id: ''
  },
  action
) => {
  switch (action.type) {
    case GET_ADDRESS:
      let id = state.id
      if (!id) {
        const defaultAddress = action.value.filter(item => item.defaultFlag)[0]
        const firstAddress = action.value[0]
        id = defaultAddress ? defaultAddress.id : _.get(firstAddress, 'id')
      }
      return {
        ...state,
        list: action.value,
        id
      }
    case SET_ADDRESS_USED:
      /**
       * 1. 取主动选择的地址
       * 2. 取默认地址
       * 3. 取第一个地址
       */
      return {
        ...state,
        id: action.value
      }
    default:
      return state
  }
}

export default address
