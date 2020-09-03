import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Input } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtButton, AtFloatLayout } from 'taro-ui';
import config from '@/config';
import Iconfont from '@/components/Iconfont';
import Coupon from '@/components/Coupon';
import requestPaymentPro from '@/lib/pay';
import _ from '@/lib/lodash';
import { getUserInfo, getCoupons } from '@/actions/user';
import { getPet } from '@/actions/pet';
import storeApi from '@/api/store';

import './index.less';

@connect(({ pet, user }) => ({
  pet,
  user
}))
class SubscribeConfirm extends Component {
  config = {
    navigationBarTitleText: '我的订单',
    usingComponents: {
      'van-checkbox': '../../components/vant/dist/checkbox/index'
    }
  };

  state = {
    mobile: Taro.getStorageSync('subscribe_mobile'),
    storeId: '',
    petId: '',
    service: [],
    reserveTime: '',
    date: '',
    payType: 0, // 0在线支付 1: 到店支付
    showCoupons: false,
    coupon: null
  };

  componentWillMount() {
    const params = Taro.getStorageSync('subscribe_order');
    const { storeId, petId, service, reserveTime, date, time } = params;
    this.setState({
      storeId,
      petId,
      service,
      reserveTime,
      date,
      time
    });
  }

  componentDidShow() {
    if (this.props.user.isLogin) {
      getUserInfo();
      getPet();
      getCoupons();
    }
  }

  handleSubmit = () => {
    const { storeId, petId, service, reserveTime, mobile, coupon, payType } = this.state;
    if (!mobile) {
      Taro.showToast({
        title: '请填写手机号',
        icon: 'none'
      });
      return;
    }
    Taro.setStorageSync('subscribe_mobile', mobile);
    const params = {
      storeId,
      petId,
      serviceIds: service.map((i) => i.id).join('-'),
      reserveTime,
      mobile,
      payType,
      couponId: _.get(coupon, 'couponsId')
    };
    Taro.showLoading();
    storeApi
      .insertReserveWash(params)
      .then((res) => {
        Taro.hideLoading();
        requestPaymentPro(res)
          .then(() => {
            Taro.showToast({
              title: '支付成功',
              icon: 'none'
            });
            setTimeout(() => {
              Taro.redirectTo({
                url: '/pages/storeOrder/index'
              });
            }, 1000);
          })
          .catch((err) => {
            console.error(err);
            // 跳转到待支付订单页面
            Taro.showToast({
              title: '支付失败',
              icon: 'none'
            });
            setTimeout(() => {
              Taro.redirectTo({
                url: '/pages/storeOrder/index'
              });
            }, 1000);
          });
      })
      .catch((err) => {
        Taro.hideLoading();
        Taro.showToast({
          title: err.message,
          icon: 'none'
        });
      });
  };

  handleMobileChange = (e) => {
    this.setState({
      mobile: e.detail.value
    });
  };

  handlePayTypeChange = (payType) => {
    this.setState({
      payType,
      coupon: null
    });
  };

  // 显示可用优惠券
  hanldeCouponsClick = () => {
    this.setState({
      showCoupons: true
    });
  };

  handleClose = () => {
    this.setState({
      showCoupons: false
    });
  };

  handleChooseCoupon = (c) => {
    const { coupon } = this.state;
    const isEuqal = c.couponsId === _.get(coupon, 'couponsId');
    this.setState({
      coupon: isEuqal ? null : c,
      showCoupons: false
    });
  };

