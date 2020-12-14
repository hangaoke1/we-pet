import Taro from '@tarojs/taro'
import _ from '@/lib/lodash'
import shopApi from '@/api/shop'
import gc from '@/global_config'
import { GET_CART } from '@/constants/cart'

// 获取购物车信息
export const getCart = async function () {
  const dispatch = gc.get('store').dispatch
  const data = await shopApi.queryShoppingCart({
    pageNo: 1,
    pageSize: 99
  })
  dispatch({
    type: GET_CART,
    value: {
      totalCount: _.get(data, 'items', []).length,
      items: _.get(data, 'items', [])
    }
  })
}
