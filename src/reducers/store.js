import Taro from '@tarojs/taro'
import { GET_STORE, SET_STORE, STORE_DISTANCE } from '@/constants/store'

// 门店信息
const store = (
  state = {
    list: [],
    currentStore: Taro.getStorageSync('currentStore') || null,
    distance: 0 // 距离
  },
  action
) => {
  switch (action.type) {
    case GET_STORE:
      // TODO: 更新门店内容
      // const currentStore = state.currentStore ? state.currentStore : action.value[0]
      const currentStore = action.value[0]
      Taro.setStorageSync('currentStore', currentStore);
      return {
        ...state,
        list: action.value,
        currentStore
      }
    case SET_STORE:
      Taro.setStorageSync('currentStore', action.value);
      return {
        ...state,
        currentStore: action.value
      }
    case STORE_DISTANCE:
      return {
        ...state,
        distance: action.value
      }
    default:
      return state
  }
}

export default store
