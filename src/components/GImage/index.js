/* eslint-disable taro/no-spread-in-props */
import Taro, { Component } from '@tarojs/taro';
import { Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import config from '@/config';
import _ from '@/lib/lodash';

import './index.less';

class GImage extends Component {
  static propTypes = {
    src: PropTypes.string,
    errorSrc: PropTypes.string
  };

  static defaultProps = {};

  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  state = {
    loaded: false,
    errorImg: ''
  };

  handleError() {
    this.setState({
      loaded: true,
      errorImg: this.props.errorSrc || config.petAvatar
    });
  }

  handleLoad(event) {
    this.setState({
      loaded: true
    });
    if (this.props.onLoad) {
      this.props.onLoad(event);
    }
  }

  handleClick(event) {
    this.props.onClick && this.props.onClick(event);
  }

  render() {
    let { className, src, mode } = this.props;
    const { loaded, errorImg } = this.state;
    const classStr = classnames('my-class g-image', loaded ? 'g-image__loaded' : '', className);
    src = _.url2Webp(src);

    return (
      <Image
        className={classStr}
        src={errorImg || src}
        lazyLoad
        webp
        mode={mode}
        onLoad={this.handleLoad}
        onError={this.handleError}
        onClick={this.handleClick}
      />
    );
  }
}

GImage.externalClasses = [ 'my-class' ];

export default GImage;
