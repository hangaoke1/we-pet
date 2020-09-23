import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";
import config from "@/config";
import Iconfont from "@/components/Iconfont";

import "./index.less";

export default class PetRecord extends Component {
  config = {
    navigationBarTitleText: "宠物档案"
  };

  state = {};

  render() {
    return (
      <View className="u-petRecord">
        <View className="u-petRecord__header">
          <View className="u-petRecord__info flex">
            <Image
              className="u-petRecord__avatar"
              src={config.petAvatar}
            ></Image>
            <View>
              <View className="font-s-36 text-bai mb-1">朗朗</View>
              <View className="font-s-24 text-bai mb-2">
                生日： 2020-01-01 4个月
              </View>
              <View className="flex align-center flex-wrap">
                <View className="u-petRecord__tag">标签</View>
                <View className="u-petRecord__tag">标签</View>
                <View className="u-petRecord__tag">标签</View>
              </View>
            </View>
          </View>
        </View>
        <View className="u-petRecord__action">
          <View className="flex flex-column align-center">
            <Iconfont type="iconyimiao" size="26" color="#999" />
            <View className="mt-2 font-s-24">记录疫苗</View>
          </View>
          <View className="flex flex-column align-center">
            <Iconfont type="iconquchong" size="26" color="#999" />
            <View className="mt-2 font-s-24">记录驱虫</View>
          </View>
          <View className="flex flex-column align-center">
            <Iconfont type="iconjiyang" size="26" color="#999" />
            <View className="mt-2 font-s-24">寄养中</View>
          </View>
        </View>
        <View className="u-petRecord__list px-2">
          <View className="font-s-36 pt-4 pb-2">成长日记</View>
          <View>
            <View className="u-petRecord__item flex align-center">
              <View className="text-hui font-s-24">6-20</View>
              <View className="u-petRecord__icon">
              <Iconfont type="iconquchong" size="10" color="#fff" />
              </View>
              <View className="font-s-28">接种疫苗</View>
            </View>
            <View className="u-petRecord__item flex align-center">
              <View className="text-hui font-s-24">6-20</View>
              <View className="u-petRecord__icon">
              <Iconfont type="iconquchong" size="10" color="#fff" />
              </View>
              <View className="font-s-28">接种疫苗</View>
            </View>
            <View className="u-petRecord__item flex align-center">
              <View className="text-hui font-s-24">6-20</View>
              <View className="u-petRecord__icon">
              <Iconfont type="iconquchong" size="10" color="#fff" />
              </View>
              <View className="font-s-28">接种疫苗</View>
            </View>
          </View>
        </View>

        <View className="u-tip">只显示最近半年的记录哦~</View>
      </View>
    );
  }
}
