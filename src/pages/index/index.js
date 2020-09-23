/* eslint-disable react/no-unused-state */
import Taro, { Component } from '@tarojs/taro';
import _ from '@/lib/lodash';

import { View, Text } from '@tarojs/components';
import Iconfont from '@/components/Iconfont';
import Divider from '@/components/Divider';
import homeApi from '@/api/home';
import shopApi from '@/api/shop';
import { getCart } from '@/actions/cart';
import config from '@/config';

import StoreInfo from '@/components/StoreInfo';
import ProductSale from '@/components/ProductSale';
import ProductNew from '@/components/ProductNew';

import './index.less';

export default class Index extends Component {
  config = {
    navigationBarTitleText: '有宠宠物',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
    onReachBottomDistance: 50,
    backgroundColor: '#f3f4f8',
    usingComponents: {
      'van-icon': '../../components/vant/dist/icon/index',
      'van-row': '../../components/vant/dist/row/index',
      'van-col': '../../components/vant/dist/col/index',
      'van-image': '../../components/vant/dist/image/index'
    }
  };

  state = {
    notice: '',
    banners: [],
    productNewList: [],
    productNewLoading: true,
    productSaleList: [],
    productSaleLoading: true
  };

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: '有宠宠物生活馆',
      path: '/pages/index/index',
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
      .queryBanners({
        bannerType: 0 // 0首页 1商城
      })
      .then((res) => {
        this.setState({
          banners: res || []
        });
      })
      .catch((error) => {
        console.log('>>> queryBanners异常', error);
      });
    homeApi
      .queryNotice()
      .then((res) => {
        this.setState({
          notice: _.get(res, '[0].title', '暂无公告')
        });
      })
      .catch((error) => {
        console.log('>>> queryNotice异常', error);
      });
    shopApi
      .queryProducts({
        pageNo: 1,
        pageSize: 4,
        hotFlag: 1 // 1新品 2折扣
      })
      .then((res) => {
        this.setState({
          productNewList: _.get(res, 'items', []),
          productNewLoading: false
        });
      })
      .catch((error) => {
        console.log('>>> queryNewProducts异常', error);
      });
    shopApi
      .queryProducts({
        pageNo: 1,
        pageSize: 3,
        hotFlag: 2 // 1新品 2折扣
      })
      .then((res) => {
        this.setState({
          productSaleList: _.get(res, 'items', []),
          productSaleLoading: false
        });
      })
      .catch((error) => {
        console.log('>>> queryNewProducts异常', error);
      });
  };

  goProduct = (item) => {
    Taro.navigateTo({
      url: `/pages/product/index?productId=${item.productId}&skuId=${item.id}`
    });
  };

  goProductNewMore = () => {
    Taro.navigateTo({
      url: '/pages/shopList/index?hotFlag=1&name=新品推荐'
    });
  }

  goProductSaleMore = () => {
    Taro.navigateTo({
      url: '/pages/shopList/index?hotFlag=2&name=每日折扣'
    });
  }

  goShop = () => {
    Taro.switchTab({
      url: '/pages/shop/index'
    });
  };

  goSubscribe = () => {
    Taro.navigateTo({
      url: '/pages/subscribe/index'
    });
  };

  goGrew = () => {
    Taro.navigateTo({
      url: '/pages/petGrew/index'
    });
  }

  todo = () => {
    Taro.showToast({
      title: '敬请期待',
      icon: 'none'
    });
  };

  openLocation = () => {
    Taro.openLocation({
      latitude: 30.206371,
      longitude: 120.202034,
      name: '有宠宠物生活馆',
      address: '浙江省杭州市滨江区滨盛路1893号'
    });
  };

  render() {
    const { banners, productNewList, productSaleList } = this.state;
    return (
      <View className='u-home'>
        <van-image
          custom-class='u-banner animated fadeIn faster delay-300ms'
          fit='fill'
          src={banners[0].imgUrl}
          lazyLoad
          webp
        />
        <View className='u-info'>
          <StoreInfo />
          <View className='px-2 pt-1'>
            <Divider color='rgba(0, 0, 0, 0.1)' />
          </View>
          <View className='flex align-center'>
            <View className='u-home__action' onClick={this.goSubscribe}>
              <Iconfont type='iconyuyue' size='18' color='#666666' />
              <Text style={{ marginLeft: '4rpx' }}>预约</Text>
            </View>
            <View className='u-home__action' onClick={this.goGrew}>
              <Iconfont type='iconjiyang' size='18' color='#666666' />
              <Text style={{ marginLeft: '4rpx' }}>寄养</Text>
            </View>
          </View>
        </View>
        <View className='bg-bai mt-4'>
          <View className='u-home__title'>
            <Text>每日折扣</Text>
            <View className='u-home__subTitle' onClick={this.goProductSaleMore}>
              <Text style={{ color: '#FF7013' }}>更多</Text>
              <Iconfont type='iconarrowright' size='18' color='#FF7013' />
            </View>
          </View>
          <van-row>
            {productSaleList.map((info) => {
              return (
                <van-col span='8' key={info.id}>
                  <ProductSale info={info} />
                </van-col>
              );
            })}
          </van-row>
        </View>
        <View className='u-home__productNew mt-2'>
          <View className='u-home__title bg-bai'>
            <Text>新品推荐</Text>
            <View className='u-home__subTitle' onClick={this.goProductNewMore}>
              <Text style={{ color: '#FF7013' }}>更多</Text>
              <Iconfont type='iconarrowright' size='18' color='#FF7013' />
            </View>
          </View>
          <View className='flex justify-between flex-wrap px-2'>
            {productNewList.map((info) => {
              return <ProductNew key={info.id} info={info} />;
            })}
          </View>
        </View>
      </View>
    );
  }
}
