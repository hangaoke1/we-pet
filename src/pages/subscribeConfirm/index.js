import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton } from "taro-ui";
import config from "@/config";
import Iconfont from "@/components/Iconfont";
import _ from "@/lib/lodash";
import { getUserInfo } from "@/actions/user";
import { getPet } from "@/actions/pet";
import storeApi from "@/api/store";

import "./index.less";

@connect(({ pet, user }) => ({
  pet,
  user
}))
class SubscribeConfirm extends Component {
  config = {
    navigationBarTitleText: "我的订单",
    usingComponents: {
      "van-checkbox": "../../components/vant/dist/checkbox/index"
    }
  };

  state = {
    mobile: "",
    storeId: "",
    petId: "",
    service: {},
    reserveTime: "",
    date: "",
    payType: 1 // 1在线支付 2: 到店支付
  };

  componentWillMount() {
    const params = Taro.getStorageSync("subscribe_order");
    const { storeId, petId, service, reserveTime, date, time } = params;
    this.setState({
      storeId,
      petId,
      service,
      reserveTime,
      date,
      time
    });
  }

  componentDidShow() {
    if (this.props.user.isLogin) {
      getUserInfo();
      getPet();
    }
  }

  handleSubmit = () => {
    const { storeId, petId, service, reserveTime, mobile } = this.state;
    if (!mobile) {
      Taro.showToast({
        title: "请填写手机号",
        icon: "none"
      });
      return;
    }
    const params = {
      storeId,
      petId,
      service: service.name,
      reserveTime,
      mobile
    };
    Taro.showLoading();
    storeApi
      .insertReserveWash(params)
      .then(() => {
        Taro.hideLoading();
        Taro.redirectTo({
          url: "/pages/storeOrder/index"
        });
      })
      .catch(err => {
        Taro.hideLoading();
        Taro.showToast({
          title: err.message,
          icon: "none"
        });
      });
  };

  handleMobileChange = e => {
    this.setState({
      mobile: e.detail.value
    });
  };

  handlePayTypeChange = payType => {
    this.setState({
      payType
    });
  };

  render() {
    const { user, pet } = this.props;
    const { petId, service, date, time, mobile, payType } = this.state;
    const choosePet =
      _.get(pet, "list", []).filter(item => item.id == petId)[0] || {};
    const userInfo = _.get(user, "userInfo");

    let total = service.reduce((t, i) => t + i.price, 0);
    if (payType === 2) {
      total = total * 0.1;
    }
    // TODO: 减去优惠券
    return (
      <View className="u-subscribeCofirm">
        <View className="u-header">
          <View className="u-header__info">{userInfo.nickName || "访客"}</View>
          <Input
            className="u-header__mobile"
            value={mobile}
            onChange={this.handleMobileChange}
            placeholder="请填写手机号"
          />
        </View>

        <View className="u-store">
          <View className="p-2 border-bottom-divider">
            <View className="u-store__name">有宠宠物生活馆(滨江店)</View>
            <View className="u-store__address">
              <Iconfont type="icondizhi01" color="#ccc" size="16" />
              <Text style={{ marginLeft: "4px" }}>
                浙江省杭州市滨江区滨盛路1893号
              </Text>
            </View>
          </View>
          <View className="u-pay">
            <View
              className="flex align-center justify-between px-2 py-4"
              onClick={this.handlePayTypeChange.bind(this, 1)}
            >
              <View className="flex align-center">
                <Iconfont
                  type="icontab-shangcheng-weixuanzhong"
                  color="#2593F9"
                  size="16"
                />
                <Text className="ml-2">在线支付</Text>
              </View>
              <van-checkbox
                value={payType === 1}
                checkedColor="#FF7A24"
              ></van-checkbox>
            </View>
            <View
              className="flex align-center justify-between px-2 pb-4"
              onClick={this.handlePayTypeChange.bind(this, 2)}
            >
              <View className="flex align-center">
                <Iconfont
                  type="icontab-shangcheng-weixuanzhong"
                  color="#C1AC2F"
                  size="16"
                />
                <Text className="ml-2">到店支付</Text>
              </View>
              <van-checkbox
                value={payType === 2}
                checkedColor="#FF7A24"
              ></van-checkbox>
            </View>
          </View>
        </View>

        <View className="u-pet">
          <Image
            className="u-pet__avatar"
            src={choosePet.avatar || config.petAvatar}
          />
          <View className="u-pet__info">
            <View className="u-pet__name">{choosePet.petName}</View>
            <View className="u-pet__petBreed">{choosePet.petBreed}</View>
          </View>
        </View>

        <View className="u-service">
          <View className="u-service__title border-bottom-divider">
            套餐内容
          </View>
          {service.map(s => {
            return (
              <View
                className="u-service__item border-bottom-divider"
                key={s.id}
              >
                <Image
                  className="u-service__icon"
                  src={s.image || config.petAvatar}
                />
                <View className="u-service__name">{s.name}</View>
                <View className="u-service__price">¥ {s.price}</View>
              </View>
            );
          })}
          <View className="flex align-center p-2">
            <View className="flex-1 font-s-28">优惠券</View>
            <View className="flex-0 flex align-center">
              <Text className="mr-1" style={{ color: "#C00C00" }}>
                2张可用
              </Text>
              <Iconfont type="icondian" color="#C00C00" size="8" />
              <Iconfont type="iconarrowright" color="#272727" size="16" />
            </View>
          </View>
        </View>

        <View className="u-time flex align-center justify-between">
          <View className="u-time__label">预约服务时间</View>
          <View className="u-time__val">
            {date} {time}
          </View>
        </View>

        <View className="u-payment">
          <View className="u-payment__remark">
            <View className="u-payment__label">备注</View>
            <Input className="u-payment__input" placeholder="添加备注" />
          </View>
        </View>

        <View className="u-tip">
          <View className="u-tip__title">关于违约、改约</View>
          <View>*迟到不保留预约资格</View>
          <View>*请提前2小时致电门店修改预约，并调整时间</View>
        </View>

        <View className="u-action">
          <View className="u-action__left" />
          <View className="u-action__right">
            <View>
              <Text className="u-action__label">
                {payType === 1 ? "合计" : "定金"}：
              </Text>
              <Text className="u-action__val text-red">
                ¥ {total.toFixed(2)}
              </Text>
            </View>
            <AtButton
              className="u-action__btn"
              type="primary"
              circle={false}
              full
              onClick={this.handleSubmit}
            >
              去下单
            </AtButton>
          </View>
        </View>
      </View>
    );
  }
}

export default SubscribeConfirm;
