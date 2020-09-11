import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import PropTypes from 'prop-types';
import Iconfont from '@/components/Iconfont';
import shopApi from '@/api/shop';
import { getCart } from '@/actions/cart';
import gotoLogin from '@/lib/gotoLogin';

import './index.less';

@connect(
  ({ user }) => ({
    user
  }),
  (dispatch) => ({})
)
class index extends Component {
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
    const prefixCls = 'u-productPro';
    const { item } = this.props;

    return (
      <View className={prefixCls} onClick={this.goProduct}>
        <Image className='u-img' src={item.skuImgUrl} webp lazyLoad />
        <View className='u-name'>{item.skuName}</View>
        <View className='u-price'>
          <Text>¥ {item.price}</Text>
        </View>
        <View className='u-addcart' onClick={this.addCart}>
          <Iconfont type='icongouwuche' color='#fff' size='14' />
        </View>
      </View>
    );
  }
}

index.propTypes = {
  item: PropTypes.object
};

index.defaultProps = {};

export default index;
