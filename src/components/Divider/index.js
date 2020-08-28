import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import PropTypes from 'prop-types';

export default class Divider extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string
  };

  static defaultProps = {
    height: 1,
    color: '#ccc'
  }


  render() {
    const { width, height, color, style, className } = this.props;
    const renderStyle = {
      width: width ? width + 'rpx' : '100%',
      height: height + 'rpx',
      background: color,
      ...style
    }
    return <View className={className} style={renderStyle}></View>;
  }
}
