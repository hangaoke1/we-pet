import Taro from '@tarojs/taro';
import { GET_CART } from '@/constants/cart';

// 购物车信息
const address = (
  state = {
    totalCount: 0,
    items: []
  },
  action
) => {
  switch (action.type) {
    case GET_CART:
      const count = action.value.totalCount;
      if (count > 0) {
        // 设置购物车数字角标
        Taro.setTabBarBadge({
          index: 2,
          text: action.value.totalCount + ''
        }).catch(() => {});
      } else {
        Taro.removeTabBarBadge({ index: 2 });
      }
      action.value.items.forEach((item) => {
        item.id = item.productSku.id;
      });
      return {
        ...state,
        items: action.value.items,
        totalCount: action.value.totalCount
      };
    default:
      return state;
  }
};

export default address;
