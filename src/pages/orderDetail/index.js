import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import statusText from '@/lib/statusText'
import statusColor from '@/lib/statusColor'
import _ from '@/lib/lodash'
import Iconfont from '@/components/Iconfont'
import OrderProduct from '@/components/OrderProduct'
import { AtButton } from 'taro-ui'
import shopApi from '@/api/shop'
import requestPaymentPro from '@/lib/pay'

import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '订单详情'
  }

  state = {
    orderInfo: Taro.getStorageSync('order_detail')
  }

  componentWillMount () {}

  componentDidMount () {}

  goProduct = (item) => {
    Taro.navigateTo({
      url: `/pages/product/index?productId=${item.productSku.productId}&skuId=${item.productSku.id}`
    })
  }

  doCopy = () => {
    const { orderInfo } = this.state
    const order = _.get(orderInfo, 'order')
    const orderId = order.orderId
    Taro.setClipboardData({
      data: orderId,
      success: () => {
        Taro.showToast({
          title: '订单已复制',
          icon: 'success'
        })
      }
    })
  }

  onRepay = () => {
    const { orderInfo } = this.state
    const order = _.get(orderInfo, 'order')
    const orderId = order.orderId
    Taro.showLoading()
    shopApi
      .againPayOrder({
        orderId
      })
      .then((res) => {
        Taro.hideLoading()
        requestPaymentPro(res)
          .then(() => {
            Taro.showToast({
              title: '支付成功',
              icon: 'none'
            })
            Taro.switchTab({
              url: '/pages/user/index',
              complete: () => {
                Taro.navigateTo({
                  url: '/pages/order/index?current=2'
                })
              }
            })
          })
          .catch((err) => {
            console.error(err)
            Taro.showToast({
              title: '支付失败',
              icon: 'none'
            })
          })
      })
      .catch((err) => {
        Taro.hideLoading()
        Taro.showToast({
          title: err.message,
          icon: 'none'
        })
      })
  }

  onCancel = () => {
    const { orderInfo } = this.state
    const order = _.get(orderInfo, 'order')
    const orderId = order.orderId
    Taro.showModal({
      title: '提示',
      content: '是否确定取消订单',
      confirmColor: '#ffdb47'
    })
      .then((res) => {
        if (res.confirm) {
          Taro.showLoading()
          shopApi
            .cancelOrder({
              orderId
            })
            .then(() => {
              Taro.hideLoading()
              Taro.switchTab({
                url: '/pages/user/index',
                complete: () => {
                  Taro.navigateTo({
                    url: '/pages/order/index?current=5'
                  })
                }
              })
            })
            .catch((err) => {
              Taro.hideLoading()
              Taro.showToast({
                title: err.message,
                icon: 'none'
              })
            })
        }
      })
      .catch(() => {})
  }

  render () {
    const { orderInfo } = this.state
    const order = _.get(orderInfo, 'order')
    const userAddress = _.get(orderInfo, 'userAddress')
    const orderItemList = _.get(orderInfo, 'orderItemList')
    return orderInfo ? (
      <View className='u-orderDetail'>
        <View
          className='u-status'
          style={{
            color: statusColor[order.orderStatus]
          }}
        >
          {statusText[order.orderStatus]}
        </View>

        <View className='u-address'>
          <View className='u-address__icon'>
            <Iconfont type='icondizhi01' color='#6a92e2' />
          </View>
          <View className='u-address__info'>
            <View>
              <Text className='u-address__name'>{userAddress.contact}</Text>
              <Text className='u-address__mobile'>{userAddress.mobile}</Text>
            </View>
            <View className='u-address__location'>
              {userAddress.province}
              {userAddress.city}
              {userAddress.area}
              {userAddress.detail}
            </View>
          </View>
        </View>

        <View className='u-sku'>
          <View className='u-sku__label'>商品信息</View>
          {orderItemList.map((item) => {
            return <OrderProduct key={item.id} item={item} onClick={this.goProduct.bind(this, item)} />
          })}
          <View className='u-sku__pay'>
            <View className='u-sku__tip'>实付金额</View>
            <View className='u-sku__total'>¥ {order.totalFee.toFixed(2)}</View>
          </View>
        </View>

        <View className='u-order'>
          <View className='u-order__label'>订单信息</View>
          <View className='u-order__item'>
            <View className='u-order__tag'>订单编号</View>
            <View className='u-order__val'>{order.orderId}</View>
            <View className='u-copy' onClick={this.doCopy}>
              复制
            </View>
          </View>
          <View className='u-order__item'>
            <View className='u-order__tag'>付款时间</View>
            <View className='u-order__val'>{order.createTime}</View>
          </View>
          <View className='u-order__item'>
            <View className='u-order__tag'>订单备注</View>
            <View className='u-order__val'>{order.buyerMemo}</View>
          </View>
          <View className='u-pay'>
            <View className='u-pay__label'>支付方式</View>
            <View className='u-pay__val'>
              <Iconfont type='iconweixinzhifu' color='#84c83e' size='16' />
              <View style={{ marginLeft: '2px' }}>微信支付</View>
            </View>
          </View>

          {/* TODO: 待收货 查看物流 提醒发货 */}
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
        </View>
      </View>
    ) : null
  }
}

export default index
