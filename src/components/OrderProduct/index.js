import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import Iconfont from '@/components/Iconfont'
import _ from '@/lib/lodash'

import './index.less'

class index extends Component {

  componentWillMount () {}

  componentDidMount () {}

  onClick = (e) => {
    this.props.onClick && this.props.onClick(e)
  }

  render () {
    const { item } = this.props
    let specs = _.get(item, 'productSku.specs', []).map((s) => s.name + '/' + s.value).join('/')
    return item ? (
      <View className='u-product__item' onClick={this.onClick}>
        <View className='u-product__img'>
          <Image src={item.productSku.skuImgUrl} lazyLoad webp />
        </View>
        <View className='u-product__info'>
          <View className='u-product__name'>{item.productSku.skuName}</View>
          <View className='u-product__specs'>{specs}</View>
        </View>
        <View className='u-product__right'>
          <View className='u-product__price'>¥ {item.productSku.price}</View>
          <View className='u-product__count'>
            <Iconfont type='iconshanchu' size='14' color='#ccc' /> {item.quantity}
          </View>
        </View>
      </View>
    ) : null
  }
}

export default index
