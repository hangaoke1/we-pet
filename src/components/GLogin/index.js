import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import gotoLogin from '@/lib/gotoLogin'
import config from '@/config'

import './index.less'

class GLogin extends Component {

  gotoLogin = () => {
    gotoLogin()
  }

  render () {
    return (
      <View className='u-login'>
        <View className='u-content'>
          <Image className='u-img' src={config.petAvatar} />
          <View className='u-tip'>请您先进行登录</View>
          <View className='u-action' onClick={this.gotoLogin}>立即登录</View>
        </View>
      </View>
    )
  }
}

export default GLogin
