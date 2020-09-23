import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import statusText from '@/lib/statusText';
import statusColor from '@/lib/statusColor';
import _ from '@/lib/lodash';
import Iconfont from '@/components/Iconfont';
import OrderProduct from '@/components/OrderProduct';
import { AtButton } from 'taro-ui';
import shopApi from '@/api/shop';
import requestPaymentPro from '@/lib/pay';

import './index.less';

class OrderDetail extends Component {
  config = {
    navigationBarTitleText: '订单详情'
  };

  state = {
    orderInfo: Taro.getStorageSync('order_detail')
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

  onRepay = () => {
    const { orderInfo } = this.state;
    const order = _.get(orderInfo, 'order');
    const orderId = order.orderId;
    Taro.showLoading();
    shopApi
      .againPayOrder({
        orderId
      })
      .then((res) => {
        Taro.hideLoading();
        requestPaymentPro(res)
          .then(() => {
            Taro.showToast({
              title: '支付成功',
              icon: 'none'
            });
            Taro.switchTab({
              url: '/pages/user/index',
              complete: () => {
                Taro.navigateTo({
                  url: '/pages/order/index?current=2'
                });
              }
            });
          })
          .catch((err) => {
            console.error(err);
            Taro.showToast({
              title: '支付失败',
              icon: 'none'
            });
          });
      })
      .catch((err) => {
        Taro.hideLoading();
        Taro.showToast({
          title: err.message,
          icon: 'none'
        });
      });
  };

  onCancel = () => {
    const { orderInfo } = this.state;
    const order = _.get(orderInfo, 'order');
    const orderId = order.orderId;
    Taro.showModal({
      title: '提示',
      content: '是否确定取消订单',
      confirmColor: '#FF7013'
    })
      .then((res) => {
        if (res.confirm) {
          Taro.showLoading();
          shopApi
            .cancelOrder({
              orderId
            })
            .then(() => {
              Taro.hideLoading();
              Taro.switchTab({
                url: '/pages/user/index',
                complete: () => {
                  Taro.navigateTo({
                    url: '/pages/order/index?current=5'
                  });
                }
              });
            })
            .catch((err) => {
              Taro.hideLoading();
              Taro.showToast({
                title: err.message,
                icon: 'none'
              });
            });
        }
      })
      .catch(() => {});
  };

  // 退货退款
  onRefund = () => {
    Taro.showActionSheet({
      itemList: [ '仅退款', '退货退款' ]
    })
      .then((res) => {
        // 需要退款订单信息
        const orderRefund = Taro.getStorageSync('order_detail');
        Taro.setStorageSync('order_refund', orderRefund);
        const { tapIndex } = res;
        if (tapIndex === 0) {
          // 仅退款
          Taro.navigateTo({
            url: '/pages/refund/index?warrantyType=0'
          });
        } else {
          // 退货退款
          Taro.navigateTo({
            url: '/pages/refund/index?warrantyType=1'
          });
        }
      })
      .catch(() => {});
  };

  onRebuy = () => {
    Taro.showToast({
      title: '暂不支持',
      icon: 'none'
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
            color: statusColor[order.orderStatus]
          }}
        >
          <Text>{statusText[order.orderStatus]}</Text>
          <Image className='u-status__icon' src={require('../../images/order_header.png')}></Image>
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

          {/* 待支付 */}
          {order.orderStatus == 100 && (
            <View className='u-action'>
              <AtButton className='u-action__btn' type='secondary' circle onClick={this.onCancel}>
                取消订单
              </AtButton>
              <AtButton className='u-action__btn' type='primary' circle onClick={this.onRepay}>
                立即支付
              </AtButton>
            </View>
          )}
          {/* 待发货，待收获，已完成 */}
          {[ 200, 300, 400 ].includes(order.orderStatus) && (
            <View className='u-action'>
              <AtButton className='u-action__btn' type='secondary' circle onClick={this.onRefund}>
                退换
              </AtButton>
              <AtButton className='u-action__btn' type='primary' circle onClick={this.onRebuy}>
                再来一单
              </AtButton>
            </View>
          )}
        </View>
      </View>
    ) : null;
  }
}

export default OrderDetail;
