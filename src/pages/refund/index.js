import Taro, { Component } from '@tarojs/taro';
import { View, Text, Picker, Input } from '@tarojs/components';
import Iconfont from '@/components/Iconfont';
import GImage from '@/components/GImage';
import OrderProduct from '@/components/OrderProduct';

import _ from '@/lib/lodash';
import uploadFile from '@/lib/uploadFile';
import shopApi from '@/api/shop';

import './index.less';

const reasonRange = [ '不想要了', '与图片不符' ];
const statusRange = [ '未收到货', '已收到货' ];

export default class Refund extends Component {
  config = {
    navigationBarTitleText: ''
  };

  state = {
    warrantyType: '',
    productStatus: '',
    reason: '',
    logisticsNo: '',
    remark: '',
    images: [],
    orderInfo: Taro.getStorageSync('order_detail')
  };

  componentWillMount() {
    this.setState({
      warrantyType: this.$router.params.warrantyType
    });
    Taro.setNavigationBarTitle({
      title: this.$router.params.warrantyType == 0 ? '我要退款' : '退货退款'
    });
  }

  hanldeSubmit = () => {
    const { warrantyType, productStatus, logisticsNo, reason, remark, images } = this.state;
    const { orderInfo } = this.state;
    const order = _.get(orderInfo, 'order');
    const params = {
      orderId: order.orderId,
      warrantyType: warrantyType,
      productState: productStatus,
      logisticsNo: logisticsNo,
      remark: remark,
      reason: reasonRange[reason],
      imgJson: images.map((v) => {
        return { url: v };
      })
    };

    if (params.warrantyType == 1) {
      if (!params.logisticsNo) {
        Taro.showToast({
          title: '请输入退货单号',
          icon: 'none'
        });
        return;
      }
    }
    if (params.productState === '') {
      Taro.showToast({
        title: '请选择货物状态',
        icon: 'none'
      });
      return;
    }
    if (params.reason === '') {
      Taro.showToast({
        title: '请选择退货原因',
        icon: 'none'
      });
      return;
    }
    shopApi
      .refund(params)
      .then(() => {
        Taro.showToast({
          title: '提交成功',
          icon: 'success'
        });
        setTimeout(() => {
          Taro.redirectTo({
            url: '/pages/refundOrder/index?current=0'
          });
        }, 1000);
      })
      .catch(() => {});
  };

  goProduct = (item) => {
    Taro.navigateTo({
      url: `/pages/product/index?productId=${item.productSku.productId}&skuId=${item.productSku.id}`
    });
  };

  onProductStateChange = (res) => {
    this.setState({
      productStatus: res.detail.value
    });
  };

  onReasonChange = (res) => {
    this.setState({
      reason: res.detail.value
    });
  };

  doUpload = () => {
    Taro.showActionSheet({
      itemList: [ '拍照', '从手机相册选择' ]
    })
      .then((res) => {
        if (res.tapIndex === 0) {
          Taro.chooseImage({
            count: 1,
            sourceType: [ 'camera' ],
            sizeType: [ 'compressed' ]
          }).then((res) => {
            uploadFile(res.tempFilePaths[0]).then((data) => {
              this.setState((state) => {
                return {
                  images: [ ...state.images, data ]
                };
              });
            });
          });
        }
        if (res.tapIndex === 1) {
          Taro.chooseImage({
            count: 1,
            sourceType: [ 'album' ],
            sizeType: [ 'compressed' ]
          }).then((res) => {
            uploadFile(res.tempFilePaths[0]).then((data) => {
              this.setState((state) => {
                return {
                  images: [ ...state.images, data ]
                };
              });
            });
          });
        }
      })
      .catch(() => {});
  };

  delImg = (index) => {
    this.setState((state) => {
      state.images.splice(index, 1);
      return {
        images: state.images
      };
    });
  };

  handleRemarkChange = (res) => {
    this.setState({
      remark: res.detail.value
    });
  };

  handleLogisticsNoChange = (res) => {
    this.setState({
      logisticsNo: res.detail.value
    });
  };

  render() {
    const { warrantyType, productStatus, reason, images } = this.state;
    const { orderInfo } = this.state;
    const order = _.get(orderInfo, 'order');
    const orderItemList = _.get(orderInfo, 'orderItemList');
    return (
      <View className='u-refund'>
        <View className='p-2 bg-bai'>
          <View className='px-2'>
            {orderItemList.map((item) => {
              return <OrderProduct key={item.id} item={item} onClick={this.goProduct.bind(this, item)} />;
            })}
          </View>
        </View>

        <View className='bg-bai mt-2'>
          <View className='flex align-center justify-between p-3 border-bottom-divider'>
            <View>货物状态</View>
            <Picker mode='selector' range={statusRange} onChange={this.onProductStateChange}>
              {productStatus ? (
                statusRange[productStatus]
              ) : (
                <View className='flex align-center'>
                  <Text className='text-hui'>请选择</Text>
                  <Iconfont type='iconarrowright' color='#999' size='16' />
                </View>
              )}
            </Picker>
          </View>
          <View className='flex align-center justify-between p-3 border-bottom-divider'>
            <View>退款原因</View>
            <Picker mode='selector' range={reasonRange} onChange={this.onReasonChange}>
              {reason ? (
                reasonRange[reason]
              ) : (
                <View className='flex align-center'>
                  <Text className='text-hui'>请选择</Text>
                  <Iconfont type='iconarrowright' color='#999' size='16' />
                </View>
              )}
            </Picker>
          </View>
          {warrantyType == 1 && (
            <View className='flex align-center justify-between p-3'>
              <View className='mr-2'>退货单号</View>
              <Input className='flex-1' placeholder='请输入退货运单号' onBlur={this.handleLogisticsNoChange} />
            </View>
          )}
        </View>

        <View className='bg-bai mt-2'>
          <View className='flex align-center justify-between p-3 border-bottom-divider'>
            <View className='mr-2'>退款金额</View>
            <View className='flex-1'>
              <Text className='text-red f-number'>¥ {order.paidFee.toFixed(2)}</Text>
            </View>
          </View>
          <View className='flex align-center justify-between p-3'>
            <View className='mr-2'>退款说明</View>
            <Input className='flex-1' placeholder='选填' onBlur={this.handleRemarkChange} />
          </View>
        </View>

        <View className='bg-bai mt-2 py-2 px-4'>
          <View className='pb-2 font-s-28'>上传凭证</View>
          <View className='flex flex-wrap'>
            {images.map((url, index) => {
              return (
                <View key={url} className='u-img__wrap'>
                  <GImage my-class='u-img' src={url} />
                  <Iconfont
                    my-class='u-del'
                    type='iconquxiaozhaopian'
                    color='#696969'
                    size='20'
                    onClick={this.delImg.bind(this, index)}
                  />
                </View>
              );
            })}
            {images.length < 3 && (
              <View className='u-img flex flex-column align-center justify-center' onClick={this.doUpload}>
                <Iconfont type='iconshangchuanzhaopian' color='#999' size='20' />
                <View className='font-s-2 text-hui mt-1'>点击上传</View>
                <View className='font-s-2 text-hui'>(最多3张)</View>
              </View>
            )}
          </View>
        </View>

        <View className='u-save' onClick={this.hanldeSubmit}>
          保存
        </View>
      </View>
    );
  }
}
