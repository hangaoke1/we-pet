import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'
import config from '@/config'
import Iconfont from '@/components/Iconfont'
import _ from '@/lib/lodash'
import { getUserInfo } from '@/actions/user'
import { getPet } from '@/actions/pet'
import storeApi from '@/api/store'
import serviceSource from '@/lib/serviceList'

import './index.less'

@connect(
  ({ pet, user }) => ({
    pet,
    user
  }),
  (dispatch) => ({})
)
class index extends Component {
  config = {
    navigationBarTitleText: '确认预约'
  }

  state = {
    storeId: '',
    petId: '',
    service: {},
    reserveTime: '',
    date: ''
  }

  componentWillMount () {
    const params = Taro.getStorageSync('subscribe_order')
    const { storeId, petId, service, reserveTime, date, time } = params
    this.setState({
      storeId,
      petId,
      service,
      reserveTime,
      date,
      time
    })
  }

  componentDidMount () {}

  componentDidShow () {
    if (this.props.user.isLogin) {
      getUserInfo()
      getPet()
    }
  }

  handleSubmit = () => {
    const { storeId, petId, service, reserveTime } = this.state
    const params = {
      storeId,
      petId,
      service: service.name,
      reserveTime
    }
    Taro.showLoading()
    storeApi.insertReserveWash(params).then(() => {
      Taro.hideLoading()
      Taro.navigateTo({
        url: '/pages/storeOrder/index'
      })
    }).catch(err => {
      Taro.hideLoading()
      Taro.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  }

  render () {
    const { user, pet } = this.props
    const { petId, service, date, time } = this.state
    const choosePet = _.get(pet, 'list', []).filter(item => item.id == petId)[0] || {}
    const userInfo = _.get(user, 'userInfo')
    return (
      <View className='u-subscribeCofirm'>
        <View className='u-header'>
          <View className='u-header__tip'>确认预约信息</View>
          <View className='u-header__info'>{userInfo.mobile} {userInfo.nickName}</View>
        </View>

        <View className='u-store'>
          <View className='u-store__name'>小黄兜宠物生活馆(滨江店)</View>
          <View className='u-store__address'>
            <Iconfont type='icondizhi01' color='#ccc' size='16' />
            <Text style={{ marginLeft: '4px' }}>浙江省杭州市滨江区滨盛路1893号</Text>
          </View>
          <View className='u-pay'>
            {/* <View className='u-pay__item'>
              <Iconfont type='iconcb' color='#ccc' size='16' />
              <Text style={{ marginLeft: '4px' }}>线上支付</Text>
            </View> */}
            <View className='u-pay__item'>
              <Iconfont type='iconhints-success' color='#84c83e' size='16' />
              <Text style={{ marginLeft: '4px' }}>到店支付</Text>
            </View>
          </View>
        </View>

        <View className='u-service'>
          <View className='u-pet'>
            <Image className='u-pet__avatar' src={choosePet.avatar} />
            <View className='u-pet__info'>
              <View className='u-pet__name'>{choosePet.petName}</View>
              <View className='u-pet__type'>{choosePet.petBreed}</View>
            </View>
          </View>
          <View className='u-service__item'>
            <Image className='u-service__icon' src={serviceSource.serviceMap[service.name].icon || config.petAvatar} />
            <View className='u-service__name'>{service.name}</View>
            <View className='u-service__price'>¥ {service.price}</View>
          </View>
          <View className='u-service__time'>
            <View className='u-service__label'>预约服务时间</View>
            <View className='u-service__val'>{date} {time}</View>
          </View>
          <View className='u-service__time'>
            <View className='u-service__label'>服务时长</View>
            <View className='u-service__val'>预计1小时结束</View>
          </View>
        </View>

        <View className='u-payment'>
          <View className='u-payment__item'>
            <View className='u-payment__label'>支付方式</View>
            <View className='u-payment__val'>
              <Iconfont type='iconweixinzhifu' color='#84c83e' size='16' />
              <View style={{ marginLeft: '2px' }}>微信支付</View>
            </View>
          </View>
          <View className='u-payment__remark'>
            <View className='u-payment__label'>备注</View>
            <Input className='u-payment__input' placeholder='亲亲可以在这里填写备注' />
          </View>
        </View>

        <View className='u-tip'>
          <View className='u-tip__title'>关于违约、改约</View>
          <View>*迟到不保留预约资格</View>
          <View>*请提前2小时致电门店修改预约，并调整时间</View>
        </View>

        <View className='u-action'>
          <View className='u-action__left' />
          <View className='u-action__right'>
            <View>
              <Text className='u-action__label'>预约金：</Text>
              <Text className='u-action__val'>¥ 0</Text>
            </View>
            <AtButton className='u-action__btn' type='primary' circle={false} full onClick={this.handleSubmit}>
              去下单
            </AtButton>
          </View>
        </View>
      </View>
    )
  }
}

export default index
