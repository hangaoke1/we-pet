import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import config from '@/config'
import statusColor from '@/lib/statusColor'
import statusText from '@/lib/statusText'
import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () {}

  componentDidMount () {}

  render () {

    return (
      <View className='u-orderItem'>
        <View className='u-header'>
          <Image className='u-logo' src={config.petAvatar} lazyLoad webp />
          <View className='u-info'>
            <View className='u-info__label'>服务订单</View>
            <View className='u-info__date'>2020-01-01 10:00:00</View>
          </View>
          <View
            className='u-status'
            style={{
              color: statusColor[100]
            }}
          >
            {statusText[100]}
          </View>
        </View>
        <View className='u-product__item' onClick={this.goDetail}>
          <View className='u-product__img'>
            <Image src={config.petAvatar} lazyLoad webp />
          </View>
          <View className='u-product__info'>
            <View className='u-product__name'>洗澡</View>
            <View className='u-product__specs'>小哈</View>
          </View>
          <View className='u-product__right'>
            <View className='u-product__price'>¥ 100</View>
          </View>
        </View>
        <View className='u-total' onClick={this.goDetail}>
          共1件商品 合计： ¥ 100.00
        </View>
      </View>
    )
  }
}

index.defaultProps = {}

index.propTypes = {}

export default index
