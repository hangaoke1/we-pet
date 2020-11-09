import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Image, Text } from '@tarojs/components';
import Iconfont from '@/components/Iconfont';
import makePhoneCall from '@/lib/makePhoneCall';

import './index.less';

@connect(({ store }) => ({
  store
}))
export default class StoreInfo extends Component {
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };
  static propTypes = {};
  static defaultProps = {};

  state = {};

  openLocation = () => {
    const { currentStore } = this.props.store;
    if (!currentStore) {
      return Taro.showToast({ title: '请选择门店', icon: 'none' })
    }
    Taro.openLocation({
      latitude: +currentStore.lat,
      longitude: +currentStore.lon,
      name: currentStore.storeName,
      address: currentStore.city + currentStore.area + currentStore.detail
    });
  };

  showContact = () => {
    const { store } = this.props;
    setTimeout(() => {
      makePhoneCall(store.currentStore.mobile);
    }, 300);
  };

  render() {
    let { currentStore, distance } = this.props.store;
    const address = currentStore ? currentStore.city + currentStore.area + currentStore.detail : '';
    let unit;
    if (distance > 1000) {
      distance = (distance / 1000).toFixed(1);
      unit = 'km';
    } else {
      unit = 'm';
    }
    return (
      <View className='u-store flex'>
        <Image className='u-store__logo flex-0' src={currentStore.logo} />
        <View className='flex-1'>
          <View className='font-s-32 text-base mb-2'>{currentStore.storeName}</View>
          <View className='font-s-24 text-base mb-2'>营业中 {currentStore.workTime}</View>
          <View className='flex'>
            <View className='flex-0 mr-1'>
              <Iconfont type='iconshoujian' size={16} color='#999999' />
            </View>
            <View className='flex-1' onClick={this.openLocation}>
              <View className='font-s-24 text-base mb-1'>{address}</View>
              <View className='font-s-24 text-hui'>
                <Text>据您</Text>
                <Text className='f-number mx-1'>{distance}</Text>
                <Text>{unit}</Text>
              </View>
            </View>
            <View className='flex-0 flex flex-column align-center mr-2' onClick={this.showContact}>
              <Iconfont type='icondianhua1' color='#FF7013' size='20' />
              <View className='font-s-2 text-hui'>电话</View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
