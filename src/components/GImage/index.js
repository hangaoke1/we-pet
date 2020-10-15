/* eslint-disable taro/no-spread-in-props */
import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import config from '@/config';
import _ from '@/lib/lodash';

import './index.less';

class GImage extends Component {
  static propTypes = {
    src: PropTypes.string,
    errorSrc: PropTypes.string,
    fade: PropTypes.bool,
    showLoading: PropTypes.bool,
    showError: PropTypes.bool,
  };

  static defaultProps = {};

  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  state = {
    loading: true,
    isError: false,
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out'
  };

  handleError() {
    this.setState({
      loading: false,
      isError: true
    });
  }

  handleLoad(event) {
    this.setState({
      loading: false,
      isError: false,
      opacity: 1
    });
    if (this.props.onLoad) {
      this.props.onLoad(event);
    }
  }

  handleClick(event) {
    this.props.onClick && this.props.onClick(event);
  }

  render() {
    let { src, mode, showLoading = true, showError = true, fade = true } = this.props;
    const { opacity, loading, isError, transition } = this.state;
    const classStr = classnames('my-class g-image');
    src = src || config.petAvatar;
    src = _.url2Webp(src);

    const style = {
      opacity,
      transition
    };

    const imageStyle = {
      opacity: isError || loading ? 0 : 1
    };

    return (
      <View className={classStr} style={fade ? style : {}}>
        {!isError && (
          <Image
            className='g-image__image'
            src={src}
            style={imageStyle}
            lazyLoad
            webp
            mode={mode}
            onLoad={this.handleLoad}
            onError={this.handleError}
            onClick={this.handleClick}
          />
        )}

        {showLoading && loading && <View className='g-image__loading'>加载中</View>}

        {showError && isError && !loading && <View className='g-image__error'>加载失败</View>}
      </View>
    );
  }
}

GImage.externalClasses = [ 'my-class' ];

export default GImage;
