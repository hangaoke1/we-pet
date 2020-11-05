import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View, Image, Text } from "@tarojs/components";
import config from '@/config';

import "./index.less";

// 所有预约服务
@connect(({ washService }) => ({
  washService
}))
export default class AllService extends Component {
  config = {
    navigationBarTitleText: "更多服务",
    backgroundColor: "#f3f4f8",
    usingComponents: {
      "van-checkbox": "../../components/vant/dist/checkbox/index"
    }
  };

  state = {
    service: Taro.getStorageSync("subscribe_service") || []
  };

  componentDidShow() {}

  selectedService = item => {
    this.setState(state => {
      const oldService = state.service;
      const isChoose = oldService.filter(v => v.name === item.name).length;
      let newService = [];
      if (isChoose) {
        newService = oldService.filter(v => v.name !== item.name);
      } else {
        newService = [...oldService, item];
      }
      Taro.setStorageSync('subscribe_service', newService);
      return {
        service: newService
      };
    });
  };
  render() {
    const { service } = this.state;
    const { washService } = this.props;
    return (
      <View className="u-allService">
        {washService.list.map(v => {
          const serviceIds = service.map(sv => sv.id);
          const isSelected = serviceIds.includes(v.id);
          return (
            <View
              key={v.id}
              className="flex u-allService__item"
              onClick={this.selectedService.bind(this, v)}
            >
              <View className="flex-0 align-self-center">
                <van-checkbox
                  value={isSelected}
                  checkedColor="#FF7013"
                ></van-checkbox>
              </View>
              <View className="flex-0 ml-4 mr-2">
                <Image
                  className="u-allService__icon"
                  src={v.image || config.petAvatar}
                ></Image>
              </View>
              <View className="flex-1">
                <View className="font-s-32">{v.name}</View>
                <View className="font-s-24 text-hui mt-1 ellipsis-1">
                  {v.description}
                </View>
                <View className="text-red mt-3">
                  <Text className="font-s-2 mr-1">¥</Text>
                  <Text className="font-s-32 f-number">{v.price}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}
