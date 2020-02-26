import Taro from '@tarojs/taro'
import { GET_STORE, SET_STORE } from '@/constants/store'
import _ from '@/lib/lodash'

// 门店信息
const store = (
  state = {
    list: [],
    id: ''
  },
  action
) => {
  switch (action.type) {
    case GET_STORE:
      let id = state.id
      if (!id) {
        const firstStore = action.value[0]
        id = _.get(firstStore, 'id')
      }
      return {
        ...state,
        list: action.value,
        id
      }
    case SET_STORE:
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

export default store
