import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import PropTypes from 'prop-types';
import Iconfont from '@/components/Iconfont';
import GImage from '@/components/GImage';
import _ from '@/lib/lodash';
import './index.less';

class OrderItem extends Component {
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  cancelOrder = (e) => {
    e.stopPropagation();
    const { orderInfo } = this.props;
    const order = _.get(orderInfo, 'order');
    this.props.onCancel && this.props.onCancel(order.orderId);
  };

  // 重新发起支付
  repay = (e) => {
    e.stopPropagation();
    const { orderInfo } = this.props;
    const order = _.get(orderInfo, 'order');
    this.props.onRepay && this.props.onRepay(order.orderId);
  };

  // 确认收货
  deliveryOrder = (e) => {
    e.stopPropagation();
    const { orderInfo } = this.props;
    const order = _.get(orderInfo, 'order');
    this.props.onDeliveryOrder && this.props.onDeliveryOrder(order.orderId);
  };

  goDetail = () => {
    Taro.setStorageSync('order_detail', this.props.orderInfo);
    Taro.navigateTo({
      url: '/pages/orderDetail/index'
    });
  };

  navTo = (url) => {
    Taro.navigateTo({
      url
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
        {order.orderStatus == 100 && (
          <View className='u-action'>
            <View className='u-action__btn u-action__btn-default mr-1' onClick={this.cancelOrder}>
              取消订单
            </View>
            <View className='u-action__btn' onClick={this.repay}>
              付款
            </View>
          </View>
        )}
        {order.orderStatus == 300 && (
          <View className='u-action'>
            <View
              className='u-action__btn u-action__btn-default mr-1'
              onClick={this.navTo.bind(this, `/pages/orderTrack/index?deliveryNo=${order.logisticsNo}`)}
            >
              查看物流
            </View>
            <View className='u-action__btn' onClick={this.deliveryOrder}>
              确认收货
            </View>
          </View>
        )}
      </View>
    );
  }
}

OrderItem.defaultProps = {};

OrderItem.propTypes = {
  orderInfo: PropTypes.object,
  onCancel: PropTypes.func,
  onDeliveryOrder: PropTypes.func
};

export default OrderItem;
