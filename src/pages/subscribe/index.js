import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import apiHome from '@/api/home'
import Iconfont from '@/components/Iconfont'
import makePhoneCall from '@/lib/makePhoneCall'
import config from '@/config'
import _ from '@/lib/lodash'
import { getPet } from '@/actions/pet'

import './index.less'

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
    petId: '',
    banners: []
  }

  componentWillMount () {
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
    makePhoneCall('15557007893')
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

  todo = () => {
    Taro.showToast({
      title: '敬请期待',
      icon: 'none'
    })
  }

  render () {
    const { banners, petId } = this.state
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
      </View>
    )
  }
}

export default index
