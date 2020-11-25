import Taro, { Component } from '@tarojs/taro';
import { View, Input, Text, Image, Button } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import { connect } from '@tarojs/redux';
import dayjs from 'dayjs';
import classnames from 'classnames';
import _ from '@/lib/lodash';
import StoreInfo from '@/components/StoreInfo';
import GImage from '@/components/GImage';
import Iconfont from '@/components/Iconfont';
import YcBanner from '@/components/YcBanner';

import apiHome from '@/api/home';
import { getPet } from '@/actions/pet';
import grewApi from '@/api/grew';
import './index.less';

@connect(({ pet, washService }) => ({
  pet,
  washService
}))
class PetGrew extends Component {
  config = {
    navigationBarTitleText: '寄养',
    usingComponents: {
      'van-calendar': '../../components/vant/dist/calendar/index'
    }
  };

  state = {
    petId: '',
    petItem: null,
    banners: [],
    startDate: undefined,
    endDate: undefined,
    showModal: false,
    showCalendar: false
  };

  componentWillMount() {
    apiHome
      .queryBanners()
      .then((res) => {
        this.setState({
          banners: res || []
        });
      })
      .catch((error) => {
        console.log('>>> queryBanners异常', error);
      });
  }

  componentDidShow() {
    getPet().then(() => {
      if (!this.state.petId) {
        this.setState({
          petId: _.get(this.props, 'pet.list[0].id', ''),
          petItem: _.get(this.props, 'pet.list[0]')
        });
      }
    });
  }

  goPet = () => {
    Taro.navigateTo({
      url: '/pages/pet/index'
    });
  };

  selectedPet = (petItem) => {
    this.setState({
      petId: petItem.id,
      petItem
    });
  };

  onStartDateChange = (event) => {
    const { value } = event.detail;
    this.setState({
      startDate: value
    });
  };

  onEndDateChange = (event) => {
    const { value } = event.detail;
    this.setState({
      endDate: value
    });
  };

  hanldeChange = (event) => {
    const { value } = event.detail;
    this.setState({
      remark: value
    });
  };

  handleSubmit = () => {
    const { startDate, endDate, petId, petItem, remark } = this.state;
    if (!petId) {
      return Taro.showToast({ title: '请选择宠物', icon: 'none' });
    }
    if (!startDate) {
      return Taro.showToast({ title: '请选择开始时间', icon: 'none' });
    }
    if (!endDate) {
      return Taro.showToast({ title: '请选择结束时间', icon: 'none' });
    }
    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      return Taro.showToast({ title: '开始时间不能早于结束时间', icon: 'none' });
    }
    if (dayjs(endDate).valueOf() - dayjs(startDate).valueOf() < 24 * 3600 * 1000) {
      return Taro.showToast({ title: '寄养时间最短选择1天', icon: 'none' });
    }

    const params = {
      petId: petId,
      petType: petItem.petType,
      startTime: startDate + ' 00:00:00',
      endTime: endDate + ' 23:59:00',
      remark: remark
    };

    grewApi.doGrew(params).then(() => {
      this.setState({
        showModal: true
      });
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false
    });
  };

  handleConfirm = (res) => {
    this.setState({
      startDate: dayjs(res.detail[0]).format('YYYY-MM-DD'),
      endDate: dayjs(res.detail[1]).format('YYYY-MM-DD'),
      showCalendar: false
    });
  };

  handleClose = () => {
    this.setState({
      showCalendar: false
    });
  };

  render() {
    const { pet } = this.props;
    const petList = _.get(pet, 'list', []);
    const { banners, petId, startDate, endDate, showModal, showCalendar } = this.state;

    const isActive = petId && startDate && endDate;
    return (
      <View className='u-petGrew'>
        <YcBanner banners={banners}></YcBanner>
        
        <View className='u-info'>
          <StoreInfo />
        </View>

        <View className='u-pet'>
          <View className='u-pet__list'>
            {petList.map((item) => (
              <View className='u-pet__item' key={item.id} onClick={this.selectedPet.bind(this, item)}>
                <View className='u-pet__avatar'>
                  <GImage my-class='u-pet__img' src={item.avatar} resize="200" />
                  {item.id == petId && (
                    <View className='u-pet__selected'>
                      <Image className='u-pet__selected-icon' src={require('../../images/selected.png')} />
                    </View>
                  )}
                </View>
                <View className='u-pet__name'>{item.petName}</View>
              </View>
            ))}

            <View className='u-pet__item' onClick={this.goPet}>
              <View className='u-pet__edit'>
                <Iconfont type='icongoujiaoyin' color='#ccc' size='24' />
              </View>
              <View className='u-pet__name text-hui'>管理宠物</View>
            </View>
          </View>
        </View>

        <View className='u-item px-2 mt-2 flex align-center justify-between'>
          <View>寄养时间</View>
          <View
            onClick={() => {
              this.setState({ showCalendar: true });
            }}
          >
            {startDate ? startDate + ' 至 ' + endDate : <Text className='text-hui'>请选择时间</Text>}
          </View>
        </View>

        <View className='u-item px-2 mt-2 flex align-center'>
          <View className='mr-2'>备注</View>
          <Input placeholder='添加备注' onChange={this.hanldeChange} />
        </View>

        <View className={classnames('u-submit', isActive ? '' : 'u-submit__disable')} onClick={this.handleSubmit}>
          提交
        </View>

        <van-calendar type='range' show={showCalendar} onConfirm={this.handleConfirm} onClose={this.handleClose} />

        <AtModal isOpened={showModal}>
          <AtModalHeader>寄养成功</AtModalHeader>
          <AtModalContent>
            <View className='text-center' style={{ color: '#666' }}>
              请自行前往店铺寄养， 可在宠物中心随时查看您的爱宠哦~
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeModal}>取消</Button>
            <Button onClick={this.closeModal}>好的</Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}

export default PetGrew;
