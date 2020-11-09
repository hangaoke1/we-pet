import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text, Picker, Image } from '@tarojs/components';
import GTitle from '@/components/GTitle';
import Iconfont from '@/components/Iconfont';
import StoreInfo from '@/components/StoreInfo';
import GImage from '@/components/GImage';
import apiHome from '@/api/home';
import _ from '@/lib/lodash';
import dayjs from 'dayjs';
import { getPet } from '@/actions/pet';
import { getWashList } from '@/actions/washService';
import YcSubmitbar from '@/components/YcSubmitbar';
import YcBanner from '@/components/YcBanner';

import { timeMap } from '@/enums';

import './index.less';

function genDate(){
  const arr = [
    dayjs(),
    dayjs().add(1, 'day'),
    dayjs().add(2, 'day'),
    dayjs().add(3, 'day'),
    dayjs().add(4, 'day'),
    dayjs().add(5, 'day'),
    dayjs().add(6, 'day')
  ];
  const weekMap = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六'
  };
  const newArray = arr.map((item, index) => {
    return {
      id: index,
      date: item.format('MM/DD'),
      week: index === 0 ? '今日' : weekMap[item.day()],
      value: item.format('YYYY-MM-DD')
    };
  });
  return newArray;
}

@connect(({ pet, washService }) => ({
  pet,
  washService
}))
class SubScribe extends Component {
  config = {
    navigationBarTitleText: '预约洗护',
    usingComponents: {
      'van-icon': '../../components/vant/dist/icon/index',
      'van-row': '../../components/vant/dist/row/index',
      'van-col': '../../components/vant/dist/col/index',
      'van-image': '../../components/vant/dist/image/index'
    }
  };

  state = {
    storeId: 1,
    petId: '', // 宠物选择
    service: [], // 服务选择
    date: '', // 日期
    time: '', // 时间
    banners: [],
    dateList: genDate(),
    listAmToday: [],
    listPmToday: [],
    isDisableAm: false,
    isDisablePm: false
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
    Taro.setStorageSync('subscribe_service', []);
    getWashList();
  }

  componentDidMount() {
    const now = dayjs();
    const hourNow = now.hour();
    const isDisableAm = hourNow >= 12;
    const isDisablePm = hourNow >= 20;
    const listAmToday = timeMap.am.filter((v) => {
      const t = dayjs().format('YYYY-MM-DD ') + v.slice(0, 5);
      return dayjs(t).isAfter(now);
    });
    const listPmToday = timeMap.pm.filter((v) => {
      const t = dayjs().format('YYYY-MM-DD ') + v.slice(0, 5);
      return dayjs(t).isAfter(now);
    });
    this.setState({
      isDisableAm,
      isDisablePm,
      listAmToday,
      listPmToday
    });
  }

  componentDidShow() {
    getPet().then(() => {
      if (!this.state.petId) {
        this.setState({
          petId: _.get(this.props, 'pet.list[0].id', '')
        });
      }
    });
    this.setState({
      service: Taro.getStorageSync('subscribe_service') || []
    });
  }

  goPet = () => {
    Taro.navigateTo({
      url: '/pages/pet/index'
    });
  };

  selectedPet = (id) => {
    this.setState({
      petId: id
    });
  };

  selectedService = (item) => {
    this.setState((state) => {
      const oldService = state.service;
      const isChoose = oldService.filter((v) => v.name === item.name).length;
      let newService = [];
      if (isChoose) {
        newService = oldService.filter((v) => v.name !== item.name);
      } else {
        newService = [ ...oldService, item ];
      }
      Taro.setStorageSync('subscribe_service', newService);
      return {
        service: newService
      };
    });
  };

  handleSubmit = () => {
    const { storeId, petId, time, service, date } = this.state;
    if (!time) {
      return Taro.showToast({
        title: '请选择时间',
        icon: 'none'
      });
    }
    if (!petId) {
      return Taro.showToast({
        title: '请选择爱宠',
        icon: 'none'
      });
    }
    if (!service.length) {
      return Taro.showToast({
        title: '请选择服务项目',
        icon: 'none'
      });
    }
    const params = {
      storeId,
      petId,
      service,
      reserveTime: `${date} ${time}`,
      date,
      time
    };
    Taro.setStorageSync('subscribe_order', params);
    Taro.navigateTo({
      url: '/pages/subscribeConfirm/index'
    });
  };

  handleDateChange = (date, range, e) => {
    const time = range[e.target.value].split('     ')[0];
    this.setState({
      date: date.value,
      time
    });
  };

