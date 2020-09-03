import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import dayjs from "dayjs";
import PropTypes from "prop-types";

import "./index.less";

export default class Coupon extends Component {
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  static propTypes = {
    info: PropTypes.object,
    onClick: PropTypes.func,
    isSelect: PropTypes.bool
  };

  static defaultProps = {
    info: {}
  };

  handleClick = e => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(e);
    }
  };

  render() {
    const { info, isSelect } = this.props;
    return (
      <View className="u-coupon">
        <View className="u-coupon__icon mr-4">
          <Image src={require("../../images/youhuiquan.png")}></Image>
          <View className="u-coupon__value">
            <Text className="font-s-24">¥</Text>
            <Text>{info.value || 0}</Text>
          </View>
          <View className="u-coupon__require font-s-2">
            满{info.required}元可用
          </View>
        </View>
        <View className="u-coupon__info flex-1">
          <View className="font-s-32">通用券</View>
          <View className="font-s-24 text-hui">
            可用于预约套餐抵扣和商城 商品抵扣，特价商品除外
          </View>
          <View className="font-s-24 text-hui mt-2">
            有效期至 {dayjs(info.endTime).format("YYYY.MM.DD")}
          </View>
        </View>
        {isSelect ? (
          <View
            className="u-coupon__action u-coupon__selected flex-0 align-self-center font-s-28"
            onClick={this.handleClick}
          >
            已选择
          </View>
        ) : (
          <View
            className="u-coupon__action flex-0 align-self-center font-s-28"
            onClick={this.handleClick}
          >
            去使用
          </View>
        )}
      </View>
    );
  }
}
