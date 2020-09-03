import Taro, { Component } from "@tarojs/taro";
import PropTypes from "prop-types";
import { View, Image } from "@tarojs/components";
import Iconfont from "@/components/Iconfont";
import config from "@/config";

import './index.less';

export default class StoreInfo extends Component {
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };
  static propTypes = {};
  static defaultProps = {};
  state = {};
  render() {
    return (
      <View className="u-store flex">
        <Image className="u-store__logo flex-0" src={config.logo}></Image>
        <View className="flex-1">
          <View className="font-s-32 text-base mb-2">
            有宠宠物生活馆(杭州滨江店)
          </View>
          <View className="font-s-24 text-base mb-2">营业中 9:00-20:00</View>
          <View className="flex">
            <View className="flex-0 mr-1">
              <Iconfont type="iconshoujian" size={16} color="#999999" />
            </View>
            <View className="flex-1">
              <View className="font-s-24 text-base mb-1">
                浙江省杭州市滨江区滨盛路1893号
              </View>
              <View className="font-s-24 text-hui">据您300m</View>
            </View>
            <View className="flex-0 flex flex-column align-center">
              <Iconfont
                type="icondianhua1"
                color="#FF7013"
                size="20"
              ></Iconfont>
              <View className="font-s-2 text-hui">电话</View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
