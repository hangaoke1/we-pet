import Taro from '@tarojs/taro'
import { GET_PET } from '@/constants/pet'

// 购物车信息
const pet = (
  state = {
    list: []
  },
  action
) => {
  switch (action.type) {
    case GET_PET:
      return {
        ...state,
        list: action.value,
      }
    default:
      return state
  }
}

export default pet
