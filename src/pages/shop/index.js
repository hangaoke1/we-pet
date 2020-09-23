/* eslint-disable import/no-commonjs */
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import _ from '@/lib/lodash';
import Iconfont from '@/components/Iconfont';
import ProductNew from '@/components/ProductNew';
import GImage from '@/components/GImage';
import shopApi from '@/api/shop';
import homeApi from '@/api/home';

import './index.less';

const cateList = [
  {
    id: 1,
    name: '主粮',
    icon: require('../../images/zhuliang.png')
  },
  {
    id: 2,
    name: '罐头',
    icon: require('../../images/guantou.png')
  },
  {
    id: 3,
    name: '零食',
    icon: require('../../images/lingshi.png')
  },
  {
    id: 4,
    name: '日用',
    icon: require('../../images/riyong.png')
  },
  {
    id: 5,
    name: '玩具',
    icon: require('../../images/wanju.png')
  },
  {
    id: 6,
    name: '保健品',
    icon: require('../../images/baojianpin.png')
  },
  {
    id: 7,
    name: '服饰',
    icon: require('../../images/fushi.png')
  },
  {
    id: 8,
    name: '特惠',
    icon: require('../../images/tehui.png')
  }
];

export default class ShopIndex extends Component {
  config = {
    navigationBarTitleText: '商城'
  };

  state = {
    productNewList: [],
    banners: [],
  };

  componentDidMount() {
    this.getProductNew();
    homeApi
      .queryBanners({
        bannerType: 1 // 0首页 1商城
      })
      .then((res) => {
        this.setState({
          banners: res || []
        });
      })
      .catch((error) => {
        console.log('>>> queryBanners异常', error);
      });
  }

  handleCateClick = (item) => {
    Taro.navigateTo({
      url: `/pages/shopList/index?categoryId=${item.id}&name=${item.name}`
    });
  };

  goSearch = () => {
    Taro.navigateTo({
      url: '/pages/search/index'
    });
  }

  goProductNewMore = () => {
    Taro.navigateTo({
      url: '/pages/shopList/index?hotFlag=1&name=新品推荐'
    });
  }

  getProductNew = () => {
    shopApi
      .queryProducts({
        pageNo: 1,
        pageSize: 10,
        hotFlag: 1 // 1新品 2折扣
      })
      .then((res) => {
        this.setState({
          productNewList: _.get(res, 'items', []),
        });
      })
      .catch((error) => {
        console.log('>>> queryNewProducts异常', error);
      });
  };

  render() {
    const { productNewList, banners } = this.state;
    return (
      <View className='u-shop'>
        <View className='u-shop__search flex align-center p-2' onClick={this.goSearch}>
          <Iconfont type='iconsousuo' size='12' color='#999' />
          <Text className='text-hui ml-2'>请输入您想搜索的商品</Text>
        </View>
        <View className='u-shop__banner'>
          <GImage src={banners[0] && banners[0].imgUrl}></GImage>
        </View>
        <View className='u-shop__category'>
          {cateList.map((item) => {
            return (
              <View className='u-shop__item' key={item.id} onClick={this.handleCateClick.bind(this, item)}>
                <View className='flex flex-column align-center justify-center'>
                  <Image className='u-shop__icon' src={item.icon} />
                  <View className='mt-1 font-s-24'>{item.name}</View>
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
      </View>
    );
  }
}
