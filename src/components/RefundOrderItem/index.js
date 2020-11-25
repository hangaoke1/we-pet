import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import PropTypes from 'prop-types';
import Iconfont from '@/components/Iconfont';
import GImage from '@/components/GImage';
import _ from '@/lib/lodash';
import './index.less';

// 0或者不传表示 无售后，1退款中，2退款关闭，3退款成功，4退货中，5退货关闭，6退货成功
const wText = {
  1: '退款中',
  2: '退款关闭',
  3: '退款成功',
  4: '退货中',
  5: '退货关闭',
  6: '退货成功'
};
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

    if (!order) { return null }

    return (
      <View className='u-orderItem'>
        {orderItemList.map((item) => {
          let specs = item.productSku.specs.map((s) => s.name + '/' + s.value).join('/');
          return (
            <View className='u-product__item' key={item.id} onClick={this.goDetail}>
              <View className='u-product__img'>
                <GImage my-class='u-product__img__content' src={item.productSku.skuImgUrl} resize='400' />
              </View>
              <View className='u-product__info'>
                <View className='u-product__name'>{item.productSku.skuName}</View>
                <View className='u-product__specs'>{specs}</View>
              </View>
              <View className='u-product__right'>
                <View className='u-product__price f-number'>¥ {item.productSku.price}</View>
                <View className='u-product__count'>
                  <Iconfont type='iconshanchu' size='14' color='#ccc' /> {item.quantity}
                </View>
              </View>
            </View>
          );
        })}
        <View className='u-total' onClick={this.goDetail}>
          {order.discountFee && (
            <Text className='text-hui mr-1 font-s-24 f-number'>
              总价 ¥{order.totalFee.toFixed(2)}，优惠 ¥{order.discountFee.toFixed(2)}
            </Text>
          )}
          <Text className='f-number'>实付 ¥ {order.paidFee && order.paidFee.toFixed(2)}</Text>
        </View>

        <View className='pt-2 text-right main-color font-s-26'>{wText[order.warrantyStatus]}</View>
      </View>
    );
  }
}

RefundOrderItem.defaultProps = {};

RefundOrderItem.propTypes = {
  orderInfo: PropTypes.object
};

export default RefundOrderItem;
