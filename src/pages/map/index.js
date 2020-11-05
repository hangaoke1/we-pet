import Taro, { Component } from '@tarojs/taro'
import { View, Map } from '@tarojs/components'

import './index.less'

class MapPage extends Component {

  config = {
    navigationBarTitleText: '门店地址'
  }

  render () {
    return (
      <View className='u-map'>
        <Map className='u-map__content'></Map>
      </View>
    )
  }
}

export default MapPage