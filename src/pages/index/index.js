import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components'
import { AtNoticebar } from 'taro-ui'
import { Iconfont } from '@/components/Iconfont'
import apiHome from '@/api/home'
import _ from '@/lib/lodash'
import './index.less'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '小黄兜宠物',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
    onReachBottomDistance: 50,
    backgroundColor: '#f3f5f6'
  }

  state = {
    banners: [],
    notice: '',
    products: []
  }

  onPullDownRefresh () {
    console.log('>>> 执行刷新')
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  onReachBottomDistance () {
    console.log('>>> 执行加载更多')
  }

  componentWillMount () {}

  componentDidMount () {
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
    apiHome
      .queryNotice()
      .then((res) => {
        this.setState({
          notice: _.get(res, '[0].title', '暂无公告')
        })
      })
      .catch((error) => {
        console.log('>>> queryNotice异常', error)
      })
    apiHome
      .queryNewProducts({})
      .then((res) => {
        this.setState({
          products: _.get(res, 'items', [])
        })
      })
      .catch((error) => {
        console.log('>>> queryNewProducts异常', error)
      })
  }

  componentWillUnmount () {}

  componentDidShow () {}

  componentDidHide () {}

  render () {
    const { banners, notice, products } = this.state
    return (
      <View className='u-home'>
        <Swiper className='u-swiper' indicatorColor='#999' indicatorActiveColor='#333' circular indicatorDots autoplay>
          {banners.map((banner) => (
            <SwiperItem key={banner.id}>
              <Image className='u-item' src={banner.imgUrl} />
            </SwiperItem>
          ))}
        </Swiper>
        <View className='u-notice'>
          <AtNoticebar marquee icon='volume-plus' speed={50}>
            {notice}
          </AtNoticebar>
        </View>
        <View className='u-quick'>
          <View className='u-quick__name'>DOUDOU小黄兜宠物(杭州滨江店)</View>
          <View className='u-quick__address'>浙江省杭州市滨江区888号</View>
          <View className='u-quick__bottom'>
            <View className='u-quick__distance'>距离您3km</View>
            <View className='u-quick__switch'>切换门店</View>
            <View className='u-quick__yuyue'>预约洗护</View>
          </View>
        </View>
        <View className='u-nav'>
          <View className='u-nav__item'>
            <View className='u-nav__name'>商城</View>
            <View className='u-nav__tip'>海量商品放心购</View>
            <View className='u-nav__icon'>
              <Iconfont type='iconzhuye' />
            </View>
          </View>
          <View className='u-nav__item'>
            <View className='u-nav__name'>领券中心</View>
            <View className='u-nav__tip'>海量优惠等你来</View>
            <View className='u-nav__icon'>
              <Iconfont type='iconyouhuiquan-' />
            </View>
          </View>
        </View>
        <View className='u-subtitle'>新品推荐</View>
        <View className='u-product-list'>
          {products.map((product) => {
            return (
              <View className='u-product' key={product.id}>
                <Image className='u-product__image' src={product.imgUrl} />
                <View className='u-product__name'>{product.name}</View>
                <View className='u-product__price'>
                  <Text>¥ </Text>
                  <Text>{product.price.toFixed(2)}</Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
