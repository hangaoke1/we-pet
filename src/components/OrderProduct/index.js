import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import Iconfont from '@/components/Iconfont';
import GImage from '@/components/GImage';
import _ from '@/lib/lodash';

import './index.less';

class OrderProduct extends Component {
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  onClick = (e) => {
    this.props.onClick && this.props.onClick(e);
  };

  render() {
    const { item } = this.props;
    let specs = _.get(item, 'productSku.specs', []).map((s) => s.name + '/' + s.value).join('/');
    return item ? (
      <View className='u-product__item' onClick={this.onClick}>
        <View className='u-product__img'>
          <GImage my-class='u-product__img-content' src={item.productSku.skuImgUrl} resize="200" />
        </View>
        <View className='u-product__info'>
          <View className='u-product__name ellipsis-2'>{item.productSku.skuName}</View>
          <View className='u-product__specs'>{specs}</View>
          <View className='text-red mt-1 f-number'>¥ {item.productSku.memberPrice || item.productSku.price}</View>
        </View>
        <View className='u-product__right flex align-center'>
          <Iconfont type='iconshanchu' size='12' color='#333' />
          <Text className="ml-1 font-s-28 f-number">{item.quantity}</Text>
        </View>
      </View>
    ) : null;
  }
}

export default OrderProduct;
