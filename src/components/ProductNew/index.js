import Taro, { PureComponent } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Iconfont from "../Iconfont";

import "./index.less";

class ProductNew extends PureComponent {
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };
  render() {
    return (
      <View className="u-productNew bg-bai">
        <View className="flex align-center justify-center">
          <Image
            className="u-productNew__img"
            src="//img.alicdn.com/imgextra/i1/2959008325/TB2zh2RoRjTBKNjSZFNXXasFXXa_!!2959008325-0-beehive-scenes.jpg_360x360xzq90.jpg"
          ></Image>
        </View>
        <View className="p-2">
          <View className="u-productNew__name mb-1 font-s-24 ellipsis-2">
            麦富迪猫零食猫条猫湿粮14麦富迪猫零食猫条猫湿粮14麦富迪猫零食猫条猫湿粮14
            g*100支
          </View>
          <View className="flex align-center justify-between">
            <View className="u-price">
              <View className="u-price__current font-s-24">¥150.00</View>
              <View className="u-price__origin font-s-2">¥299.00</View>
            </View>
            <View className="u-price__cart">
              <Iconfont type="icongouwuche2" color="#fff" size="14"></Iconfont>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default ProductNew;
