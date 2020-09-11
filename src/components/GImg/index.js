import Taro, { Component } from '@tarojs/taro';
import { Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.less';

class GImg extends Component {
  static propTypes = {
    info: PropTypes.object
  };

  static propTypes = {
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    radius: PropTypes.number,
    src: PropTypes.string,
    mode: PropTypes.string,
    lazyLoad: PropTypes.bool,
    onLoad: PropTypes.func,
    force: PropTypes.bool,
    className: PropTypes.string
  };

  static defaultProps = {
    mode: 'scaleToFill',
    radius: 0
  };

  state = {
    width: 0,
    height: 0,
    loaded: false
  };

  handleLoad(event) {
    const { maxWidth, force } = this.props;
    const { width, height } = event.detail;
    const ratio = width / height;
    let calWidth = width < maxWidth ? width : maxWidth;
    calWidth = force ? maxWidth : calWidth;
    const calHeight = calWidth / ratio;
    this.setState({
      width: calWidth,
      height: calHeight,
      loaded: true
    });
  }

  handleClick(event) {
    this.props.onClick && this.props.onClick(event);
  }

  render() {
    const { src, mode, radius, className } = this.props;
    const { width, height, loaded } = this.state;
    const classStr = classnames('u-gimg', className);

    return (
      <Image
        className={classStr}
        src={src}
        mode={mode}
        onLoad={this.handleLoad}
        style={`width: ${width}rpx;height: ${height}rpx;border-radius:${radius}rpx;opacity: ${loaded ? 1 : 0}`}
        onClick={this.handleClick}
        lazyLoad
        webp
      />
    );
  }
}

export default GImg;
