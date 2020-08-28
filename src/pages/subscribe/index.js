import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View, Image, Text, Picker } from "@tarojs/components";
import GTitle from "@/components/GTitle";
import Iconfont from "@/components/Iconfont";
import StoreInfo from "@/components/StoreInfo";
import apiHome from "@/api/home";
import makePhoneCall from "@/lib/makePhoneCall";
import config from "@/config";
import _ from "@/lib/lodash";
import dayjs from "dayjs";
import { getPet } from "@/actions/pet";
import { getWashList } from '@/actions/washService';

import { timeMap } from "@/enums";

import "./index.less";

function genDate() {
  const arr = [
    dayjs(),
    dayjs().add(1, "day"),
    dayjs().add(2, "day"),
    dayjs().add(3, "day"),
    dayjs().add(4, "day"),
    dayjs().add(5, "day"),
    dayjs().add(6, "day")
  ];
  const weekMap = {
    0: "周日",
    1: "周一",
    2: "周二",
    3: "周三",
    4: "周四",
    5: "周五",
    6: "周六"
  };
  const newArray = arr.map((item, index) => {
    return {
      id: index,
      date: item.format("MM/DD"),
      week: index === 0 ? "今日" : weekMap[item.day()],
      value: item.format("YYYY-MM-DD"),
    };
  });
  return newArray;
}

@connect(({ pet, washService }) => ({
  pet, washService
}))
class SubScribe extends Component {
  config = {
    navigationBarTitleText: "预约洗护",
    usingComponents: {
      "van-icon": "../../components/vant/dist/icon/index",
      "van-row": "../../components/vant/dist/row/index",
      "van-col": "../../components/vant/dist/col/index",
      "van-image": "../../components/vant/dist/image/index"
    }
  };

  state = {
    storeId: 1,
    petId: "", // 宠物选择
    service: [], // 服务选择
    date: "", // 日期
    time: "", // 时间
    banners: [],
    dateList: genDate()
  };

  componentWillMount() {
    apiHome
      .queryBanners()
      .then(res => {
        this.setState({
          banners: res || []
        });
      })
      .catch(error => {
        console.log(">>> queryBanners异常", error);
      });
  }

  componentWillMount() {
    Taro.setStorageSync("subscribe_service", []);
    getWashList();
  }

  componentDidShow() {
    getPet().then(() => {
      if (!this.state.petId) {
        this.setState({
          petId: _.get(this.props, "pet.list[0].id", "")
        });
      }
    });
    this.setState({
      service: Taro.getStorageSync("subscribe_service") || []
    })
  }

  openLocation = () => {
    Taro.openLocation({
      latitude: 30.206371,
      longitude: 120.202034,
      name: "有宠宠物生活馆",
      address: "浙江省杭州市滨江区滨盛路1893号"
    });
  };

  doCall = () => {
    makePhoneCall(config.tel);
  };

  goPet = () => {
    Taro.navigateTo({
      url: "/pages/pet/index"
    });
  };

  selectedPet = id => {
    this.setState({
      petId: id
    });
  };

  selectedService = item => {
    this.setState(state => {
      const oldService = state.service;
      const isChoose = oldService.filter(v => v.name === item.name).length;
      let newService = [];
      if (isChoose) {
        newService = oldService.filter(v => v.name !== item.name);
      } else {
        newService = [...oldService, item];
      }
      Taro.setStorageSync('subscribe_service', newService);
      return {
        service: newService
      };
    });
  };

  handleSubmit = () => {
    const { storeId, petId, dateFmt, time, service, date } = this.state;
    if (!time) {
      return Taro.showToast({
        title: "请选择时间",
        icon: "none"
      });
    }
    if (!petId) {
      return Taro.showToast({
        title: "请选择爱宠",
        icon: "none"
      });
    }
    if (!service.length) {
      return Taro.showToast({
        title: "请选择服务项目",
        icon: "none"
      });
    }
    const params = {
      storeId,
      petId,
      service,
      reserveTime: `${dateFmt} ${time}:00`,
      date,
      time
    };
    Taro.setStorageSync("subscribe_order", params);
    Taro.navigateTo({
      url: "/pages/subscribeConfirm/index"
    });
  };

  handleDateChange = (date, range, e) => {
    const time = range[e.target.value].split('     ')[0];
    this.setState({
      date: date.value,
      time
    })
  }

  showMoreService = () => {
    Taro.navigateTo({
      url: '/pages/allService/index'
    })
  }

