import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Image, Block, OpenData } from '@tarojs/components'
import gotoLogin from '@/lib/gotoLogin'
import { getUserInfo } from '@/actions/user'

import './index.less'

@connect(
  ({ user }) => ({
    user
  }),
  (dispatch) => ({})
)
class index extends Component {
  config = {
    navigationBarBackgroundColor: '#ffdb47',
    navigationBarTitleText: '个人中心'
  }

  componentWillMount () {}

  componentDidMount () {}

  componentDidShow () {
    if (this.props.user.isLogin) {
      getUserInfo()
    }
  }

  login = () => {
    gotoLogin()
  }

  render () {
    const prefixCls = 'u-user'
    const { user } = this.props
    const isLogin = user.isLogin
    const userInfo = user.userInfo
    return (
      <View className={prefixCls}>
        <View className='u-header'>
          <View className='u-top'>
            {isLogin ? (
              <OpenData className='u-avatar' type='userAvatarUrl' />
            ) : (
              <Image
                className='u-avatar'
                onClick={this.login}
                src={userInfo.wechatAvatar}
              />
            )}
            <View className='u-info'>
              {isLogin ? (
                <Block>
                  <View className='u-name'>{userInfo.nickName}</View>
                  <View className='u-edit'>查看编辑个人信息</View>
                </Block>
              ) : (
                <View className='u-login' onClick={this.login}>
                  登录/注册
                </View>
              )}
            </View>
          </View>
          <View className='u-entry'>
            <View className='u-entry-item'>
              <View className="u-entry-count">0</View>
              <View className="u-entry-name">宠物信息</View>
            </View>
            <View className='u-entry-item'>
              <View className="u-entry-count">0</View>
              <View className="u-entry-name">我的卡次</View>
            </View>
            <View className='u-entry-item'>
              <View className="u-entry-count">0</View>
              <View className="u-entry-name">我的预约</View>
            </View>
          </View>
        </View>

        <View className="u-assets">
          <View className="u-assets__title">
            <View className="u-assets__my">我的资产</View>
            <View className="u-assets__all">全部资产</View>
          </View>
        </View>
      </View>
    )
  }
}

export default index
