import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import { AtButton } from 'taro-ui'
import config from '@/config'
import Iconfont from '@/components/Iconfont'
import _ from '@/lib/lodash'
import statusColor from '@/lib/statusColor'
import statusText from '@/lib/statusText'
import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () {}

  componentDidMount () {}

  cancelOrder = (e) => {
    e.stopPropagation()
    const { orderInfo } = this.props
    const order = _.get(orderInfo, 'order')
    this.props.onCancel && this.props.onCancel(order.orderId)
  }

  // 重新发起支付
  repay = (e) => {
    e.stopPropagation()
    const { orderInfo } = this.props
    const order = _.get(orderInfo, 'order')
    this.props.onRepay && this.props.onRepay(order.orderId) 
  }

  // 确认收货
  deliveryOrder = (e) => {
    e.stopPropagation()
    const { orderInfo } = this.props
    const order = _.get(orderInfo, 'order')
    this.props.onDeliveryOrder && this.props.onDeliveryOrder(order.orderId) 
  }

  goDetail = () => {
    Taro.setStorageSync('order_detail', this.props.orderInfo)
    Taro.navigateTo({
      url: '/pages/orderDetail/index'
    })
  }

  render () {
    const { orderInfo } = this.props
    const order = _.get(orderInfo, 'order', {})
    const orderItemList = _.get(orderInfo, 'orderItemList', [])
    const totalQuantity = orderItemList.reduce((total, item) => {
      return total + item.quantity
    }, 0)

    return (
      <View className='u-orderItem'>
        <View className='u-header' onClick={this.goDetail}>
          <Image className='u-logo' src={config.petAvatar} lazyLoad webp />
          <View className='u-info'>
            <View className='u-info__label'>商品零售</View>
            <View className='u-info__date'>{order.createTime}</View>
          </View>
          <View
            className='u-status'
            style={{
              color: statusColor[order.orderStatus]
            }}
          >
            {statusText[order.orderStatus]}
          </View>
        </View>
        {orderItemList.map((item) => {
          let specs = item.productSku.specs.map((s) => s.name + '/' + s.value).join('/')
          return (
            <View className='u-product__item' key={item.id} onClick={this.goDetail}>
              <View className='u-product__img'>
                <Image src={item.productSku.skuImgUrl} lazyLoad webp />
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
          )
        })}
        <View className='u-total' onClick={this.goDetail}>
          共{totalQuantity}件商品 合计： ¥{order.totalFee && order.totalFee.toFixed(2)}
        </View>
        {order.orderStatus == 100 && (
          <View className='u-action'>
            <AtButton className='u-action__btn' type='secondary' circle onClick={this.cancelOrder}>
              取消订单
            </AtButton>
            <AtButton className='u-action__btn' type='primary' circle onClick={this.repay}>
              立即支付
            </AtButton>
          </View>
        )}
        {order.orderStatus == 300 && (
          <View className='u-action'>
            <AtButton className='u-action__btn' type='primary' circle onClick={this.deliveryOrder}>
              确认收货
            </AtButton>
          </View>
        )}
      </View>
    )
  }
}

index.defaultProps = {}

index.propTypes = {
  orderInfo: PropTypes.object,
  onCancel: PropTypes.func,
  onDeliveryOrder: PropTypes.func
}

export default index
