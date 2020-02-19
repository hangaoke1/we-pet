import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Image, Block, OpenData, Text, Button } from '@tarojs/components'
import Iconfont from '@/components/Iconfont'
import gotoLogin from '@/lib/gotoLogin'
import { getUserInfo } from '@/actions/user'
import { getPet } from '@/actions/pet'
import { AtGrid, AtModal, AtModalContent, AtModalAction, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import shopApi from '@/api/shop'

import './index.less'

@connect(
  ({ user, pet }) => ({
    user,
    pet
  }),
  (dispatch) => ({})
)
class index extends Component {
  config = {
    navigationBarBackgroundColor: '#ffdb47',
    navigationBarTitleText: '个人中心'
  }

  state = {
    showModal: false,
    tobePaidCount: 0, // 待支付
    tobeShippedCount: 0, // 待发货
    deliveryCount: 0 // 待收货
  }

  componentWillMount () {}

  componentDidMount () {}

  componentDidShow () {
    if (this.props.user.isLogin) {
      getUserInfo()
      getPet()
      this.queryOrderCount()
    }
  }

  queryOrderCount = () => {
    shopApi.queryOrderCount().then((res) => {
      const { tobePaidCount, tobeShippedCount, deliveryCount } = res
      this.setState({
        tobePaidCount,
        tobeShippedCount,
        deliveryCount
      })
    })
  }
  login = () => {
    gotoLogin()
  }

  handleToolClick = (item) => {
    if (item.value === '联系客服') {
      this.setState({
        showModal: true
      })
    }
    if (item.value === '地址管理') {
      Taro.navigateTo({
        url: '/pages/address/index'
      })
    }
    if (item.value === '宠物监控') {
      Taro.navigateTo({
        url: '/pages/webview/index'
      })
    }
  }

  showContact = () => {
    this.setState({
      showModal: false
    })
    setTimeout(() => {
      Taro.showActionSheet({
        itemList: [ '拨打号码' ]
      })
    }, 300)
  }

  hideModal = () => {
    this.setState({
      showModal: false
    })
  }

  goPet = () => {
    Taro.navigateTo({
      url: '/pages/pet/index'
    })
  }

  goOrder = (current = 0) => {
    Taro.navigateTo({
      url: '/pages/order/index?current=' + current
    })
  }

  render () {
    const prefixCls = 'u-user'
    const { user, pet } = this.props
    const { showModal, tobePaidCount, tobeShippedCount, deliveryCount } = this.state
    const isLogin = user.isLogin
    const userInfo = user.userInfo
    return (
      <View className={prefixCls}>
        <View className='u-header'>
          <View className='u-top'>
            {isLogin ? (
              <OpenData className='u-avatar' type='userAvatarUrl' />
            ) : (
              <Image className='u-avatar' onClick={this.login} src={userInfo.wechatAvatar} lazyLoad webp />
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
            <View className='u-entry-item' onClick={this.goPet}>
              <View className='u-entry-count'>{pet.list.length}</View>
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
          <View className='u-order__title' onClick={this.goOrder.bind(this, 0)}>
            <View className='u-order__my'>我的订单</View>
            <View className='u-order__all'>
              <Text>全部订单</Text>
              <Iconfont type='iconarrowright' color='#ccc' size='12' />
            </View>
          </View>
          <View className='u-order__menu'>
            <View className='u-order__item' onClick={this.goOrder.bind(this, 1)}>
              <Iconfont type='icondaifukuan' color='#333' size='26' />
              <View className='u-order__name'>代付款</View>
              {tobePaidCount && <View className='u-order__count'>{tobePaidCount}</View>}
            </View>
            <View className='u-order__item' onClick={this.goOrder.bind(this, 2)}>
              <Iconfont type='icondaifahuo' color='#333' size='26' />
              <View className='u-order__name'>待发货</View>
              {tobeShippedCount && <View className='u-order__count'>{tobeShippedCount}</View>}
            </View>
            <View className='u-order__item' onClick={this.goOrder.bind(this, 3)}>
              <Iconfont type='icondaishouhuo' color='#333' size='26' />
              <View className='u-order__name'>待收货</View>
              {deliveryCount && <View className='u-order__count'>{deliveryCount}</View>}
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
            onClick={this.handleToolClick}
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
                value: '宠物监控'
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

        <AtModal isOpened={showModal}>
          <AtModalContent>
            <View className='u-kefu__title'>联系客服</View>
            <View className='u-kefu__mobile'>号码：4000088888</View>
            <View className='u-kefu__time'>时间：10:00 - 20:00</View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.hideModal}>取消</Button>
            <Button onClick={this.showContact}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default index
