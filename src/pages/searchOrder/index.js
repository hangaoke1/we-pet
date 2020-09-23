import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';
import _ from '@/lib/lodash';
import Iconfont from '@/components/Iconfont';

import './index.less';

class SearchOrder extends Component {
  config = {
    navigationBarTitleText: '订单搜索'
  };

  state = {
    value: '',
    history: Taro.getStorageSync('search_order_history') || []
  };

  componentWillMount() {}

  componentDidMount() {}

  onChange = (value) => {
    this.setState({
      value: value
    });
  };

  onConfirm = () => {
    const keyword = this.state.value;
    this.goResult(keyword);
  };

  goResult = (keyword) => {
    if (!keyword) {
      return;
    }
    let history = Taro.getStorageSync('search_order_history') || [];
    history = [ keyword, ...history ];
    history = _.uniq(history);
    Taro.setStorageSync('search_order_history', history);
    Taro.setStorageSync('search_order_keyword', keyword);
    if (this.$router.params.from === 'searchOrderResult') {
      Taro.navigateBack();
    } else {
      Taro.redirectTo({
        url: '/pages/searchOrderResult/index'
      });
    }
  };

  clearHistory = () => {
    Taro.setStorageSync('search_order_history', []);
    this.setState({
      history: []
    });
  };

  render() {
    const { history } = this.state;
    return (
      <View>
        <View className='bg-bai'>
          <AtSearchBar
            showActionButton
            value={this.state.value}
            onChange={this.onChange}
            onConfirm={this.onConfirm}
            onActionClick={this.onConfirm}
          />
        </View>
        <View className='u-history'>
          <View className='u-title'>
            <View className='u-label'>搜索历史</View>
            <View onClick={this.clearHistory}>
              <Iconfont type='icondel' size='20' color='#ccc' />
            </View>
          </View>
          <View className='u-list'>
            {history.map((item) => (
              <View className='u-item' key={item} onClick={this.goResult.bind(this, item)}>
                {item}
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }
}

export default SearchOrder;
