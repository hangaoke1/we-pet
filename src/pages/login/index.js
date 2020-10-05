import Taro, { Component } from '@tarojs/taro';
import { View, Text, OpenData } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import apiUser from '@/api/user';
import token from '@/lib/token';
import _ from '@/lib/lodash';

import './index.less';

class Login extends Component {
  config = {
    navigationBarTitleText: '快速登录'
  };

  state = {};

  componentWillMount() {
    Taro.login().then((res) => {
      this.wechatCode = res.code;
    });
  }

  getUserInfoNative = (phoneData) => {
    Taro.getUserInfo().then((res) => {
      const userInfo = res.userInfo;
      this.getUserInfo(userInfo, phoneData);
    });
  };

  getUserInfo = (userInfo, phoneData) => {
    const params = {
      wechatCode: this.wechatCode,
      userInfo,
      phoneData
    }
    console.log('>>> 参数', params);
    apiUser
      .login(params)
      .then((data) => {
        token.set(data || '');
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
    this.getUserInfoNative(res.detail);
  };

  render() {
    const prefixCls = 'u-login';

    return (
      <View className={prefixCls}>
        <OpenData className='u-logo' type='userAvatarUrl' />
        <View className='u-tip'>登录后即注册为有宠会员</View>
        <AtButton
          className='u-login-wechat'
          type='primary'
          openType='getPhoneNumber'
          onGetPhoneNumber={this.onGetPhoneNumber}
        >
          微信一键登录
        </AtButton>
        <AtButton className='u-login-other' onClick={this.otherLogin}>
          账号密码登录
        </AtButton>
        <View className='u-back'>
          <Text onClick={this.back}>暂不登录</Text>
        </View>
      </View>
    );
  }
}

export default Login;
