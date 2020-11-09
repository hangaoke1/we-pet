import Taro from '@tarojs/taro';
import apiUser from "@/api/user";
import gc from "@/global_config";
import { SET_LOGIN, SET_USERINFO, SET_COUPONS, SET_POSITION } from "@/constants/user";
import { STORE_DISTANCE } from "@/constants/store";
import { calcDistance } from '@/lib/map'

export const setLogin = function(login) {
  const dispatch = gc.get("store").dispatch;
  dispatch({
    type: SET_LOGIN,
    value: login
  });
};

export const setUserInfo = function(userInfo) {
  const dispatch = gc.get("store").dispatch;
  dispatch({
    type: SET_USERINFO,
    value: userInfo
  });
};

export const getUserInfo = async function() {
  const dispatch = gc.get("store").dispatch;
  const data = await apiUser.getUserInfo();
  dispatch({
    type: SET_USERINFO,
    value: data || {}
  });
};

export const getCoupons = async () => {
  const dispatch = gc.get("store").dispatch;
  const data = await apiUser.queryCoupons({
    enableFlag: 0,
    pageSize: 999,
    pageNo: 1
  });
  dispatch({
    type: SET_COUPONS,
    value: data.items || []
  });
};

// 获取用户地址位置
export const getPositionPro = () => {
  return new Promise(resolve => {
    const dispatch = gc.get("store").dispatch;
    const store = gc.get("store").getState().store;
    Taro.getLocation({
      type: "wgs84",
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        const position = {
          latitude,
          longitude
        };
        dispatch({
          type: SET_POSITION,
          value: position
        });
        console.log('>>> 当前经纬度', position)
        if (store.currentStore) {
          calcDistance(position, { longitude: store.currentStore.lon, latitude: store.currentStore.lat}).then(res => {
            console.log('>>> 距离', res)
            dispatch({
              type: STORE_DISTANCE,
              value: res
            });
          })
        }
        resolve(position);
      }
    });
  });
};