  render() {
    const { list: serviceList } = this.props.washService;
    const { banners, petId, service, dateList, date, time } = this.state;
    const { pet } = this.props;
    const petList = _.get(pet, "list", []);
    const total = service.reduce((t, i) => t + i.price, 0);
    const isDisableAm = dayjs().hour() > 12;
    const isDisablePm = dayjs().hour() > 20;
    return (
      <View className="u-subscribe">
        <Image
          className="u-banner animated fadeIn faster delay-300ms"
          src={banners[0].imgUrl}
        />

        <View className="u-info">
          <StoreInfo></StoreInfo>
        </View>

        <View className="u-pet">
          <View className="u-pet__list">
            {petList.map(item => (
              <View
                className="u-pet__item"
                key={item.id}
                onClick={this.selectedPet.bind(this, item.id)}
              >
                <View className="u-pet__avatar">
                  <Image
                    className="u-pet__img"
                    src={item.avatar || config.petAvatar}
                  />
                  {item.id == petId && (
                    <View className="u-pet__selected">
                      <Iconfont
                        type="iconchenggong"
                        color="#FF7A24"
                        size="16"
                      />
                    </View>
                  )}
                </View>
                <View className="u-pet__name">{item.petName}</View>
              </View>
            ))}

            <View className="u-pet__item" onClick={this.goPet}>
              <View className="u-pet__edit">
                <Iconfont type="iconliebiao" color="#fff" size="18" />
              </View>
              <View className="u-pet__name text-hui">管理宠物</View>
            </View>
          </View>
        </View>

        <View className="u-service">
          <GTitle title="服务套餐" showMore onShowMore={this.showMoreService}></GTitle>
          <View className="u-service__list">
            {serviceList.slice(0, 4).map(item => {
              const serviceIds = service.map(v => v.id);
              return (
                <View
                  key={item.name}
                  className="u-service__item"
                  onClick={this.selectedService.bind(this, item)}
                >
                  <View className="u-service__header">
                    <Image
                      className="u-service__img"
                      src={item.image || config.petAvatar}
                    />
                  </View>
                  <View className="u-service__name">
                    <Text>{item.name}</Text>
                    {serviceIds.includes(item.id) && (
                      <View className="u-service__selected">
                        <Iconfont
                          type="iconxuanzhong-xiao"
                          color="#FF7A24"
                          size="8"
                        />
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View className="u-time font-s-28">
          <View className="u-serviceNames">已选择：{service.map(v => v.name).join('+')}</View>
            <View className="u-time__rule">
              <View className="font-s-28">预约时间</View>
              <View className="font-s-24 text-hui">预约规则</View>
            </View>
            <View className="u-time__cell flex align-center p-2">
              <View style={{ width: "15%" }}></View>
              <View style={{ width: "15%" }}></View>
              <View className="text-center" style={{ width: "35%" }}>
                上午
              </View>
              <View style={{ width: "10%" }}></View>
              <View className="text-center" style={{ width: "25%" }}>
                下午
              </View>
            </View>

            {dateList.map((dateItem, index) => {
              return (
                <View
                  className="u-time__cell flex align-center p-2"
                  key={dateItem.id}
                >
                  <View className="text-left" style={{ width: "15%" }}>
                    <View>{dateItem.week}</View>
                    <View className="text-hui font-s-24">{dateItem.date}</View>
                  </View>
                  <View style={{ width: "15%" }}></View>
                  <View className="u-time__item" style={{ width: "35%" }}>
                    {isDisableAm && index === 0 ? (
                      <View className="u-time__guoqi">过期</View>
                    ) : (
                      <Picker mode="selector" range={timeMap.am} onChange={this.handleDateChange.bind(this, dateItem, timeMap.am)}>
                        <View className="u-time__yuyue">预约</View>
                      </Picker>
                    )}
                  </View>
                  <View style={{ width: "10%" }}></View>
                  <View className="u-time__item" style={{ width: "25%" }}>
                    {isDisablePm && index === 0 ? (
                      <View className="u-time__guoqi">过期</View>
                    ) : (
                      <Picker mode="selector" range={timeMap.pm} onChange={this.handleDateChange.bind(this, dateItem, timeMap.pm)}>
                        <View className="u-time__yuyue">预约</View>
                      </Picker>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View className="u-action">
          <View className="u-action__left">
            预约时间：{date} {time}
          </View>
          <View className="u-action__right">
            <View>
              <Text className="u-action__label">合计：</Text>
              <Text className="u-action__val">¥ {total}</Text>
            </View>
            <View className="u-action__btn" onClick={this.handleSubmit}>
              结算
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default SubScribe;
