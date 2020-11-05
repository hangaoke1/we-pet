import Taro, { Component } from '@tarojs/taro';
import { AtButton } from 'taro-ui';
import { View, Text } from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.less';

export default class YcSubmitbar extends Component {
  static propTypes = {
    price: PropTypes.number,
    renderTip: PropTypes.any,
    buttonText: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    price: 0,
    buttonText: '提交订单',
    loading: false
  };

  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  render() {
    const { buttonText, disabled, loading, price } = this.props;
    return (
      <View className='yc-submitbar flex align-center'>
        <View className='yc-submitbar__tip'>{this.props.renderTip}</View>
        <View className='flex-0' />
        <View className='flex-1'>
          <Text className='font-s-28'>合计：</Text>
          <Text className='font-s-24'>¥</Text>
          <Text className='font-s-36 font-weight-bold f-number'>{ price.toFixed(2) }</Text>
        </View>
        <View className='flex-0'>
          <AtButton className='yc-btn mw-200' circle loading={loading} disabled={disabled} onClick={this.props.onSubmit}>
            {buttonText}
          </AtButton>
        </View>
      </View>
    );
  }
}
