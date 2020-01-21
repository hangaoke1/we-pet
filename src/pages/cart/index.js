import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.less'

class index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  render () {
    const prefixCls = 'ehome-index'

    return (
      <View className={prefixCls}>
        购物车
      </View>
    )
  }
}

export default index