  render() {
    const { user, pet } = this.props;
    const { petId, service, date, time, mobile, payType, showCoupons, coupon } = this.state;
    const choosePet = _.get(pet, 'list', []).filter((item) => item.id == petId)[0] || {};
    const userInfo = _.get(user, 'userInfo');

    const { coupons = [] } = user;
    let total = service.reduce((t, i) => t + i.price, 0);
    if (payType === 1) {
      total = total * 0.1;
    }

    const enableCoupons = coupons.filter((v) => v.required <= total);
    const couponsLen = enableCoupons.length;

    if (coupon) {
      // TODO: 减去优惠券价值
      total = total - _.get(coupon, 'value', 0);
    }
    return (
      <View className='u-subscribeCofirm'>
        <View className='u-header'>
          <View className='u-header__info'>{userInfo.nickName || '访客'}</View>
          <Input className='u-header__mobile' value={mobile} onChange={this.handleMobileChange} placeholder='请填写手机号' />
        </View>

        <View className='u-store'>
          <View className='p-2 border-bottom-divider'>
            <View className='u-store__name'>有宠宠物生活馆(滨江店)</View>
            <View className='u-store__address'>
              <Iconfont type='icondizhi01' color='#ccc' size='16' />
              <Text style={{ marginLeft: '4px' }}>浙江省杭州市滨江区滨盛路1893号</Text>
            </View>
          </View>
          <View className='u-pay'>
            <View
              className='flex align-center justify-between px-2 py-4'
              onClick={this.handlePayTypeChange.bind(this, 0)}
            >
              <View className='flex align-center'>
                <Iconfont type='iconzaixianzhifu' color='#2593F9' size='16' />
                <Text className='ml-2'>在线支付</Text>
              </View>
              <van-checkbox value={payType === 0} checkedColor='#FF7013' />
            </View>
            <View
              className='flex align-center justify-between px-2 pb-4'
              onClick={this.handlePayTypeChange.bind(this, 1)}
            >
              <View className='flex align-center'>
                <Iconfont type='icondaodianzhifu' color='#C1AC2F' size='16' />
                <Text className='ml-2'>到店支付</Text>
              </View>
              <van-checkbox value={payType === 1} checkedColor='#FF7013' />
            </View>
          </View>
        </View>

        <View className='u-pet'>
          <Image className='u-pet__avatar' src={choosePet.avatar || config.petAvatar} />
          <View className='u-pet__info'>
            <View className='u-pet__name'>{choosePet.petName}</View>
            <View className='u-pet__petBreed'>{choosePet.petBreed}</View>
          </View>
        </View>

        <View className='u-service'>
          <View className='u-service__title border-bottom-divider'>套餐内容</View>
          {service.map((s) => {
            return (
              <View className='u-service__item border-bottom-divider' key={s.id}>
                <Image className='u-service__icon' src={s.image || config.petAvatar} />
                <View className='u-service__name'>{s.name}</View>
                <View className='u-service__price'>¥ {s.price}</View>
              </View>
            );
          })}
          <View className='flex align-center p-2'>
            <View className='flex-1 font-s-28'>优惠券</View>
            {couponsLen > 0 ? (
              <View className='flex-0 flex align-center' onClick={this.hanldeCouponsClick}>
                {coupon ? (
                  <Text className='mr-1 text-red'>-¥ {_.get(coupon, 'value', 0)}</Text>
                ) : (
                  <Text className='mr-1' style={{ color: '#C00C00' }}>
                    {couponsLen}张可用
                  </Text>
                )}

                {!coupon && <Iconfont type='icondian' color='#C00C00' size='8' />}
                <Iconfont type='iconarrowright' color='#272727' size='16' />
              </View>
            ) : (
              <View className='flex-0 flex align-center'>
                <Text className='mr-1 text-hui'>暂无可用优惠券</Text>
              </View>
            )}
          </View>
        </View>

        <View className='u-time flex align-center justify-between'>
          <View className='u-time__label'>预约服务时间</View>
          <View className='u-time__val'>
            {date} {time}
          </View>
        </View>

        <View className='u-payment'>
          <View className='u-payment__remark'>
            <View className='u-payment__label'>备注</View>
            <Input className='u-payment__input' placeholder='添加备注' />
          </View>
        </View>

        <View className='u-action'>
          <View className='u-action__left' />
          <View className='u-action__right'>
            <View>
              {coupon ? <Text className='font-s-24 text-hui mr-1'>已优惠 ¥{_.get(coupon, 'value', 0)}</Text> : null}
              <Text className='u-action__label'>{payType === 0 ? '合计' : '定金'}：</Text>
              <Text className='u-action__val text-red'>¥ {total.toFixed(2)}</Text>
            </View>
            <AtButton className='u-action__btn' type='primary' circle={false} full onClick={this.handleSubmit}>
              去下单
            </AtButton>
          </View>
        </View>
        <AtFloatLayout isOpened={showCoupons} title='选择优惠券' onClose={this.handleClose} scrollY>
          {enableCoupons.map((c) => {
            return (
              <Coupon
                key={c.couponsId}
                info={c}
                isSelect={c.couponsId === _.get(coupon, 'couponsId')}
                onClick={this.handleChooseCoupon.bind(this, c)}
              />
            );
          })}
        </AtFloatLayout>
      </View>
    );
  }
}

export default SubscribeConfirm;
