import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import config from '@/config';
import GImage from '@/components/GImage';
import Iconfont from '@/components/Iconfont';
import grewApi from '@/api/grew';

import './list.less';

export default class PetList extends Component {
  config = {
    navigationBarTitleText: '寄养中'
  };

  state = {
    list: [],
    loading: false,
    finished: false
  };

  componentDidMount() {
    this.queryGrew()
  }

  queryGrew = () => {
    grewApi
      .queryGrew({
        pageNo: 1,
        pageSize: 999,
        petState: 0
      })
      .then((res) => {
        this.setState({
          finished: true
        });
      });
  };

  render() {
    const { list, finished } = this.state;
    const isEmpty = list.length === 0 && finished;
    return (
      <View className='u-petList bg-page pt-2'>
        {!isEmpty && (
          <View className='u-item p-2 bg-bai'>
            <View className='u-info flex align-center border-bottom-divider pb-2 mb-2'>
              <GImage my-class='u-image flex-0 mr-2' src={config.petAvatar} resize="200" />
              <View className='u-info__content flex-1'>
                <View className='u-info__top flex align-center justify-between mb-2'>
                  <View className='u-info__name font-s-32 flex align-center'>
                    <View className='mr-1'>小黑2</View>
                    <Iconfont type={0 == 0 ? 'icongong' : 'iconmu'} color={0 == 0 ? '#40a9ff' : '#ff7875'} size='14' />
                  </View>
                  <View className='u-info__date font-s-24'>2020-01-01 ~ 2020-01-05</View>
                </View>
                <View className='u-info__bottom flex align-center'>
                  <View className='u-petBreed mr-2'>田园猫</View>
                  <View className='text-hui font-s-24'>生日：2016-05-01</View>
                </View>
              </View>
            </View>
            <View className='u-mark font-s-24 text-hui'>请注意好好照顾哦～</View>
          </View>
        )}

        {isEmpty && (
          <View className='u-empty'>
            <GImage my-class='u-empty__img' src={require('../../images/cart_empty.png')} />
            <View className='text-center font-s-32'>
              <Text className='text-hui'>暂无寄养宠物～</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}
