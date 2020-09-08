import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import PropTypes from 'prop-types';
import config from '@/config';
import { AtButton } from 'taro-ui';
import dayjs from 'dayjs';
import storeApi from '@/api/store';
import requestPaymentPro from '@/lib/pay';

import Iconfont from '@/components/Iconfont';

import './index.less';

// 待支付，100已预约，200已完成，900已取消
const statusText = {
  0: '待支付',
  100: '已预约',
  200: '已完成',
  900: '已取消'
};

const statusColor = {
  0: '#FF7013',
  100: '#67C23A',
  200: '#999999',
  900: '#999999'
};

@connect(({ user, pet }) => ({
  user,
  pet
}))
class ServiceOrder extends Component {
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  cancelOrder = (e) => {
    e.stopPropagation();
    const { item } = this.props;
    this.props.onCancel && this.props.onCancel(item.id);
  };

  // 重新支付
  repay = () => {
    const { item } = this.props;
    const orderId = item.id;
    Taro.showLoading();
    storeApi
      .repay({
        orderId
      })
      .then((res) => {
        requestPaymentPro(res)
          .then(() => {
            Taro.showToast({
              title: '支付成功',
              icon: 'none'
            });
            setTimeout(() => {
              Taro.redirectTo({
                url: '/pages/storeOrder/index?current=1'
              });
            }, 1000);
          })
          .catch((err) => {
            console.error(err);
            Taro.showToast({
              title: '支付失败',
              icon: 'none'
            });
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

  render() {
    const { pet, item } = this.props;
    const currentPet = pet.list.filter((p) => item.petId === p.id)[0];
    const serviceList = item.service ? JSON.parse(item.service) : [];

    return (
      <View className='u-svOrder'>
        <View className='font-s-24 flex align-center justify-between border-bottom-divider pb-2'>
          <View>{item.createTime}</View>
          <View
            style={{
              color: statusColor[item.reserveOrderStatus]
            }}
          >
            {statusText[item.reserveOrderStatus]}
          </View>
        </View>

        {currentPet ? (
          <View className='u-svOrder__pet flex border-bottom-divider'>
            <Image className='u-svOrder__pet__avatar' src={currentPet.avatar || config.petAvatar} />
            <View className='ml-2'>
              <View className='font-s-28 mb-1'>{currentPet.petName}</View>
              <View className='flex align-center'>
                {currentPet.sex == 0 ? (
                  <Iconfont type='icongong' color='#2F6BFE' size='14' />
                ) : (
                  <Iconfont type='iconmu' color='pink' size='14' />
                )}
                <Text className='text-hui font-s-24'>{currentPet.petBreed}</Text>
              </View>
            </View>
          </View>
        ) : null}

        <View className='u-svOrder__info py-2 border-bottom-divider'>
          <View className='mb-5'>套餐内容</View>
          {serviceList.map((sv) => {
            return (
              <View className='flex mb-4' key={sv.id}>
                <Image className='flex-0 u-svOrder__info__image mr-3' src={sv.image || config.petAvatar} />
                <View className='flex-1'>{sv.name}</View>
                <View className='flex-0'>¥ {sv.price}</View>
              </View>
            );
          })}
        </View>

        <View className='font-s-28 pt-3 text-right'>
          <Text>预约时间：{dayjs(item.reserveTime).format('YYYY.MM.DD HH:mm')}</Text>
        </View>

        <View className='font-s-28 pt-3 text-right'>
          <Text>订单金额：</Text>
          <Text className='text-red'>¥ {item.totalFee}</Text>
        </View>
        <View className='font-s-28 pt-3 text-right'>
          {item.discountFee && <Text className='text-hui mr-4'>已优惠：{item.discountFee}元</Text>}
          <Text>实付：</Text>
          <Text className='text-red'>¥ {item.paidFee}</Text>
        </View>

        {item.reserveOrderStatus == 0 && (
          <View className='u-action'>
            <AtButton className='u-action__btn' type='secondary' circle onClick={this.repay}>
              重新支付
            </AtButton>
          </View>
        )}

        {item.reserveOrderStatus == 100 && (
          <View className='u-action'>
            <AtButton className='u-action__btn' type='secondary' circle onClick={this.cancelOrder}>
              取消订单
            </AtButton>
          </View>
        )}
      </View>
    );
  }
}

ServiceOrder.defaultProps = {
  item: {}
};

ServiceOrder.propTypes = {
  item: PropTypes.object,
  onCancel: PropTypes.func
};

export default ServiceOrder;
