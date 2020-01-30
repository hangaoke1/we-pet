import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Image, Block, OpenData, Text } from '@tarojs/components'
import Iconfont from '@/components/Iconfont'
import gotoLogin from '@/lib/gotoLogin'
import { getUserInfo } from '@/actions/user'
import { AtGrid } from 'taro-ui'

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
              <Image className='u-avatar' onClick={this.login} src={userInfo.wechatAvatar} />
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
              <View className='u-entry-count'>0</View>
              <View className='u-entry-name'>宠物信息</View>
            </View>
            <View className='u-entry-item'>
              <View className='u-entry-count'>0</View>
              <View className='u-entry-name'>我的卡次</View>
            </View>
            <View className='u-entry-item'>
              <View className='u-entry-count'>0</View>
              <View className='u-entry-name'>我的预约</View>
            </View>
          </View>
        </View>

        <View className='u-assets'>
          <View className='u-assets__title'>
            <View className='u-assets__my'>我的资产</View>
            <View className='u-assets__all'>
              <Text>全部资产</Text>
              <Iconfont type='iconarrowright' color='#ccc' size='12' />
            </View>
          </View>

          <View className='u-assets__menu'>
            <View className='u-assets__item'>
              <View className='u-assets__price'>0</View>
              <View>我的余额</View>
            </View>
            <View className='u-assets__item'>
              <View className='u-assets__price'>0</View>
              <View>积分</View>
            </View>
            <View className='u-assets__item'>
              <View className='u-assets__price'>0</View>
              <View>优惠券</View>
            </View>
            <View className='u-assets__item'>
              <View className='u-assets__price'>0</View>
              <View>健康权益卡</View>
            </View>
          </View>
        </View>

        <View className='u-order'>
          <View className='u-order__title'>
            <View className='u-order__my'>我的订单</View>
            <View className='u-order__all'>
              <Text>全部订单</Text>
              <Iconfont type='iconarrowright' color='#ccc' size='12' />
            </View>
          </View>
          <View className='u-order__menu'>
            <View className='u-order__item'>
              <Iconfont type='icondaifukuan' color='#333' size='26' />
              <View className='u-order__name'>代付款</View>
            </View>
            <View className='u-order__item'>
              <Iconfont type='icondaifahuo' color='#333' size='26' />
              <View className='u-order__name'>代发货</View>
            </View>
            <View className='u-order__item'>
              <Iconfont type='icondaishouhuo' color='#333' size='26' />
              <View className='u-order__name'>待收货</View>
            </View>
          </View>
        </View>

        <View className='u-tool'>
          <View className='u-tool__title'>
            <View className='u-tool__my'>常用工具</View>
          </View>

          <AtGrid
            mode='rect'
            hasBorder={false}
            data={[
              {
                image:
                  'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                value: '服务订单'
              },
              {
                image:
                  'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                value: '门店订单'
              },
              {
                image:
                  'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
                value: '地址管理'
              },
              {
                image:
                  'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
                value: '领券中心'
              },
              {
                image:
                  'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                value: '联系客服'
              },
              {
                image:
                  'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
                value: '敬请期待'
              }
            ]}
          />
        </View>
      </View>
    )
  }
}

export default index
