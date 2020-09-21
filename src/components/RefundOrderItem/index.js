import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import PropTypes from 'prop-types';
import Iconfont from '@/components/Iconfont';
import GImage from '@/components/GImage';
import _ from '@/lib/lodash';
import './index.less';

class RefundOrderItem extends Component {
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  goDetail = () => {
    Taro.setStorageSync('order_detail', this.props.orderInfo);
    Taro.navigateTo({
      url: '/pages/refundOrderDetail/index'
    });
  };

  render() {
    const { orderInfo } = this.props;
    const order = _.get(orderInfo, 'order', {});
    const orderItemList = _.get(orderInfo, 'orderItemList', []);

    return (
      <View className='u-orderItem'>
        {orderItemList.map((item) => {
          let specs = item.productSku.specs.map((s) => s.name + '/' + s.value).join('/');
          return (
            <View className='u-product__item' key={item.id} onClick={this.goDetail}>
              <View className='u-product__img'>
                <GImage my-class='u-product__img__content' src={item.productSku.skuImgUrl} />
              </View>
              <View className='u-product__info'>
                <View className='u-product__name'>{item.productSku.skuName}</View>
                <View className='u-product__specs'>{specs}</View>
              </View>
              <View className='u-product__right'>
                <View className='u-product__price'>¥ {item.productSku.price}</View>
                <View className='u-product__count'>
                  <Iconfont type='iconshanchu' size='14' color='#ccc' /> {item.quantity}
                </View>
              </View>
            </View>
          );
        })}
        <View className='u-total' onClick={this.goDetail}>
          {order.discountFee && (
            <Text className='text-hui mr-1 font-s-24'>
              总价 ¥{order.totalFee.toFixed(2)}，优惠 ¥{order.discountFee.toFixed(2)}
            </Text>
          )}
          <Text>实付 ¥ {order.paidFee && order.paidFee.toFixed(2)}</Text>
        </View>
      </View>
    );
  }
}

RefundOrderItem.defaultProps = {};

RefundOrderItem.propTypes = {
  orderInfo: PropTypes.object,
};

export default RefundOrderItem;
