import Taro, { Component } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import PropTypes from 'prop-types';

import './index.less'

class GImg extends Component {
  static propTypes = {
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    radius: PropTypes.number,
    src: PropTypes.string,
    mode: PropTypes.string,
    lazyLoad: PropTypes.bool,
    onLoad: PropTypes.func,
    force: PropTypes.bool
  };

  static defaultProps = {
    mode: 'scaleToFill',
    radius: 0
  }

  state = {
    width: 0,
    height: 0
  }

  componentDidMount () { }

  handleLoad (event) {
    const { maxWidth, force } =  this.props;
    const { width, height } = event.detail;
    const ratio = width / height;
    let calWidth = width < maxWidth ? width : maxWidth;
    calWidth = force ? maxWidth : calWidth
    const calHeight= calWidth / ratio;
    this.setState({
      width: calWidth,
      height: calHeight
    })
  }

  handleClick (event) {
    this.props.onClick && this.props.onClick();
  }

  render () {
    const { src, mode, radius } = this.props;
    const { width, height } = this.state;
    return (
      <Image className='u-img' src={src} mode={mode} onLoad={this.handleLoad} style={`width: ${width}rpx;height: ${height}rpx;border-radius:${radius}rpx`} onClick={this.handleClick} lazyLoad webp>
      </Image>
    )
  }
}

export default GImg