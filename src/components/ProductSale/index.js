import Taro, { PureComponent } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import PropTypes from 'prop-types';

import { getCart } from '@/actions/cart';
import gotoLogin from '@/lib/gotoLogin';
import shopApi from '@/api/shop';

import config from '@/config';

import GImage from '@/components/GImage';
import Iconfont from '@/components/Iconfont';

import './index.less';

@connect(({ user }) => ({
  user
}))
class ProductSale extends PureComponent {
  static propTypes = {
    info: PropTypes.object
  };
  static defaultProps = {};
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  goProduct = () => {
    const { info } = this.props;
    Taro.navigateTo({
      url: `/pages/product/index?productId=${info.productId}&skuId=${info.id}`
    });
  };

  addCart = (e) => {
    e.stopPropagation();
    if (!this.props.user.isLogin) {
      return gotoLogin();
    }
    const { info } = this.props;
    Taro.showLoading({
      title: '加载中'
    });
    shopApi
      .addShoppingCart({
        skuId: info.id,
        quantity: 1
      })
      .then(() => {
        Taro.hideLoading();
        Taro.showToast({
          title: '添加成功',
          icon: 'success'
        });
        getCart();
      })
      .catch(() => {
        Taro.hideLoading();
        Taro.showToast({
          title: '添加失败',
          icon: 'none'
        });
      });
  };

  render() {
    const { info } = this.props;
    return info ? (
      <View className='u-productSale bg-bai' onClick={this.goProduct}>
        <View className='flex align-center justify-center'>
          <GImage my-class='u-productSale__img' src={info.skuImgUrl || config.petAvatar} />
        </View>
        <View className='p-2'>
          <View className='u-productSale__name mb-1 font-s-24 ellipsis-2'>{info.skuName || '测试商品'}</View>
          <View className='flex align-center justify-between'>
            <View className='u-price'>
              <View className='u-price__current font-s-28'>
                <Text className='font-s-24'>¥</Text>
                <Text className='f-number'>{info.price || '0'}</Text>
              </View>
              <View className='u-price__origin font-s-2 f-number' style={{ opacity: info.originPrice ? 1 : 0 }}>
                ¥{info.originPrice}
              </View>
            </View>
            <View className='u-price__cart' onClick={this.addCart}>
              <Iconfont type='icongouwuche2' color='#fff' size='14' />
            </View>
          </View>
        </View>
      </View>
    ) : null;
  }
}

export default ProductSale;
