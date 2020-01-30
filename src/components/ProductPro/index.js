import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import Iconfont from '@/components/Iconfont'

import './index.less'

class index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  render () {
    const prefixCls = 'u-productPro'

    return (
      <View className={prefixCls}>
        <Image className="u-img" src="http://img13.360buyimg.com/n2/s240x240_jfs/t1/106438/17/2049/174813/5dc99958Eeb00697e/a97ffb7f73ef994d.jpg!q70.jpg"></Image>
        <View className="u-name">小黄兜 三拼冻干 深海鱼宴地方阿迪舒服阿斯顿发阿斯顿发的撒风撒地方撒地方撒的是否</View>
        <View className="u-tag">
          <View className="u-tag__item">1月新品</View>
          <View className="u-tag__item">年夜饭套餐</View>
        </View>
        <View className="u-price">
          <Text>¥ 29.9</Text>
        </View>
        <View className="u-addcart">
          <Iconfont type="icongouwuche" color="#fff" size="14"></Iconfont>
        </View>
      </View>
    )
  }
}

export default index