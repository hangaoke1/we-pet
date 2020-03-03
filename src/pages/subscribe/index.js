import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import classNames from 'classnames'
import { View, Swiper, SwiperItem, Image, ScrollView, Block, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import apiHome from '@/api/home'
import Iconfont from '@/components/Iconfont'
import makePhoneCall from '@/lib/makePhoneCall'
import config from '@/config'
import _ from '@/lib/lodash'
import { getPet } from '@/actions/pet'
import dayjs from 'dayjs'

import './index.less'

function isDisabled (dateFmt, time) {
  const current = dayjs()
  const d = dayjs(`${dateFmt} ${time}`)
  return d.isBefore(current)
}

function isDisabledInt (dateFmt, time) {
  const current = dayjs()
  const d = dayjs(`${dateFmt} ${time}`).add(45, 'minute')
  return d.isBefore(current)
}

function genDate () {
  const arr = [
    dayjs(),
    dayjs().add(1, 'day'),
    dayjs().add(2, 'day'),
    dayjs().add(3, 'day'),
    dayjs().add(4, 'day'),
    dayjs().add(5, 'day'),
    dayjs().add(6, 'day'),
    dayjs().add(7, 'day'),
    dayjs().add(8, 'day')
  ]
  const weekMap = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六'
  }
  const newArray = arr.map((item) => {
    return {
      date: item.format('MM.DD'),
      dateFmt: item.format('YYYY-MM-DD'),
      week: weekMap[item.day()],
      value: item
    }
  })
  return newArray
}

@connect(
  ({ pet }) => ({
    pet
  }),
  (dispatch) => ({})
)
class index extends Component {
  config = {
    navigationBarTitleText: '预约洗护'
  }

  state = {
    storeId: 1,
    petId: '',
    service: { name: '洗澡', icon: '', price: 100 },
    date: '',
    dateFmt: '',
    timeInt: '',
    time: '',
    banners: [],
    // 洗澡、spa、美容、洁齿
    serviceList: [
      { name: '洗澡', icon: '', price: 100 },
      { name: 'spa', icon: '', price: 150 },
      { name: '美容', icon: '', price: 120 },
      { name: '洁齿', icon: '', price: 80 }
    ],
    dateList: [],
    timeList: [
      [ '10:00', '11:00', '12:00', '13:00' ],
      [ '14:00', '15:00', '16:00', '17:00' ],
      [ '18:00', '19:00', '20:00', '21:00' ]
    ]
  }

  componentWillMount () {
    const dateList = genDate()
    this.setState({
      dateList,
      date: dateList[0].date,
      dateFmt: dateList[0].dateFmt
    })
    apiHome
      .queryBanners()
      .then((res) => {
        this.setState({
          banners: res || []
        })
      })
      .catch((error) => {
        console.log('>>> queryBanners异常', error)
      })
  }

  componentDidMount () {}

  componentDidShow () {
    getPet().then(() => {
      if (!this.state.petId) {
        this.setState({
          petId: _.get(this.props, 'pet.list[0].id', '')
        })
      }
    })
  }

  openLocation = () => {
    Taro.openLocation({
      latitude: 30.206371,
      longitude: 120.202034,
      name: '小黄兜宠物生活馆',
      address: '浙江省杭州市滨江区滨盛路1893号'
    })
  }

  doCall = () => {
    makePhoneCall(config.tel)
  }

  goPet = () => {
    Taro.navigateTo({
      url: '/pages/pet/index'
    })
  }

  selectedPet = (id) => {
    this.setState({
      petId: id
    })
  }

  selectedService = (item) => {
    this.setState({
      service: item
    })
  }

  chooseTime = (v, disabled) => {
    if (disabled) { return }
    this.setState({
      time: v
    })
  }

  chooseTimeInt = (v, disabled) => {
    if (disabled) { return }
    this.setState({
      timeInt: v
    })
  }

  selectDate = (item) => {
    this.setState({
      date: item.date,
      dateFmt: item.dateFmt,
      time: '',
      timeInt: ''
    })
  }

  handleSubmit = () => {
    const { storeId, petId, dateFmt, time, service, date } = this.state
    if (!time) {
      return Taro.showToast({
        title: '请选择时间',
        icon: 'none'
      })
    }
    if (!petId) {
      return Taro.showToast({
        title: '请选择爱宠',
        icon: 'none'
      })
    }
    if (!service) {
      return Taro.showToast({
        title: '请选择服务项目',
        icon: 'none'
      })
    }
    const params = {
      storeId, petId, service, reserveTime: `${dateFmt} ${time}:00`, date, time
    }
    Taro.setStorageSync('subscribe_order', params)
    Taro.navigateTo({
      url: '/pages/subscribeConfirm/index'
    })
  }

  todo = () => {
    Taro.showToast({
      title: '敬请期待',
      icon: 'none'
    })
  }

