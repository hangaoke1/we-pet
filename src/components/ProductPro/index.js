import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import Iconfont from '@/components/Iconfont'
import shopApi from '@/api/shop'
import { getCart } from '@/actions/cart'

import './index.less'

class index extends Component {
  componentWillMount () {}

  componentDidMount () {}

  goProduct = () => {
    const { item } = this.props
    Taro.navigateTo({
      url: `/pages/product/index?productId=${item.productId}&skuId=${item.id}`
    })
  }

  addCart = (e) => {
    e.stopPropagation()
    const { item } = this.props
    Taro.showLoading({
      title: '加载中'
    })
    shopApi
      .addShoppingCart({
        skuId: item.id,
        quantity: 1
      }).then(res => {
        Taro.hideLoading()
        Taro.showToast({
          title: '添加成功',
          icon: 'success'
        })
        getCart()
      }).catch(err => {
        Taro.hideLoading()
        Taro.showToast({
          title: '添加失败',
          icon: 'none'
        })
      })
  }

  render () {
    const prefixCls = 'u-productPro'
    const { item } = this.props

    return (
      <View className={prefixCls} onClick={this.goProduct}>
        <Image className='u-img' src={item.skuImgUrl} webp lazyLoad />
        <View className='u-name'>{item.skuName}</View>
        <View className="u-tag">
          {/* <View className="u-tag__item">1月新品</View>
          <View className="u-tag__item">年夜饭套餐</View> */}
        </View>
        <View className='u-price'>
          <Text>¥ {item.price}</Text>
        </View>
        <View className='u-addcart' onClick={this.addCart}>
          <Iconfont type='icongouwuche' color='#fff' size='14' />
        </View>
      </View>
    )
  }
}

index.propTypes = {
  item: PropTypes.object
}

index.defaultProps = {}

export default index
