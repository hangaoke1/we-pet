/* eslint-disable import/no-commonjs */
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import _ from '@/lib/lodash';
import Iconfont from '@/components/Iconfont';
import ProductNew from '@/components/ProductNew';
import GImage from '@/components/GImage';
import shopApi from '@/api/shop';
import homeApi from '@/api/home';
import GLoadMore from '@/components/GLoadMore';
import YcBackTop from '@/components/YcBackTop';
import eventBus from '@/lib/eventBus';

import './index.less';

export default class ShopIndex extends Component {
  config = {
    navigationBarTitleText: '商城',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
    onReachBottomDistance: 150
  };

  state = {
    categoryList: [],
    banners: [],
    productNewList: [],
    loading: false,
    finished: false,
    pageNo: 1,
    pageSize: 10,
    scrollTop: 0
  };

  onReachBottom() {
    this.getList();
  }

  onPullDownRefresh() {
    this.setState({
      pageNo: 1,
      loading: false,
      finished: false
    });
    setTimeout(() => {
      this.init();
      Taro.stopPullDownRefresh();
    }, 1000);
  }

  componentDidMount() {
    this.init();
    eventBus.$on('changeShop', this.init);
  }

  componentWillUnmount() {
    eventBus.$off('changeShop', this.init);
  }

  init = () => {
    this.getCategory();
    this.getList(true);
    homeApi
      .queryBanners({
        bannerType: 1 // 0首页 1商城
      })
      .then((res) => {
        this.setState({
          banners: res || []
        });
      })
      .catch(() => {});
  };

  getCategory() {
    shopApi
      .queryProductCategory({ pageNo: 1, pageSize: 999 })
      .then((res) => {
        this.setState({
          categoryList: res.slice(0, 8) || []
        });
      })
      .catch(() => {});
  }

  handleCateClick = (item) => {
    Taro.navigateTo({
      url: `/pages/shopCenter/index?categoryId=${item.id}&name=${item.name}`
    });
  };

  goSearch = () => {
    Taro.navigateTo({
      url: '/pages/search/index'
    });
  };

  goProductNewMore = () => {
    Taro.navigateTo({
      url: '/pages/shopList/index?hotFlag=1&name=新品推荐'
    });
  };

  getList = (refresh) => {
    const { pageNo, pageSize, loading, finished } = this.state;
    if (loading || finished) {
      return;
    }
    this.setState({
      loading: true
    });
    shopApi
      .queryProducts({
        pageNo,
        pageSize,
        hotFlag: 1 // 1新品 2折扣
      })
      .then((res) => {
        const list = _.get(res, 'items', []);
        this.setState((state) => {
          return {
            pageNo: pageNo + 1,
            productNewList: refresh ? list : [ ...state.productNewList, ...list ],
            loading: false,
            finished: pageNo * pageSize >= res.totalCount ? true : false
          };
        });
      })
      .catch((error) => {
        console.log('>>> queryNewProducts异常', error);
      });
  };

  render() {
    const { productNewList, banners, finished, loading, scrollTop, categoryList = [] } = this.state;
    return (
      <View className='u-shop'>
        <View className='u-shop__search flex align-center p-2' onClick={this.goSearch}>
          <Iconfont type='iconsousuo' size='12' color='#999' />
          <Text className='text-hui ml-2'>请输入您想搜索的商品</Text>
        </View>

        <Swiper
          className='u-shop__banner'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          autoplay
        >
          {banners.map((banner) => (
            <SwiperItem key={banner.id}>
              <GImage my-class='u-shop__bannerImg' mode='fill' src={banner.imgUrl} resize='750' />
            </SwiperItem>
          ))}
        </Swiper>

        <View className='u-shop__category'>
          {categoryList.map((item) => {
            return (
              <View className='u-shop__item' key={item.id} onClick={this.handleCateClick.bind(this, item)}>
                <View className='flex flex-column align-center justify-center'>
                  <Image className='u-shop__icon' src={item.icon} />
                  <View className='mt-1 font-s-24'>{item.categoryName}</View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: '20rpx', background: '#F4F5F6' }} />

        <View>
          <View className='u-shop__title bg-bai'>
            <Text>新品推荐</Text>
            <View className='u-shop__subTitle' onClick={this.goProductNewMore}>
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

        <GLoadMore onClick={this.getList} finished={finished} loading={loading} />
        <YcBackTop scrollTop={scrollTop} />
      </View>
    );
  }
}
