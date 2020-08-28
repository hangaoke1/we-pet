import Taro from "@tarojs/taro";
import { SET_WASH_LIST } from "@/constants/washService";

// 预约套餐服务
const washService = (
  state = {
    list: []
  },
  action
) => {
  switch (action.type) {
    case SET_WASH_LIST:
      return {
        ...state,
        list: action.value
      };
    default:
      return state;
  }
};

export default washService;
