import Taro, { Component } from '@tarojs/taro';
import { AtLoadMore } from 'taro-ui';

export default class GLoadMore extends Component {
  render() {
    const { loading, finished, onClick } = this.props;
    let status = 'more';
    if (loading) {
      status = 'loading';
    }
    if (finished) {
      status = 'noMore';
    }
    return <AtLoadMore onClick={onClick} status={status} />;
  }
}
