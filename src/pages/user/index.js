/* eslint-disable react/no-unused-state */
/* eslint-disable import/no-commonjs */
import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Image, OpenData, Text, Button, Block } from '@tarojs/components';
import Iconfont from '@/components/Iconfont';
import YcLogin from '@/components/YcLogin';
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

@connect(({ user, pet, store }) => ({
  user,
  pet,
  store
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
    const { store } = this.props;
    return {
      title: store.currentStore.storeName,
      path: '/pages/index/index',
      imageUrl: store.currentStore.logo
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
        const { tobePaidCount, tobeShippedCount, deliveryCount, warrantyCount } = res;
        this.setState({
          tobePaidCount,
          tobeShippedCount,
          deliveryCount,
          warrantyCount
        });
      })
      .catch(() => {
        this.setState({
          tobePaidCount: 0,
          tobeShippedCount: 0,
          deliveryCount: 0,
          warrantyCount: 0
        });
      });
  };

  login = () => {
    if (!this.props.user.isLogin) {
      gotoLogin();
    }
  };

  navigateToWithLogin = (url) => {
    if (!this.props.user.isLogin) {
      return gotoLogin();
    }
    Taro.navigateTo({
      url
    });
  };

  handleToolClick = (item) => {
    if (item.value === '宠物信息') {
      this.navigateToWithLogin('/pages/pet/index');
    }
    if (item.value === '我的预约') {
      this.navigateToWithLogin('/pages/storeOrder/index');
    }
    if (item.value === '地址管理') {
      this.navigateToWithLogin('/pages/address/index');
    }
    if (item.value === '宠物监控') {
      this.navigateToWithLogin('/pages/device/index');
    }
    if (item.value === '红包卡券') {
      this.navigateToWithLogin('/pages/couponList/index');
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
    const { store } = this.props;
    setTimeout(() => {
      makePhoneCall(store.currentStore.mobile);
    }, 300);
  };

  hideModal = () => {
    this.setState({
      showModal: false
    });
  };

  goOrder = (current = 0) => {
    if (!this.props.user.isLogin) {
      return gotoLogin();
    }
    if (current === 4) {
      Taro.navigateTo({
        url: '/pages/refundOrder/index?current=' + 0
      });
    } else {
      Taro.navigateTo({
        url: '/pages/order/index?current=' + current
      });
    }
  };

  goStoreOrder = () => {
    if (!this.props.user.isLogin) {
      return gotoLogin();
    }
    Taro.navigateTo({
      url: '/pages/storeOrder/index?current=' + 0
    });
  };

  addPet = () => {
    Taro.navigateTo({
      url: '/pages/petDetail/index'
    });
  };

  goPet = (item) => {
    Taro.setStorageSync('pet_update', item);
    Taro.navigateTo({
      url: '/pages/petDetail/index?id=' + item.id
    });
  };

  logout = () => {
    token.clear();
    this.init();
  };

  render() {
    const prefixCls = 'u-user';
    const { user, pet, store } = this.props;
    const { showModal, tobePaidCount, tobeShippedCount, deliveryCount, warrantyCount } = this.state;
    const isLogin = user.isLogin;
    const userInfo = user.userInfo;
    return (
      <View className={prefixCls}>
        <View className='u-header' />

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
                {tobePaidCount && <View className='u-order__count f-number'>{tobePaidCount}</View>}
              </View>
              <View className='u-order__item' onClick={this.goOrder.bind(this, 2)}>
                <Image src={require('../../images/user/b.png')} />
                <View className='u-order__name'>待发货</View>
                {tobeShippedCount && <View className='u-order__count f-number'>{tobeShippedCount}</View>}
              </View>
              <View className='u-order__item' onClick={this.goOrder.bind(this, 3)}>
                <Image src={require('../../images/user/c.png')} />
                <View className='u-order__name'>待收货</View>
                {deliveryCount && <View className='u-order__count f-number'>{deliveryCount}</View>}
              </View>
              <View className='u-order__item' onClick={this.goOrder.bind(this, 4)}>
                <Image src={require('../../images/user/d.png')} />
                <View className='u-order__name'>退款/售后</View>
                {warrantyCount && <View className='u-order__count f-number'>{warrantyCount}</View>}
              </View>
            </View>

            <View className='u-order__all text-hui' onClick={this.goOrder.bind(this, 0)}>
              <Text>全部订单</Text>
              <Iconfont type='iconarrowright' color='#999' size='12' />
            </View>
          </View>
        </View>

        <YcLogin renderError={<Block />}>
          <View className='u-content'>
            <View className='u-pet'>
              <View className='flex align-center py-2 pr-5'>
                <View className='u-pet__add flex-0 flex align-center justify-center mr-2' onClick={this.addPet}>
                  <Iconfont type='iconadd' color='#fff' size='24' />
                </View>
                {pet.list.map((p) => {
                  return (
                    <View className='u-pet__item p-2 flex flex-0 mr-2' key={p.id} onClick={this.goPet.bind(this, p)}>
                      <Image className='u-pet__image mr-2' src={p.avatar || config.petAvatar} />
                      <View>
                        <View className='font-s-28 mb-1 flex align-center justify-between'>
                          <Text>{p.petName}</Text>
                          {p.placed === 1 && <View className='u-pet__placed'>待确认</View>}
                          {p.placed === 2 && <View className='u-pet__placed'>寄养中</View>}
                        </View>
                        <View className='flex align-center'>
                          {p && p.sex == 0 ? (
                            <Iconfont type='icongong' color='#2F6BFE' size='14' />
                          ) : (
                            <Iconfont type='iconmu' color='pink' size='14' />
                          )}
                          <Text className='text-hui font-s-24 ml-1 ellipsis-1'>{p.petBreed}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

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

            <View className='u-logout'>
              <Button type='warn' onClick={this.logout}>
                退出登录
              </Button>
            </View>
          </View>
        </YcLogin>

        <AtModal isOpened={showModal}>
          <AtModalContent>
            <View className='u-kefu__title'>联系客服</View>
            <View className='u-kefu__mobile'>号码：{store.currentStore.mobile}</View>
            <View className='u-kefu__time'>时间：{store.currentStore.workTime}</View>
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
