import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import PropTypes from 'prop-types'
import config from '@/config'
import { AtButton } from 'taro-ui'
import serviceSource from '@/lib/serviceList'
import './index.less'

// 待支付，100已预约，200已完成，900已取消
const statusText = {
  0: '待支付',
  100: '已预约',
  200: '已完成',
  900: '已取消'
}
const statusColor = {
  0: '#F24957',
  100: '#67C23A',
  200: '#909399',
  900: '#909399'
}

@connect(
  ({ user, pet }) => ({
    user,
    pet
  }),
  (dispatch) => ({})
)
class index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () {}

  componentDidMount () {}

  cancelOrder = (e) => {
    e.stopPropagation()
    const { item } = this.props
    this.props.onCancel && this.props.onCancel(item.id)
  }

  goDetail = () => {}

  render () {
    const { pet, item } = this.props
    const currentPet = pet.list.filter(p => item.petId === p.id)[0]
    return (
      <View className='u-orderItem'>
        <View className='u-header'>
          <Image className='u-logo' src={currentPet ? currentPet.avatar : config.petAvatar} lazyLoad webp />
          <View className='u-info'>
            <View className='u-info__label'>服务订单</View>
            <View className='u-info__date'>{item.createTime}</View>
          </View>
          <View
            className='u-status'
            style={{
              color: statusColor[item.reserveOrderStatus]
            }}
          >
            {statusText[item.reserveOrderStatus]}
          </View>
        </View>
        <View className='u-product__item' onClick={this.goDetail}>
          <View className='u-product__img'>
            <Image src={serviceSource.serviceMap[item.service].icon || config.petAvatar} lazyLoad webp />
          </View>
          <View className='u-product__info'>
            <View className='u-product__name'>{item.service}</View>
            <View className='u-product__specs'>{currentPet ? currentPet.petName : '宠物已经删除'}</View>
            <View className='u-product__specs'>{currentPet ? currentPet.petBreed : ''}</View>
          </View>
          <View className='u-product__right'>
            <View className='u-product__price'>¥ {serviceSource.serviceMap[item.service].price}</View>
          </View>
        </View>
        <View className='u-total' onClick={this.goDetail}>
          共1件商品
        </View>
        
        <View className='u-serviceTime'>订单编号：{item.id}</View>
        <View className='u-serviceTime'>服务时间：{item.reserveTime}</View>

        {item.reserveOrderStatus == 100 && (
          <View className='u-action'>
            <AtButton className='u-action__btn' type='secondary' circle onClick={this.cancelOrder}>
              取消订单
            </AtButton>
          </View>
        )}
      </View>
    )
  }
}

index.defaultProps = {
  item: {}
}

index.propTypes = {
  item: PropTypes.object,
  onCancel: PropTypes.func
}

export default index
