import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import PropTypes from 'prop-types';
import { View, Block } from '@tarojs/components';

@connect(({ user }) => ({
  user
}))
export default class YcLogin extends Component {
  static propTypes = {
    renderError: PropTypes.object
  };

  render() {
    const { children, user, renderError } = this.props;
    const isLogin = user.isLogin;
    return (
      <View>
        {!isLogin && <Block>{renderError}</Block>}
        {isLogin && <Block>{children}</Block>}
      </View>
    );
  }
}
