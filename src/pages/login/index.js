import Taro, { Component } from '@tarojs/taro'
import { View, Text, OpenData } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import apiUser from '@/api/user'
import token from '@/lib/token'
import _ from '@/lib/lodash'

import './index.less'

class index extends Component {

  config = {
    navigationBarTitleText: '快速登录'
  }

  state = {}

  componentWillMount () { }

  componentDidMount () { }

  componentDidShow () {}

  getUserInfo = (e) => {
    console.log('>>> 用户信息', e.detail.userInfo)
    Taro.login().then(res => {
      const wechatCode = res.code
      apiUser.login({
        wechatCode,
        userInfo: e.detail.userInfo
      }).then(data => {
        token.set(_.get(data, 'result', ''))
        Taro.navigateBack()
      }).catch(error => {
        console.log('>>> 接口请求异常', error)
        Taro.showToast({
          title: error.message || '登录异常',
          icon: 'none'
        })
      })
    })
  }

  back = () => {
    Taro.navigateBack()
  }

  otherLogin = () => {
    Taro.showToast({
      title: '暂不支持',
      icon: 'none'
    })
  }

  render () {
    const prefixCls = 'u-login'

    return (
      <View className={prefixCls}>
        <OpenData className="u-logo" type="userAvatarUrl"></OpenData>
        <View className="u-tip">登录后即注册为小黄兜会员</View>
        <AtButton className='u-login-wechat' type='primary' openType='getUserInfo' onGetUserInfo={this.getUserInfo}>
          微信一键登录
        </AtButton>
        <AtButton className='u-login-other' onClick={this.otherLogin}>
          账号密码登录
        </AtButton>
        <View className="u-back">
          <Text onClick={this.back}>暂不登录</Text>
        </View>
      </View>
    )
  }
}

export default index
