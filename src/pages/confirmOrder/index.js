import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Image, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Iconfont from '@/components/Iconfont'
import { getAddress } from '@/actions/address'

import './index.less'

@connect(
  ({ address }) => ({
    address
  }),
  (dispatch) => ({})
)
class index extends Component {
  config = {
    navigationBarTitleText: '确认订单',
    backgroundColor: '#f3f4f8'
  }

  state = {
    remark: '',
    orderProduct: []
  }

  componentWillMount () {
    const orderProduct = Taro.getStorageSync('order_product') || []
    console.log('>>> orderProduct', orderProduct)
    this.setState({
      orderProduct
    })
  }

  componentDidMount () {
    getAddress()
  }

  goAddress = () => {
    Taro.navigateTo({
      url: '/pages/address/index?from=confirmOrder'
    })
  }

  goRemark = () => {//
    const vm = this
    Taro.navigateTo({
      url: '/pages/remark/index',
      events: {
        acceptDataFromOpenedPage (data) {
          vm.setState({
            remark: data.data
          })
        }
      },
      success (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: vm.state.remark })
      }
    })
  }

  handleSubmit = () => {
    Taro.showToast({
      title: '提交订单～',
      icon: 'none'
    })
  }

  render () {
    const { remark, orderProduct } = this.state
    const { address } = this.props
    const chooseAddress = address.list.filter((item) => item.id === address.id)[0]
    const totalPrice = orderProduct.reduce((total, item) => {
      return total + Number(item.price)
    }, 0)

    return (
      <View className='u-confirmOrder'>
        <View className='u-address' onClick={this.goAddress}>
          {chooseAddress ? (
            <View className='u-address__left'>
              <View className='u-address__location'>
                {chooseAddress.province}
                {chooseAddress.city}
                {chooseAddress.area} {chooseAddress.detail}
              </View>
              <View className='u-address__contact'>
                {chooseAddress.contact} {chooseAddress.mobile}
              </View>
            </View>
          ) : (
            <View className='u-address__left'>选择收货地址</View>
          )}
          <View className='u-address__right'>
            <Iconfont type='iconarrowright' size='20' color='#000' />
          </View>
        </View>

        <View className='u-product'>
          <View className='u-product__label'>商品信息</View>

          {orderProduct.map((item) => {
            let specs = item.productSku.specs.map((s) => s.name + '/' + s.value).join('/')
            return (
              <View className='u-product__item' key={item.id}>
                <View className='u-product__img'>
                  <Image src={item.productSku.skuImgUrl} lazyLoad webp />
                </View>
                <View className='u-product__info'>
                  <View className='u-product__name'>{item.productSku.skuName}</View>
                  <View className='u-product__specs'>{specs}</View>
                </View>
                <View className='u-product__right'>
                  <View className='u-product__price'>¥ {item.price}</View>
                  <View className='u-product__count'>
                    <Iconfont type='iconshanchu' size='14' color='#ccc' /> {item.quantity}
                  </View>
                </View>
              </View>
            )
          })}

          <View className='u-item'>
            <View className='u-label'>
              配送方式 <Text style={{ color: '#ccc' }}>物流配送</Text>
            </View>
            <View className='u-val'>快递 免邮</View>
          </View>
        </View>

        <View className='u-pay'>
          <View className='u-item'>
            <View className='u-label'>支付方式</View>
            <View className='u-val'>
              <Iconfont type='iconweixinzhifu' color='#84c83e' size='16' />
              <View style={{ marginLeft: '2px' }}>微信支付</View>
            </View>
          </View>
        </View>

        <View className='u-remark' onClick={this.goRemark}>
          <View className='u-item'>
            <View className='u-label'>订单备注</View>
            <View className='u-val'>
              {remark ? (
                <View className='u-remark__val'>{remark}</View>
              ) : (
                <View className='u-remark__placeholder'>选填，如有特殊要求</View>
              )}
              <Iconfont type='iconarrowright' size='14' color='#ccc' />
            </View>
          </View>
        </View>

        <View className='u-bottom'>
          <View className='u-bottom__info'>
            <Text className='u-bottom__count'>共4件，</Text>
            <Text className='u-bottom__price'>合计：¥ {totalPrice.toFixed(2)}</Text>
          </View>
          <AtButton className='u-action__btn' type='primary' circle={false} full onClick={this.handleSubmit}>
            提交订单
          </AtButton>
        </View>
      </View>
    )
  }
}

export default index
