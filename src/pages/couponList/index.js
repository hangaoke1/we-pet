import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import userApi from '@/api/user';
import Coupon from '@/components/Coupon';
import GLoadMore from '@/components/GLoadMore';

import './index.less';

// 优惠券列表
export default class CouponList extends Component {
  config = {
    navigationBarTitleText: '红包卡券',
    onReachBottomDistance: 50,
  };

  state = {
    list: [],
    loading: false,
    finished: false,
    pageNo: 1,
    pageSize: 10
  };

  componentDidMount() {
    this.getList();
  }

  onReachBottom = () => {
    console.log('>>> 触底')
    this.getList();
  };

  getList = () => {
    const { pageNo, pageSize, loading, finished } = this.state;
    if (loading || finished) {
      return;
    }
    this.setState({
      loading: true
    });
    userApi
      .queryCoupons({
        pageNo: this.state.pageNo,
        pageSize: 10
      })
      .then((res) => {
        this.setState((state) => {
          return {
            pageNo: pageNo + 1,
            loading: false,
            finished: pageNo * pageSize > res.totalCount ? true : false,
            list: [ ...state.list, ...res.items ]
          };
        });
      })
      .catch(() => {});
  };

  handleClick = () => {
    Taro.switchTab({
      url: '/pages/shop/index'
    });
  };

  render() {
    const { list, loading, finished } = this.state;
    return (
      <View className='u-couponList'>
        {list.map((info) => <Coupon key={info.id} info={info} onClick={this.handleClick} />)}
        <GLoadMore
          onClick={this.getList}
          finished={finished}
          loading={loading}
        />
      </View>
    );
  }
}
