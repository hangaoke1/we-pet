import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text } from '@tarojs/components';
import { AtButton, AtFloatLayout } from 'taro-ui';
import Iconfont from '@/components/Iconfont';
import GImage from '@/components/GImage';
import Coupon from '@/components/Coupon';
import { getAddress } from '@/actions/address';
import shopApi from '@/api/shop';
import requestPaymentPro from '@/lib/pay';
import _ from '@/lib/lodash';
import { getCoupons } from '@/actions/user';

import './index.less';

@connect(({ address, user }) => ({
  address,
  user
}))
class ConfirmOrder extends Component {
  config = {
    navigationBarTitleText: '订单确认',
    backgroundColor: '#f3f4f8'
  };

  state = {
    remark: '',
    orderProduct: [],
    showCoupons: false,
    coupon: null
  };

  componentWillMount() {
    const orderProduct = Taro.getStorageSync('order_product') || [];
    this.setState({
      orderProduct
    });
  }

  componentDidShow() {
    if (this.props.user.isLogin) {
      getCoupons();
    }
  }

  componentDidMount() {
    getAddress();
  }

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
    const isEuqal = c.id === _.get(coupon, 'id');
    this.setState({
      coupon: isEuqal ? null : c,
      showCoupons: false
    });
  };

  goAddress = () => {
    Taro.navigateTo({
      url: '/pages/address/index?from=confirmOrder'
    });
  };

  goRemark = () => {
    const vm = this;
    Taro.navigateTo({
      url: '/pages/remark/index',
      events: {
        acceptDataFromOpenedPage(data) {
          vm.setState({
            remark: data.data
          });
        }
      },
      success(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: vm.state.remark
        });
      }
    });
  };

  handleSubmit = () => {
    const { address } = this.props;
    const { orderProduct, coupon } = this.state;
    if (!_.get(address, 'id')) {
      return Taro.showToast({ icon: 'none', title: '请选择收获地址' });
    }
    const params = {
      skuInfoList: orderProduct.map((item) => {
        return {
          skuId: item.id,
          quantity: item.quantity
        };
      }),
      addressId: address.id,
      buyerMemo: this.state.remark,
      cartFlag: this.$router.params.cartFlag,
      couponId: _.get(coupon, 'id')
    };
    Taro.showLoading();
    shopApi
      .insertOrder(params)
      .then((res) => {
        requestPaymentPro(res)
          .then(() => {
            Taro.showToast({
              title: '支付成功',
              icon: 'none'
            });
            Taro.redirectTo({
              url: '/pages/order/index?current=2'
            });
          })
          .catch((err) => {
            console.error(err);
            // 跳转到待支付订单页面
            Taro.showToast({
              title: '支付失败',
              icon: 'none'
            });
            Taro.redirectTo({
              url: '/pages/order/index?current=1'
            });
          });
      })
      .catch((err) => {
        Taro.hideLoading();
        Taro.showToast({
          title: err.message || '下单失败',
          icon: 'none'
        });
      });
  };

  render() {
    const { address, user } = this.props;
    const { coupons = [] } = user;
    const { remark, orderProduct, showCoupons, coupon } = this.state;
    const chooseAddress = address.list.filter((item) => item.id === address.id)[0];

    let totalPriceOri = orderProduct.reduce((total, item) => {
      return total + Number(item.memberPrice || item.price);
    }, 0);
    let totalPrice = totalPriceOri;
    const totalCount = orderProduct.reduce((total, item) => {
      return total + Number(item.quantity);
    }, 0);

    const enableCoupons = coupons.filter((v) => v.required <= totalPriceOri);
    const couponsLen = enableCoupons.length;

    if (coupon) {
      // TODO: 减去优惠券价值
      totalPrice = totalPriceOri - _.get(coupon, 'value', 0);
    }

    return (
      <View className='u-confirmOrder'>
        <View className='u-address' onClick={this.goAddress}>
          {chooseAddress ? (
            <View className='u-address__left'>
              <View className='u-address__location'>
                {chooseAddress.province}
                {chooseAddress.city}
                {chooseAddress.area} {chooseAddress.detail}
              </View>
              <View className='u-address__contact'>
                {chooseAddress.contact} {chooseAddress.mobile}
              </View>
            </View>
          ) : (
            <View className='u-address__left'>选择收货地址</View>
          )}
          <View className='u-address__right'>
            <Iconfont type='iconarrowright' size='20' color='#000' />
          </View>
        </View>

        <View className='u-product'>
          <View className='border-bottom-divider'>
            {orderProduct.map((item) => {
              let specs = item.productSku.specs.map((s) => s.name + '/' + s.value).join('/');
              return (
                <View className='u-product__item' key={item.id}>
                  <View className='u-product__img'>
                    <GImage my-class='u-product__img-content' src={item.productSku.skuImgUrl} resize="200" />
                  </View>
                  <View className='u-product__info'>
                    <View className='u-product__name'>{item.productSku.skuName}</View>
                    <View className='u-product__specs mt-1 text-hui'>规格：{specs || '无'}</View>
                    <View className='u-product__price mt-1 text-red f-number'>¥ {item.productSku.memberPrice || item.productSku.price}</View>
                  </View>
                  <View className='u-product__right'>
                    <View className='u-product__count'>
                      <View>
                        <Iconfont type='iconshanchu' size='14' color='#333' />
                      </View>
                      <Text>{item.quantity}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View className='border-bottom-divider'>
            <View className='u-item'>
              <View className='u-label'>商品价格</View>
              <View className='u-val text-red f-number'>¥ {totalPriceOri.toFixed(2)}</View>
            </View>
            <View className='u-item'>
              <View className='u-label'>运费</View>
              <View className='u-val text-red f-number'>¥ 0.00</View>
            </View>
            <View className='u-item'>
              <View className='u-label'>优惠券</View>
              <View className='u-val'>
                <View className='flex align-center'>
                  {couponsLen > 0 ? (
                    <View className='flex-0 flex align-center' onClick={this.hanldeCouponsClick}>
                      {coupon ? (
                        <Text className='mr-1 text-red f-number'>-¥ {_.get(coupon, 'value', 0)}</Text>
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
            </View>
          </View>

          <View className='text-right py-3 font-s-28'>
            共<Text className='text-red f-number'>{totalCount}</Text>件商品，共计：<Text className='text-red f-number'>¥ {totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        <View className='u-remark' onClick={this.goRemark}>
          <View className='u-item'>
            <View className='u-label'>订单备注</View>
            <View className='u-val'>
              {remark ? (
                <View className='u-remark__val'>{remark}</View>
              ) : (
                <View className='u-remark__placeholder'>选填，如有特殊要求</View>
              )}
              <Iconfont type='iconarrowright' size='14' color='#ccc' />
            </View>
          </View>
        </View>

        <View className='u-bottom'>
          <View className='u-bottom__info font-s-24'>
            <Text>
              实付金额：<Text className='text-red f-number'>¥ {totalPrice.toFixed(2)}</Text>
            </Text>
          </View>
          <AtButton className='u-action__btn' type='primary' circle={false} full onClick={this.handleSubmit}>
            去付款
          </AtButton>
        </View>

        <AtFloatLayout isOpened={showCoupons} title='选择优惠券' onClose={this.handleClose} scrollY>
          {enableCoupons.map((c) => {
            return (
              <Coupon
                key={c.id}
                info={c}
                isSelect={c.id === _.get(coupon, 'id')}
                onClick={this.handleChooseCoupon.bind(this, c)}
              />
            );
          })}
        </AtFloatLayout>
      </View>
    );
  }
}

export default ConfirmOrder;
