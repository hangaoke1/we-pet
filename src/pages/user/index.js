/* eslint-disable import/no-commonjs */
import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Image, Block, OpenData, Text, Button, ScrollView } from '@tarojs/components';
import Iconfont from '@/components/Iconfont';
import gotoLogin from '@/lib/gotoLogin';
import { getUserInfo } from '@/actions/user';
import { getPet } from '@/actions/pet';
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui';
import shopApi from '@/api/shop';
import storeApi from '@/api/store';
import config from '@/config';
import makePhoneCall from '@/lib/makePhoneCall';
import token from '@/lib/token';

import './index.less';

const actionList = [
  {
    image: require('../../images/user/chongwu.png'),
    value: '宠物信息'
  },
  {
    image: require('../../images/user/yuyue.png'),
    value: '我的预约'
  },
  {
    image: require('../../images/user/dizhi.png'),
    value: '地址管理'
  },
  {
    image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
    value: '宠物监控'
  },
  {
    image: require('../../images/user/youhuiquan.png'),
    value: '红包卡券'
  },
  {
    image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
    value: '联系客服'
  }
];

@connect(({ user, pet }) => ({
  user,
  pet
}))
class UserPage extends Component {
  config = {
    navigationBarBackgroundColor: '#FF7013',
    navigationBarTitleText: '个人中心',
    navigationStyle: 'custom'
  };

