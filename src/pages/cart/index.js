import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.less'

class index extends Component {

  config = {
    navigationBarTitleText: '购物车',
    backgroundTextStyle: 'dark',
    backgroundColor: '#f3f4f8'
  }

  componentWillMount () { }

  componentDidMount () { }

  render () {
    const prefixCls = 'u-cart'

    return (
      <View className={prefixCls}>
        <View className='u-header'>
          <View>购物车</View>
          <View>管理</View>
        </View>
      </View>
    )
  }
}

export default index