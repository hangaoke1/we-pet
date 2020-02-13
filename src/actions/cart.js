import Taro from '@tarojs/taro'
import _ from '@/lib/lodash'
import shopApi from '@/api/shop'
import gc from '@/global_config'
import { GET_CART } from '@/constants/cart'

export const getCart = async function () {
  const dispatch = gc.get('store').dispatch
  const data = await shopApi.queryShoppingCart({
    pageNo: 1,
    pageSize: 99
  })
  dispatch({
    type: GET_CART,
    value: {
      totalCount: _.get(data, 'totalCount', 0),
      items: _.get(data, 'items', [])
    }
  })
}
