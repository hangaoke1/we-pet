import Taro from '@tarojs/taro'
import { GET_ADDRESS, SET_ADDRESS_USED } from '@/constants/address'

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
      return {
        ...state,
        list: action.value
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
