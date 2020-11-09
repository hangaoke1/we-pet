import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import Iconfont from '@/components/Iconfont';

import './index.less'

export default class YcBackTop extends Component {

  handleBackTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0
    });
  };

  render() {
    const { scrollTop } = this.props
    return (
      <View
        className={classNames({
          'yc-back': true,
          'yc-back__active': scrollTop > 100
        })}
        onClick={this.handleBackTop}
      >
        <Iconfont type='iconfanhuidingbu' color='#333' size='12' />
        <Text>顶部</Text>
      </View>
    );
  }
}
