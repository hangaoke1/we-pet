import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import GImage from '@/components/GImage';
import shopApi from '@/api/shop';

import './index.less';

export default class OrderTrack extends Component {
  config = {
    navigationBarTitleText: '订单跟踪',
    backgroundColor: '#f3f4f8',
    usingComponents: {
      'van-steps': '../../components/vant/dist/steps/index'
    }
  };

  state = {
    logo: '',
    typename: '',
    steps: []
  };

  componentDidMount() {
    if (this.$router.params.deliveryNo) {
      this.queryLogistics();
    }
  }

  queryLogistics() {
    Taro.showLoading();
    shopApi
      .queryLogistics({
        deliveryNo: this.$router.params.deliveryNo
      })
      .then((res) => {
        this.setState({
          ...res,
          steps: res.list.map((v) => ({ text: v.status, desc: v.time }))
        });
        Taro.hideLoading();
      })
      .catch(() => {
        Taro.hideLoading();
      });
  }

  doCopy = (text) => {
    Taro.setClipboardData({
      data: text,
      success: () => {
        Taro.showToast({
          title: '已复制',
          icon: 'success'
        });
      }
    });
  };

  render() {
    const deliveryNo = this.$router.params.deliveryNo;
    const { steps, logo, typename } = this.state;
    return (
      <View className='u-orderTrack bg-page'>
        {deliveryNo ? (
          <View className='p-2 pb-5'>
            <View className='p-2 bg-bai mb-2'>
              <View className='flex align-center mb-2'>
                <View className='text-base'>运单号：</View>
                <View>{deliveryNo}</View>
                <Text className='font-s-24 ml-1 text-main' onClick={this.doCopy.bind(this, deliveryNo)}>
                  复制
                </Text>
              </View>
              <View className='flex align-center'>
                <View className='text-base'>国内承运人：</View>
                <GImage my-class='u-icon' src={logo} />
                <View>{typename}</View>
              </View>
            </View>
            {steps.length ? (
              <van-steps activeIcon="location" activeColor="#FF7013" direction='vertical' steps={steps} active={0} />
            ) : (
              <View className='u-empty'>
                <Image src={require('../../images/cart_empty.png')} />
                <View className='text-center font-s-32'>
                  <Text className='text-hui'>暂无物流信息</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View className='p-2 bg-page pb-5'>
            <View className='p-2 bg-bai mb-2'>
              <View className='flex align-center'>
                <View className='text-base'>国内承运人：</View>
                <View>商家配送</View>
              </View>
            </View>
            <View className='u-empty'>
              <Image src={require('../../images/cart_empty.png')} />
              <View className='text-center font-s-32'>
                <Text className='text-hui'>请耐心等待商家配送～</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
