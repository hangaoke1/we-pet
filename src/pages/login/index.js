import Taro, { Component } from '@tarojs/taro';
import { View, Text, OpenData, Button } from '@tarojs/components';
import { AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import apiUser from '@/api/user';
import token from '@/lib/token';
import eventBus from '@/lib/eventBus';

import './index.less';

class Login extends Component {
  config = {
    navigationBarTitleText: '快速登录'
  };

  state = {
    phoneData: null
  };

  componentWillMount() {
    Taro.login().then((res) => {
      this.wechatCode = res.code;
    });
  }

  getUserInfoNative = () => {
    Taro.getUserInfo().then((res) => {
      const userInfo = res.userInfo;
      this.getUserInfo(userInfo, this.state.phoneData);
    });
  };

  getUserInfo = (userInfo, phoneData) => {
    const params = {
      wechatCode: this.wechatCode,
      userInfo,
      phoneData
    };
    console.log('>>> 登录参数', params);
    apiUser
      .login(params)
      .then((data) => {
        console.log('>>> 登录结果', params);
        token.set(data || '');
        eventBus.$emit('login')
        Taro.navigateBack();
      })
      .catch((error) => {
        console.log('>>> 接口请求异常', error);
        Taro.showToast({
          title: error.message || '登录异常',
          icon: 'none'
        });
      });
  };

  back = () => {
    Taro.navigateBack();
  };

  otherLogin = () => {
    Taro.showToast({
      title: '暂不支持',
      icon: 'none'
    });
  };

  onGetPhoneNumber = (res) => {
    if (res.detail.errMsg.indexOf('fail') > -1) {
      return;
    }
    const phoneData = res.detail;
    Taro.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          console.log('>>> 用户未经授权');
          this.setState({
            phoneData,
            isOpened: true
          });
        } else {
          console.log('>>> 用户已经授权');
          this.setState(
            {
              phoneData
            },
            () => {
              this.getUserInfoNative();
            }
          );
        }
      }
    });
  };

  onGetUserInfo = (res) => {
    if (res && res.detail.errMsg.indexOf('fail') > -1) {
      return;
    }
    this.getUserInfoNative(this.state.phoneData);
  };

  render() {
    const prefixCls = 'u-login';
    const { isOpened } = this.state;

    return (
      <View className={prefixCls}>
        <View className='u-card animated fadeIn faster delay-300ms'>
          <OpenData className='u-logo' type='userAvatarUrl' />
          <View className='u-title'>宠小二</View>
          <View className='u-tip'>获取你的公开信息（昵称、头像等）</View>
          <AtButton
            className='u-login-wechat'
            type='primary'
            openType='getPhoneNumber'
            onGetPhoneNumber={this.onGetPhoneNumber}
          >
            授权登录
          </AtButton>
        </View>

        <View className='u-back'>
          <Text onClick={this.back}>暂不登录</Text>
        </View>
        <View className='u-mark'>
          点击“微信授权登录”按钮代表你已同意<Text className='u-service'>《用户服务协议》</Text>
        </View>

        <AtModal isOpened={isOpened}>
          <AtModalHeader>温馨提示</AtModalHeader>
          <AtModalContent>
            <View className='text-center'>欢迎使用宠物线上服务</View>
          </AtModalContent>
          <AtModalAction>
            <Button openType='getUserInfo' onGetUserInfo={this.onGetUserInfo}>
              立即体验
            </Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}

export default Login;
