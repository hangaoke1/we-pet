import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import _ from '@/lib/lodash';
import shopApi from '@/api/shop';
import Iconfont from '@/components/Iconfont';
import OrderProduct from '@/components/OrderProduct';
import GImage from '@/components/GImage';

import './index.less';

const refundText = {
  1: '退款中',
  2: '退款关闭',
  3: '退款成功',
  4: '退货中',
  5: '退货关闭',
  6: '退货成功'
};

const warrantyTypeRange = [ '仅退款', '退货退款' ];
// const reasonRange = [ '不想要了', '与图片不符' ];
const statusRange = [ '未收到货', '已收到货' ];

class RefundOrderDetail extends Component {
  config = {
    navigationBarTitleText: '退款详情'
  };

  state = {
    orderInfo: Taro.getStorageSync('order_detail'),
    refundInfo: ''
  };

  componentWillMount() {
    this.getRefundInfo();
  }

  getRefundInfo = () => {
    const { orderInfo } = this.state;
    const order = _.get(orderInfo, 'order');
    const orderId = order.orderId;
    shopApi
      .queryOrderById({
        orderId
      })
      .then((res) => {
        const refundInfo = res.orderWarrantyLogEntity;
        this.setState({
          refundInfo
        });
      })
      .catch(() => {});
  };

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
    const { orderInfo, refundInfo } = this.state;
    const order = _.get(orderInfo, 'order');
    const userAddress = _.get(orderInfo, 'userAddress');
    const orderItemList = _.get(orderInfo, 'orderItemList');

    if (!order) { return null }

    return (
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
              <View className='f-number'>¥ {order.totalFee.toFixed(2)}</View>
            </View>
            <View className='flex align-center justify-between py-2'>
              <View>运费</View>
              <View className='f-number'>¥ 0.00</View>
            </View>
            <View className='flex align-center justify-between py-2'>
              <View>优惠券</View>
              <View className='f-number'>-¥ {order.discountFee.toFixed(2)}</View>
            </View>
          </View>
          <View className='text-right pt-3 font-s-28 px-2'>
            <Text className='text-hui'>已优惠¥{order.discountFee.toFixed(2)}，</Text>
            <Text>共计：</Text>
            <Text className='text-red f-number'>¥{order.paidFee.toFixed(2)}</Text>
          </View>
        </View>

        {refundInfo && (
          <View className='u-order'>
            <View className='border-bottom-divider pb-2 font-s-32 px-2'>退款信息</View>
            <View className='u-order__item px-2'>
              <View className='u-order__tag'>退款类型：</View>
              <View className='u-order__val'>{warrantyTypeRange[refundInfo.warrantyType]}</View>
            </View>
            <View className='u-order__item px-2'>
              <View className='u-order__tag'>货物状态：</View>
              <View className='u-order__val'>{statusRange[refundInfo.productState]}</View>
            </View>
            {refundInfo.warrantyType == '1' && (
              <View className='u-order__item px-2'>
                <View className='u-order__tag'>退货单号：</View>
                <View className='u-order__val'>{refundInfo.logisticsNo}</View>
              </View>
            )}
            <View className='u-order__item px-2'>
              <View className='u-order__tag'>退款原因：</View>
              <View className='u-order__val'>{refundInfo.reason}</View>
            </View>
            <View className='u-order__item px-2'>
              <View className='u-order__tag'>退款说明：</View>
              <View className='u-order__val'>{refundInfo.remark}</View>
            </View>
            {refundInfo.imgArray && (
              <View className='flex flex-wrap px-2 mt-2'>
                {JSON.parse(refundInfo.imgArray).map((img) => {
                  return (
                    <View key={img.url} className='u-img__wrap'>
                      <GImage my-class='u-img' src={img.url} resize="400" />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

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
    );
  }
}

export default RefundOrderDetail;
