import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import _ from '@/lib/lodash';
import Iconfont from '@/components/Iconfont';
import OrderProduct from '@/components/OrderProduct';

import './index.less';

const refundText = {
  1: '退款中',
  2: '退款关闭',
  3: '退款成功',
  4: '退货中',
  5: '退货关闭',
  6: '退货成功'
};

class RefundOrderDetail extends Component {
  config = {
    navigationBarTitleText: '退款详情'
  };

  state = {
    orderInfo: Taro.getStorageSync('order_detail')
  };

  // TODO: 获取售后详情
  getRefundInfo = () => {};

  goProduct = (item) => {
    Taro.navigateTo({
      url: `/pages/product/index?productId=${item.productSku.productId}&skuId=${item.productSku.id}`
    });
  };

  doCopy = () => {
    const { orderInfo } = this.state;
    const order = _.get(orderInfo, 'order');
    const orderId = order.orderId;
    Taro.setClipboardData({
      data: orderId,
      success: () => {
        Taro.showToast({
          title: '订单已复制',
          icon: 'success'
        });
      }
    });
  };

  render() {
    const { orderInfo } = this.state;
    const order = _.get(orderInfo, 'order');
    const userAddress = _.get(orderInfo, 'userAddress');
    const orderItemList = _.get(orderInfo, 'orderItemList');
    return orderInfo ? (
      <View className='u-orderDetail'>
        <View
          className='u-status'
          style={{
            color: '#FF7013'
          }}
        >
          <Text>{refundText[order.warrantyStatus]}</Text>
          <Image className='u-status__icon' src={require('../../images/order_header.png')} />
        </View>

        <View className='u-logistics border-bottom-divider'>
          <View className='mr-5'>
            <Iconfont size='20' type='iconfajian' color='#000' />
          </View>
          <View>
            <Text className='mr-3 ellipsis-2'>商家配送</Text>
          </View>
        </View>

        <View className='u-address'>
          <View className='u-address__icon mr-5'>
            <Iconfont size='20' type='iconshoujian' color='#000' />
          </View>
          <View className='u-address__info'>
            <View>
              <Text className='u-address__name mr-3'>{userAddress.contact}</Text>
              <Text className='u-address__mobile'>{userAddress.mobile}</Text>
            </View>
            <View className='u-address__location mt-1 text-hui font-s-24'>
              {userAddress.province}
              {userAddress.city}
              {userAddress.area}
              {userAddress.detail}
            </View>
          </View>
        </View>

        <View className='u-sku'>
          <View className='border-bottom-divider px-2'>
            {orderItemList.map((item) => {
              return <OrderProduct key={item.id} item={item} onClick={this.goProduct.bind(this, item)} />;
            })}
          </View>
          <View className='border-bottom-divider font-s-24 text-hui px-2'>
            <View className='flex align-center justify-between py-2'>
              <View>商品价格</View>
              <View>¥ {order.totalFee.toFixed(2)}</View>
            </View>
            <View className='flex align-center justify-between py-2'>
              <View>运费</View>
              <View>¥ 0.00</View>
            </View>
            <View className='flex align-center justify-between py-2'>
              <View>优惠券</View>
              <View>-¥ {order.discountFee.toFixed(2)}</View>
            </View>
          </View>
          <View className='text-right pt-3 font-s-28 px-2'>
            {order.discountFee && <Text className='text-hui'>已优惠¥{order.discountFee.toFixed(2)}，</Text>}
            <Text>共计：</Text>
            <Text className='text-red'>¥{order.paidFee.toFixed(2)}</Text>
          </View>
        </View>

        <View className='u-order'>
          <View className='border-bottom-divider pb-2 font-s-32 px-2'>订单信息</View>
          <View className='u-order__item px-2'>
            <View className='u-order__tag'>订单编号：</View>
            <View className='u-order__val'>{order.orderId}</View>
            <View className='u-copy' onClick={this.doCopy}>
              复制
            </View>
          </View>
          <View className='u-order__item px-2'>
            <View className='u-order__tag'>订单时间：</View>
            <View className='u-order__val'>{order.createTime}</View>
          </View>
          <View className='u-order__item px-2'>
            <View className='u-order__tag'>订单备注：</View>
            <View className='u-order__val'>{order.buyerMemo}</View>
          </View>
        </View>
      </View>
    ) : null;
  }
}

export default RefundOrderDetail;