  render () {
    const { banners, petId, serviceList, service, timeList, timeInt, time, dateList, date, dateFmt } = this.state
    const subTime = timeInt
      ? [
          timeInt.slice(0, 3) + '00',
          timeInt.slice(0, 3) + '15',
          timeInt.slice(0, 3) + '30',
          timeInt.slice(0, 3) + '45'
        ]
      : []
    const { pet } = this.props
    const petList = _.get(pet, 'list', [])
    const currentPet = petList.filter((item) => item.id == petId)[0] || ''
    return (
      <View className='u-subscribe'>
        <Swiper className='u-swiper' indicatorColor='#999' indicatorActiveColor='#333' circular indicatorDots autoplay>
          {banners.map((banner) => (
            <SwiperItem key={banner.id}>
              <Image className='u-swiper__item' src={banner.imgUrl} lazyLoad webp />
            </SwiperItem>
          ))}
        </Swiper>

        <View className='u-header'>
          <View className='u-name'>
            <View className='u-name__text'>小黄兜宠物生活馆(杭州滨江店)</View>
            <View className='u-name__switch' onClick={this.todo}>
              切换门店
            </View>
          </View>
          <View className='u-subscribe__time'>预约时间：10:00 - 21:00</View>
          <View className='u-address'>
            <View className='u-address__icon' onClick={this.openLocation}>
              <Iconfont type='icondizhi01' color='#ffdb47' size='26' />
            </View>
            <View className='u-address__info' onClick={this.openLocation}>
              <View>浙江省杭州市滨江区滨盛路1893号</View>
            </View>
            <View className='u-address__call' onClick={this.doCall}>
              <Iconfont type='icondianhua' color='#ffdb47' size='24' />
            </View>
          </View>
        </View>

        <View className='u-pet'>
          <View className='u-pet__label'>选择服务宠物</View>
          <View className='u-pet__list'>
            {petList.map((item) => (
              <View className='u-pet__item' key={item.id} onClick={this.selectedPet.bind(this, item.id)}>
                <View className='u-pet__avatar'>
                  <Image className='u-pet__img' src={item.avatar || config.petAvatar} />
                  {item.id == petId && (
                    <View className='u-pet__selected'>
                      <Iconfont type='iconxuanzhong' color='#fff' size='16' />
                    </View>
                  )}
                </View>
                <View className='u-pet__name'>{item.petName}</View>
              </View>
            ))}

            <View className='u-pet__item' onClick={this.goPet}>
              <View className='u-pet__edit'>
                <Iconfont type='iconliebiao' color='#eee' size='18' />
              </View>
              <View className='u-pet__name'>管理宠物</View>
            </View>
          </View>

          {currentPet && <View className='u-pet__bottom'>{currentPet.petName}</View>}
        </View>

        <View className='u-service'>
          <View className='u-service__label'>服务套餐</View>
          <ScrollView scrollX>
            <View className='u-service__list'>
              {serviceList.map((item) => {
                return (
                  <View key={item.name} className='u-service__item' onClick={this.selectedService.bind(this, item)}>
                    <View className='u-service__header'>
                      <Image className='u-service__img' src={config.petAvatar} />
                      {item.name == service.name && (
                        <View className='u-service__selected'>
                          <Iconfont type='iconxuanzhong' color='#fff' size='16' />
                        </View>
                      )}
                    </View>
                    <View className='u-service__name'>{item.name}</View>
                  </View>
                )
              })}
            </View>
          </ScrollView>
          <View className='u-service__detail'>
            <View>查看详情</View>
            <Iconfont type='iconarrowright' color='#ccc' size='16' />
          </View>
        </View>

        <View className='u-time'>
          <View className='u-time__label'>选择时间</View>
          <View className='u-date'>
            <ScrollView scrollX>
              <View className='u-date__list'>
                {dateList.map((item, x) => {
                  return (
                    <View
                      className={classNames({
                        'u-date__item': true,
                        'u-date__active': item.date === date
                      })}
                      key={item.date}
                      onClick={this.selectDate.bind(this, item)}
                    >
                      {x === 0 && (
                        <View className='u-date__short'>
                          <Text>今天</Text>
                        </View>
                      )}
                      {x !== 0 && (
                        <Block>
                          <View className='u-date__long'>{item.date}</View>
                          <View className='u-date__short'>{item.week}</View>
                        </Block>
                      )}
                    </View>
                  )
                })}
              </View>
            </ScrollView>
          </View>
          {timeList.map((item) => (
            <View key={JSON.stringify(item)}>
              <View className='u-time__list'>
                {item.map((v) => {
                  const disabled = isDisabledInt(dateFmt, v)
                  return (
                    <View
                      className={classNames({
                        'u-time__item': true,
                        'u-time__active': v == timeInt,
                        'u-time__disabled': disabled
                      })}
                      key={v}
                      onClick={this.chooseTimeInt.bind(this, v, disabled)}
                    >
                      {v}
                    </View>
                  )
                })}
              </View>
              {item.includes(timeInt) && (
                <View className='u-time__subList'>
                  {subTime.map((v) => {
                    const disabled = isDisabled(dateFmt, v)
                    return (
                      <View
                        className={classNames({
                          'u-time__subItem': true,
                          'u-time__subActive': v == time,
                          'u-time__disabled': disabled
                        })}
                        key={v}
                        onClick={this.chooseTime.bind(this, v, disabled)}
                      >
                        {v}
                        {v == time && (
                          <View className='u-time__selected'>
                            <Iconfont type='iconxuanzhong' color='#fff' size='14' />
                          </View>
                        )}
                      </View>
                    )
                  })}
                </View>
              )}
            </View>
          ))}

          <View className='u-time__tip'>*迟到15分钟以上，门店不保留预约资格，请合理安排时间</View>
        </View>

        <View className='u-action'>
          <View className='u-action__left'></View>
          <View className='u-action__right'>
              <View>
                <Text className='u-action__label'>合计：</Text>
                <Text className='u-action__val'>¥ {service.price}</Text>
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
