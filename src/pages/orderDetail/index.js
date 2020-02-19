import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.less'

class index extends Component {

  config = {
    navigationBarTitleText: '订单详情'
  }

  componentWillMount () { }

  componentDidMount () { }

  render () {

    return (
      <View className='u-orderDetail'>
        订单详情
      </View>
    )
  }
}

export default index