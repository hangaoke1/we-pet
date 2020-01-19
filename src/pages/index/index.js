import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtNoticebar } from 'taro-ui'
import './index.less'

export default class Index extends Component {
  componentWillMount () {}

  componentDidMount () {}

  componentWillUnmount () {}

  componentDidShow () {}

  componentDidHide () {}

  config = {
    navigationBarTitleText: '小黄兜宠物'
  }

  render () {
    return (
      <View className='u-index'>
        <Swiper className='u-swiper' indicatorColor='#999' indicatorActiveColor='#333' circular indicatorDots autoplay>
          <SwiperItem>
            <Image className='u-item' src='https://hgkcdn.oss-cn-shanghai.aliyuncs.com/pet/banner1.jpeg' />
          </SwiperItem>
          <SwiperItem>
            <Image className='u-item' src='https://hgkcdn.oss-cn-shanghai.aliyuncs.com/pet/banner2.jpeg' />
          </SwiperItem>
          <SwiperItem>
            <Image className='u-item' src='https://hgkcdn.oss-cn-shanghai.aliyuncs.com/pet/banner3.jpg' />
          </SwiperItem>
        </Swiper>
        <AtNoticebar className="u-notice"  marquee icon='volume-plus' speed={50}>
          这是 NoticeBar 通告栏，这是 NoticeBar 通告栏，这是 NoticeBar 通告栏
        </AtNoticebar>
        <View className='u-title'>欢迎来到小黄兜宠物店～</View>
      </View>
    )
  }
}
