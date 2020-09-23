import apiUser from "@/api/user";
import gc from "@/global_config";
import { SET_LOGIN, SET_USERINFO, SET_COUPONS } from "@/constants/user";

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