  showMoreService = () => {
    Taro.navigateTo({
      url: '/pages/allService/index'
    });
  };

  render() {
    const { list: serviceList } = this.props.washService;
    const {
      banners,
      petId,
      service,
      dateList,
      date,
      time,
      isDisableAm,
      isDisablePm,
      listAmToday,
      listPmToday
    } = this.state;
    const { pet } = this.props;
    const petList = _.get(pet, 'list', []);
    const total = service.reduce((t, i) => t + i.price, 0);
    return (
      <View className='u-subscribe'>
        {/* <GImage my-class='u-banner' src={_.get(banners[0], 'imgUrl')} /> */}
        <YcBanner banners={banners}></YcBanner>


        <View className='u-info'>
          <StoreInfo />
        </View>

        <View className='u-pet'>
          <View className='u-pet__list'>
            {petList.map((item) => (
              <View className='u-pet__item' key={item.id} onClick={this.selectedPet.bind(this, item.id)}>
                <View className='u-pet__avatar'>
                  <GImage my-class='u-pet__img' src={item.avatar} />
                  {item.id == petId && (
                    <View className='u-pet__selected'>
                      {/* <Iconfont type='iconchenggong' color='#FF7013' size='16' /> */}
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

        <View className='u-service'>
          <GTitle title='服务套餐' showMore onShowMore={this.showMoreService} />
          <View className='u-service__list'>
            {serviceList.slice(0, 4).map((item) => {
              const serviceIds = service.map((v) => v.id);
              return (
                <View key={item.name} className='u-service__item' onClick={this.selectedService.bind(this, item)}>
                  <View className='u-service__header'>
                    <GImage my-class='u-service__img' src={item.image} />
                  </View>
                  <View className='u-service__name'>
                    <Text>{item.name}</Text>
                    {serviceIds.includes(item.id) && (
                      <View className='u-service__selected'>
                        <Iconfont type='iconxuanzhong-xiao' color='#FF7013' size='8' />
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View className='u-time font-s-28'>
            {service.length > 0 ? (
              <View className='u-serviceNames'>已选择：{service.map((v) => v.name).join('+')}</View>
            ) : (
              <View className='u-serviceNames text-hui'>请选择服务项目</View>
            )}
            <View className='u-time__rule'>
              <View className='font-s-28'>预约时间</View>
              <View className='font-s-24 text-hui'>预约规则</View>
            </View>
            <View className='u-time__cell flex align-center p-2'>
              <View style={{ width: '15%' }} />
              <View style={{ width: '15%' }} />
              <View className='text-center' style={{ width: '35%' }}>
                上午
              </View>
              <View style={{ width: '10%' }} />
              <View className='text-center' style={{ width: '25%' }}>
                下午
              </View>
            </View>

            {dateList.map((dateItem, index) => {
              return (
                <View className='u-time__cell flex align-center p-2' key={dateItem.id}>
                  <View className='text-left' style={{ width: '15%' }}>
                    <View>{dateItem.week}</View>
                    <View className='text-hui font-s-24'>{dateItem.date}</View>
                  </View>
                  <View style={{ width: '15%' }} />
                  <View className='u-time__item' style={{ width: '35%' }}>
                    {isDisableAm && index === 0 ? (
                      <View className='u-time__guoqi'>过期</View>
                    ) : (
                      <Picker
                        mode='selector'
                        range={index === 0 ? listAmToday : timeMap.am}
                        onChange={this.handleDateChange.bind(this, dateItem, timeMap.am)}
                      >
                        <View className='u-time__yuyue'>预约</View>
                      </Picker>
                    )}
                  </View>
                  <View style={{ width: '10%' }} />
                  <View className='u-time__item' style={{ width: '25%' }}>
                    {isDisablePm && index === 0 ? (
                      <View className='u-time__guoqi'>过期</View>
                    ) : (
                      <Picker
                        mode='selector'
                        range={index === 0 ? listPmToday : timeMap.pm}
                        onChange={this.handleDateChange.bind(this, dateItem, timeMap.pm)}
                      >
                        <View className='u-time__yuyue'>预约</View>
                      </Picker>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View className='u-action'>
          <YcSubmitbar
            price={total}
            buttonText='去下单'
            renderTip={
              <View className='u-submit__tip'>
                <Text className='mr-2 font-s-3'>选择日期：</Text>
                <Text className='font-weight-bold'>
                  {date} {time}
                </Text>
              </View>
            }
            onSubmit={this.handleSubmit}
          />
        </View>
      </View>
    );
  }
}

export default SubScribe;
