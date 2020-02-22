import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components'
import { AtNoticebar } from 'taro-ui'
import { Iconfont } from '@/components/Iconfont'
import apiHome from '@/api/home'
import _ from '@/lib/lodash'
import { getCart } from '@/actions/cart'
import config from '@/config'
import './index.less'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '小黄兜宠物',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
    onReachBottomDistance: 50,
    backgroundColor: '#f3f4f8'
  }

  state = {
    banners: [],
    notice: '',
    products: []
  }

  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '小黄兜宠物生活馆',
      path: '/pages/index/index',
      imageUrl: config.shareIcon
    }
  }

  onPullDownRefresh () {
    console.log('>>> 执行刷新')
    setTimeout(() => {
      this.init()
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  onReachBottomDistance () {
    console.log('>>> 执行加载更多')
  }

  componentWillMount () {}

  componentDidMount () {
    this.init()
  }

  componentWillUnmount () {}

  componentDidShow () {
    getCart()
  }

  componentDidHide () {}

  init = () => {
    getCart()
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

  goProduct = (item) => {
    Taro.navigateTo({
      url: `/pages/product/index?productId=${item.productId}&skuId=${item.id}`
    })
  }

  goShop = () => {
    Taro.switchTab({
      url: '/pages/shop/index'
    })
  }

  todo = () => {
    Taro.showToast({
      title: '敬请期待',
      icon: 'none'
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

  render () {
    const { banners, notice, products } = this.state
    return (
      <View className='u-home'>
        <Swiper className='u-swiper' indicatorColor='#999' indicatorActiveColor='#333' circular indicatorDots autoplay>
          {banners.map((banner) => (
            <SwiperItem key={banner.id}>
              <Image className='u-item' src={banner.imgUrl} lazyLoad webp />
            </SwiperItem>
          ))}
        </Swiper>
        <View className='u-notice'>
          <AtNoticebar marquee icon='volume-plus' speed={50}>
            {notice}
          </AtNoticebar>
        </View>
        <View className='u-quick'>
          <View className='u-quick__name'>小黄兜宠物生活馆(杭州滨江店)</View>
          <View className='u-quick__address'>浙江省杭州市滨江区滨盛路1893号</View>
          <View className='u-quick__bottom'>
            {/* <View className='u-quick__distance'>距离您3km</View> */}
            <View className='u-quick__icon' onClick={this.openLocation}>
              <Iconfont type='icondizhi01' color='#ffdb47' />
              <Text style={{marginLeft: '5px'}}>查看位置</Text>
            </View>
            {/* <View className='u-quick__switch'>切换门店</View> */}
            <View className='u-quick__yuyue'>预约洗护</View>
          </View>
        </View>
        <View className='u-nav'>
          <View className='u-nav__item' onClick={this.goShop}>
            <View className='u-nav__name'>商城</View>
            <View className='u-nav__tip'>海量商品放心购</View>
            <View className='u-nav__icon'>
              <Iconfont type='iconzhuye' />
            </View>
          </View>
          <View className='u-nav__item' onClick={this.todo}>
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
              <View className='u-product' key={product.id} onClick={this.goProduct.bind(this, product)}>
                <Image className='u-product__image' src={product.skuImgUrl} mode='scaleToFill' lazyLoad webp />
                <View className='u-product__name'>{product.skuName}</View>
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
