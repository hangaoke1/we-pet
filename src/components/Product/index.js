import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import PropTypes from 'prop-types';
import Iconfont from '@/components/Iconfont';
import shopApi from '@/api/shop';
import { getCart } from '@/actions/cart';
import gotoLogin from '@/lib/gotoLogin';

import './index.less';

@connect(({ user }) => ({
  user
}))
class Product extends Component {
  componentWillMount() {}

  componentDidMount() {}

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
      .then((res) => {
        Taro.hideLoading();
        Taro.showToast({
          title: '添加成功',
          icon: 'success'
        });
        getCart();
      })
      .catch((err) => {
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

    return (
      <View className={prefixCls} onClick={this.goProduct}>
        <Image className='u-img' src={item.skuImgUrl} lazyLoad webp />
        <View className='u-info'>
          <View className='u-name'>{item.skuName}</View>
          <View className='u-tag'>
            {/* <View className="u-tag__item">1月新品8折</View>
            <View className="u-tag__item">年夜饭套餐</View> */}
          </View>
          <View className='u-bottom'>
            <View className='u-price'>¥ {item.price}</View>
            <View className='u-addcart' onClick={this.addCart}>
              <Iconfont type='icongouwuche' color='#fff' size='14' />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

Product.propTypes = {
  item: PropTypes.object
};

Product.defaultProps = {};

export default Product;
