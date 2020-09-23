import Taro from '@tarojs/taro'
import { SET_PET } from '@/constants/pet'

// 宠物信息
const pet = (
  state = {
    list: []
  },
  action
) => {
  switch (action.type) {
    case SET_PET:
      return {
        ...state,
        list: action.value,
      }
    default:
      return state
  }
}

export default pet
