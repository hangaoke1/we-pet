/* eslint-disable import/no-commonjs */
import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";

import Iconfont from "@/components/Iconfont";
import ProductNew from "@/components/ProductNew";

import "./index.less";

const cateList = [
  {
    id: 1,
    name: "主粮",
    icon: require("../../images/zhuliang.png")
  },
  {
    id: 2,
    name: "罐头",
    icon: require("../../images/guantou.png")
  },
  {
    id: 3,
    name: "零食",
    icon: require("../../images/lingshi.png")
  },
  {
    id: 4,
    name: "日用",
    icon: require("../../images/riyong.png")
  },
  {
    id: 5,
    name: "玩具",
    icon: require("../../images/wanju.png")
  },
  {
    id: 6,
    name: "保健品",
    icon: require("../../images/baojianpin.png")
  },
  {
    id: 7,
    name: "服饰",
    icon: require("../../images/fushi.png")
  },
  {
    id: 8,
    name: "特惠",
    icon: require("../../images/tehui.png")
  }
];

export default class ShopIndex extends Component {
  config = {
    navigationBarTitleText: "商城"
  };

  state = {};

  render() {
    return (
      <View className="u-shop">
        <View className="u-shop__search flex align-center p-2">
          <Iconfont type="iconsousuo" size="12" color="#999" />
          <Text className="text-hui ml-2">请输入您想搜索的商品</Text>
        </View>
        <View className="u-shop__banner">
          <Image src="//img.alicdn.com/tps/i4/TB16ZRFg6MZ7e4jSZFOSut7epXa.jpg"></Image>
        </View>
        <View className="u-shop__category">
          {cateList.map(item => {
            return (
              <View className="u-shop__item" key={item.id}>
                <View className="flex flex-column align-center justify-center">
                  <Image className="u-shop__icon" src={item.icon}></Image>
                  <View className="mt-1 font-s-24">{item.name}</View>
                </View>
              </View>
            );
          })}
        </View>

        <View className="mt-2">
          <View className="u-shop__title bg-bai">
            <Text>新品推荐</Text>
            <View className="u-shop__subTitle">
              <Text style={{ color: "#FF7013" }}>更多</Text>
              <Iconfont
                type="iconarrowright"
                size="18"
                color="#FF7013"
              ></Iconfont>
            </View>
          </View>
          <View className="flex justify-between flex-wrap px-2">
            <ProductNew></ProductNew>
            <ProductNew></ProductNew>
            <ProductNew></ProductNew>
            <ProductNew></ProductNew>
          </View>
        </View>
      </View>
    );
  }
}
