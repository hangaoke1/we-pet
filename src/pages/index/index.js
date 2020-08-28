/* eslint-disable react/no-unused-state */
import Taro, { Component } from "@tarojs/taro";
import _ from "@/lib/lodash";

import { View, Image, Text } from "@tarojs/components";
import Iconfont from "@/components/Iconfont";
import Divider from "@/components/Divider";
import homeApi from "@/api/home";
import { getCart } from "@/actions/cart";
import config from "@/config";

import StoreInfo from '@/components/StoreInfo';
import ProductSale from "@/components/ProductSale";
import ProductNew from "@/components/ProductNew";

import "./index.less";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "有宠宠物",
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
    onReachBottomDistance: 50,
    backgroundColor: "#f3f4f8",
    usingComponents: {
      "van-icon": "../../components/vant/dist/icon/index",
      "van-row": "../../components/vant/dist/row/index",
      "van-col": "../../components/vant/dist/col/index",
      "van-image": "../../components/vant/dist/image/index",
    }
  };

  state = {
    notice: "",
    banners: [],
    products: []
  };

  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: "有宠宠物生活馆",
      path: "/pages/index/index",
      imageUrl: config.shareIcon
    };
  }

  onPullDownRefresh() {
    setTimeout(() => {
      this.init();
      Taro.stopPullDownRefresh();
    }, 1000);
  }

  componentDidMount() {
    this.init();
  }

  componentDidShow() {
    getCart();
  }

  init = () => {
    getCart();
    homeApi
      .queryBanners()
      .then(res => {
        this.setState({
          banners: res || []
        });
      })
      .catch(error => {
        console.log(">>> queryBanners异常", error);
      });
    homeApi
      .queryNotice()
      .then(res => {
        this.setState({
          notice: _.get(res, "[0].title", "暂无公告")
        });
      })
      .catch(error => {
        console.log(">>> queryNotice异常", error);
      });
    homeApi
      .queryNewProducts({})
      .then(res => {
        this.setState({
          products: _.get(res, "items", [])
        });
      })
      .catch(error => {
        console.log(">>> queryNewProducts异常", error);
      });
  };

  goProduct = item => {
    Taro.navigateTo({
      url: `/pages/product/index?productId=${item.productId}&skuId=${item.id}`
    });
  };

  goShop = () => {
    Taro.switchTab({
      url: "/pages/shop/index"
    });
  };

  goSubscribe = () => {
    Taro.navigateTo({
      url: "/pages/subscribe/index"
    });
  };

  todo = () => {
    Taro.showToast({
      title: "敬请期待",
      icon: "none"
    });
  };

  openLocation = () => {
    Taro.openLocation({
      latitude: 30.206371,
      longitude: 120.202034,
      name: "有宠宠物生活馆",
      address: "浙江省杭州市滨江区滨盛路1893号"
    });
  };

  render() {
    const { banners } = this.state;
    return (
      <View className="u-home">
        <van-image
          custom-class="u-banner animated fade faster"
          fit="fill"
          src={banners[0].imgUrl}
          lazyLoad
          webp
        />
        <View className="u-info">
          <StoreInfo></StoreInfo>
          <View className="px-2 pt-1">
            <Divider color="rgba(0, 0, 0, 0.1)" />
          </View>
          <View className="flex align-center">
            <View className="u-home__action" onClick={this.goSubscribe}>
              <Iconfont type="iconyuyue" size="18" color="#666666"></Iconfont>
              <Text style={{ marginLeft: "4rpx" }}>预约</Text>
            </View>
            <View className="u-home__action">
              <Iconfont type="iconjiyang" size="18" color="#666666"></Iconfont>
              <Text style={{ marginLeft: "4rpx" }}>寄养</Text>
            </View>
          </View>
        </View>
        <View className="bg-bai mt-4">
          <View className="u-home__title">
            <Text>每日折扣</Text>
            <View className="u-home__subTitle">
              <Text style={{ color: "#FF7A24" }}>更多</Text>
              <Iconfont
                type="iconarrowright"
                size="18"
                color="#FF7A24"
              ></Iconfont>
            </View>
          </View>
          <van-row>
            <van-col span="8">
              <ProductSale></ProductSale>
            </van-col>
            <van-col span="8">
              <ProductSale></ProductSale>
            </van-col>
            <van-col span="8">
              <ProductSale></ProductSale>
            </van-col>
          </van-row>
        </View>
        <View className="mt-2">
          <View className="u-home__title bg-bai">
            <Text>新品推荐</Text>
            <View className="u-home__subTitle">
              <Text style={{ color: "#FF7A24" }}>更多</Text>
              <Iconfont
                type="iconarrowright"
                size="18"
                color="#FF7A24"
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