  state = {
    showModal: false,
    storeOrderCount: 0,
    tobePaidCount: 0, // 待支付
    tobeShippedCount: 0, // 待发货
    deliveryCount: 0 // 待收货
  };

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: '有宠宠物生活馆',
      path: '/pages/index/index',
      imageUrl: config.shareIcon
    };
  }

  componentDidShow() {
    if (this.props.user.isLogin) {
      this.init();
    }
  }
  init = () => {
    getUserInfo();
    getPet();
    this.queryStoreOrderCount();
    this.queryOrderCount();
  };

  queryStoreOrderCount = () => {
    storeApi
      .queryMyReserveWash({
        reserveOrderStatus: 100,
        pageSize: 1,
        pageNo: 1
      })
      .then((res) => {
        this.setState({
          storeOrderCount: res.totalCount
        });
      })
      .catch(() => {
        this.setState({
          storeOrderCount: 0
        });
      });
  };

  queryOrderCount = () => {
    shopApi
      .queryOrderCount()
      .then((res) => {
        const { tobePaidCount, tobeShippedCount, deliveryCount } = res;
        this.setState({
          tobePaidCount,
          tobeShippedCount,
          deliveryCount
        });
      })
      .catch(() => {
        this.setState({
          tobePaidCount: 0,
          tobeShippedCount: 0,
          deliveryCount: 0
        });
      });
  };

  login = () => {
    if (!this.props.user.isLogin) {
      gotoLogin();
    }
  };

  handleToolClick = (item) => {
    if (item.value === '宠物信息') {
      return this.goPet();
    }
    if (item.value === '我的预约') {
      if (!this.props.user.isLogin) {
        return gotoLogin();
      }
      Taro.navigateTo({
        url: '/pages/storeOrder/index'
      });
    }
    if (item.value === '地址管理') {
      if (!this.props.user.isLogin) {
        return gotoLogin();
      }
      Taro.navigateTo({
        url: '/pages/address/index'
      });
    }
    if (item.value === '宠物监控') {
      if (!this.props.user.isLogin) {
        return gotoLogin();
      }
      Taro.navigateTo({
        url: '/pages/device/index'
      });
    }
    if (item.value === '联系客服') {
      this.setState({
        showModal: true
      });
    }
  };

  showContact = () => {
    this.setState({
      showModal: false
    });
    setTimeout(() => {
      makePhoneCall(config.tel);
    }, 300);
  };

  hideModal = () => {
    this.setState({
      showModal: false
    });
  };

  goPet = () => {
    if (!this.props.user.isLogin) {
      return gotoLogin();
    }
    Taro.navigateTo({
      url: '/pages/pet/index'
    });
  };

  goOrder = (current = 0) => {
    if (!this.props.user.isLogin) {
      return gotoLogin();
    }
    Taro.navigateTo({
      url: '/pages/order/index?current=' + current
    });
  };

  goStoreOrder = () => {
    if (!this.props.user.isLogin) {
      return gotoLogin();
    }
    Taro.navigateTo({
      url: '/pages/storeOrder/index?current=' + 0
    });
  };

  logout = () => {
    token.clear();
    this.init();
  };

  render() {
    const prefixCls = 'u-user';
    const { user, pet } = this.props;
    const { showModal, tobePaidCount, tobeShippedCount, deliveryCount, storeOrderCount } = this.state;
    const isLogin = user.isLogin;
    const userInfo = user.userInfo;
    return (
      <View className={prefixCls}>
        <View className='u-header'></View>

        <View className='u-header__content'>
          <View className='flex flex-column align-center justify-center mb-4' onClick={this.login}>
            <OpenData className='u-avatar' type='userAvatarUrl' />
            {isLogin ? (
              <View className='mt-2 text-center font-s-32 font-weight-bold'>{userInfo.nickName}</View>
            ) : (
              <View className='mt-2 text-center font-s-32 font-weight-bold'>登录/注册</View>
            )}
          </View>
          <View className='u-order'>
            <View className='u-order__menu mb-3'>
              <View className='u-order__item' onClick={this.goOrder.bind(this, 1)}>
                <Image src={require('../../images/user/a.png')} />
                <View className='u-order__name'>待付款</View>
                {tobePaidCount && <View className='u-order__count'>{tobePaidCount}</View>}
              </View>
              <View className='u-order__item' onClick={this.goOrder.bind(this, 2)}>
                <Image src={require('../../images/user/b.png')} />
                <View className='u-order__name'>待发货</View>
                {tobeShippedCount && <View className='u-order__count'>{tobeShippedCount}</View>}
              </View>
              <View className='u-order__item' onClick={this.goOrder.bind(this, 3)}>
                <Image src={require('../../images/user/c.png')} />
                <View className='u-order__name'>待收货</View>
                {deliveryCount && <View className='u-order__count'>{deliveryCount}</View>}
              </View>
              <View className='u-order__item' onClick={this.goOrder.bind(this, 4)}>
                <Image src={require('../../images/user/d.png')} />
                <View className='u-order__name'>退款/售后</View>
                {deliveryCount && <View className='u-order__count'>{deliveryCount}</View>}
              </View>
            </View>

            <View className='u-order__all text-hui' onClick={this.goOrder.bind(this, 0)}>
              <Text>全部订单</Text>
              <Iconfont type='iconarrowright' color='#999' size='12' />
            </View>
          </View>
        </View>

        <View className='u-content'>
          <ScrollView scrollX enhanced showScrollbar={false} className='u-pet'>
            <View className='flex align-center py-2'>
              <View className='u-pet__item p-2 flex flex-0 mr-2'>
                <Image className='u-pet__image mr-2' src={config.petAvatar} />
                <View>
                  <View className='font-s-28 mb-1'>小黑</View>
                  <View className='flex align-center'>
                    <Iconfont type='iconmu' color='pink' size='14' />
                    <Text className='text-hui font-s-24 ml-1 ellipsis-1'>阿里斯顿奋斗史发</Text>
                  </View>
                </View>
              </View>
              <View className='u-pet__item p-2 flex flex-0 mr-2'>
                <Image className='u-pet__image mr-2' src={config.petAvatar} />
                <View>
                  <View className='font-s-28 mb-1'>小黑</View>
                  <View className='flex align-center'>
                    <Iconfont type='iconmu' color='pink' size='14' />
                    <Text className='text-hui font-s-24 ml-1 ellipsis-1'>阿里斯顿奋斗史发</Text>
                  </View>
                </View>
              </View>
              <View className='u-pet__item p-2 flex flex-0 mr-2'>
                <Image className='u-pet__image mr-2' src={config.petAvatar} />
                <View>
                  <View className='font-s-28 mb-1'>小黑</View>
                  <View className='flex align-center'>
                    <Iconfont type='iconmu' color='pink' size='14' />
                    <Text className='text-hui font-s-24 ml-1 ellipsis-1'>阿里斯顿奋斗史发</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          <View className='u-tool'>
            <View className='u-action flex flex-wrap pt-5'>
              {actionList.map((action) => {
                return (
                  <View
                    className='flex flex-column align-center justify-center mb-5'
                    style={{ width: '33.3%' }}
                    key={action.value}
                    onClick={this.handleToolClick.bind(this, action)}
                  >
                    <Image className='u-action__icon mb-2' src={action.image} />
                    <View>{action.value}</View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* {isLogin && (
            <View className='u-logout'>
              <Button type='warn' onClick={this.logout}>
                退出登录
              </Button>
            </View>
          )} */}
        </View>

        <AtModal isOpened={showModal}>
          <AtModalContent>
            <View className='u-kefu__title'>联系客服</View>
            <View className='u-kefu__mobile'>号码：{config.tel}</View>
            <View className='u-kefu__time'>时间：10:00 - 20:00</View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.hideModal}>取消</Button>
            <Button onClick={this.showContact}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}

export default UserPage;
