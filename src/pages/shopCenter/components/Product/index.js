import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import PropTypes from 'prop-types';
import Iconfont from '@/components/Iconfont';
import shopApi from '@/api/shop';
import { getCart } from '@/actions/cart';
import gotoLogin from '@/lib/gotoLogin';
import GImage from '@/components/GImage';

import './index.less';

@connect(({ user }) => ({
  user
}))
class Product extends Component {
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  static propTypes = {
    item: PropTypes.object
  };

  static defaultProps = {};

  goProduct = () => {
    const { item } = this.props;
    Taro.navigateTo({
      url: `/pages/product/index?productId=${item.productId}&skuId=${item.id}`
    });
  };

  addCart = (e) => {
    e.stopPropagation();
    if (!this.props.user.isLogin) {
      return gotoLogin();
    }
    const { item } = this.props;
    Taro.showLoading({
      title: '加载中'
    });
    shopApi
      .addShoppingCart({
        skuId: item.id,
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
    const prefixCls = 'u-product';
    const { item } = this.props;

    return item ? (
      <View className={prefixCls} onClick={this.goProduct}>
        <GImage my-class='u-img' src={item.skuImgUrl} />
        <View className='u-info'>
          <View className='u-name ellipsis-2'>{item.skuName}</View>
          <View className='u-bottom'>
            <View className='u-price'>
              <View className='f-number'>¥ {item.price}</View>
              {item && item.originPrice && item.originPrice !== item.price ? (
                <View className='f-number font-s-2 text-hui line-through'>¥ {item.originPrice}</View>
              ) : null}
            </View>
            <View className='u-addcart' onClick={this.addCart}>
              <Iconfont type='icongouwuche' color='#fff' size='14' />
            </View>
          </View>
        </View>
      </View>
    ) : null;
  }
}

export default Product;
