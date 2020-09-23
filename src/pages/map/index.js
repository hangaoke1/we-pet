import Taro, { Component } from '@tarojs/taro'
import { View, Map } from '@tarojs/components'

import './index.less'

class index extends Component {

  config = {
    navigationBarTitleText: '门店地址'
  }

  componentWillMount () { }

  componentDidMount () { }

  render () {
    return (
      <View className='u-map'>
        <Map className='u-map__content'></Map>
      </View>
    )
  }
}

export default index