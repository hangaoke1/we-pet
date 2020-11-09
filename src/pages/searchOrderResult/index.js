import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Iconfont from '@/components/Iconfont';
import shopApi from '@/api/shop';
import OrderItem from '@/components/OrderItem';
import RefundOrderItem from '@/components/RefundOrderItem';

import requestPaymentPro from '@/lib/pay';

import './index.less';

@connect(({ user }) => ({
  user
}))
class searchOrderResult extends Component {
  config = {
    navigationBarTitleText: '订单搜索结果'
  };

  state = {
    keyword: '',
    // 列表加载
    list: [],
    pageNo: 1,
    pageSize: 4,
    loading: false,
    finished: false
  };

  componentWillMount() {}

  componentDidMount() {}

  componentDidShow() {
    const newKeyword = Taro.getStorageSync('search_order_keyword');
    if (newKeyword === this.state.keyword) {
      return;
    }
    this.setState(
      {
        keyword: newKeyword
      },
      () => {
        this.refresh();
      }
    );
  }

  init = () => {
    this.setState(
      {
        pageNo: 1,
        pageSize: 4,
        loading: false,
        finished: false,
        list: []
      },
      () => {
        this.loadmore();
      }
    );
  };

  refresh = () => {
    this.setState(
      {
        pageNo: 1,
        pageSize: 4,
        loading: false,
        finished: false,
        list: []
      },
      () => {
        this.loadmore();
      }
    );
  };

  loadmore = () => {
    const { loading, finished, pageNo, pageSize, keyword } = this.state;
    if (loading || finished) {
      return;
    }
    this.setState({
      loading: true
    });
    const params = {
      pageNo,
      pageSize,
      keyword
    };
    shopApi
      .queryOrder(params)
      .then((res) => {
        this.setState((state) => {
          return {
            pageNo: pageNo + 1,
            loading: false,
            finished: pageNo * pageSize >= res.totalCount ? true : false,
            list: [ ...state.list, ...res.items ]
          };
        });
      })
      .catch(() => {});
  };

  goSearch = () => {
    Taro.navigateTo({
      url: '/pages/searchOrder/index?from=searchOrderResult'
    });
  };

  // 取消订单
  onCancel = (orderId) => {
    Taro.showModal({
      title: '提示',
      content: '是否确定取消订单',
      confirmColor: '#FF7013'
    })
      .then((res) => {
        if (res.confirm) {
          Taro.showLoading();
          shopApi
            .cancelOrder({
              orderId
            })
            .then(() => {
              Taro.hideLoading();
              this.refresh();
            })
            .catch((err) => {
              Taro.hideLoading();
              Taro.showToast({
                title: err.message,
                icon: 'none'
              });
            });
        }
      })
      .catch(() => {});
  };

  // 重新支付
  onRepay = (orderId) => {
    Taro.showLoading();
    shopApi
      .againPayOrder({
        orderId
      })
      .then((res) => {
        Taro.hideLoading();
        requestPaymentPro(res)
          .then(() => {
            Taro.showToast({
              title: '支付成功',
              icon: 'none'
            });
            Taro.redirectTo({
              url: '/pages/order/index?current=2'
            });
          })
          .catch((err) => {
            console.error(err);
            Taro.showToast({
              title: '支付失败',
              icon: 'none'
            });
          });
      })
      .catch((err) => {
        Taro.hideLoading();
        Taro.showToast({
          title: err.message,
          icon: 'none'
        });
      });
  };

  // 确认收货
  onDeliveryOrder = (orderId) => {
    Taro.showModal({
      title: '提示',
      content: '您已收到商品？',
      confirmColor: '#FF7013'
    })
      .then((res) => {
        if (res.confirm) {
          Taro.showLoading();
          shopApi
            .deliveryOrder({
              orderId
            })
            .then(() => {
              Taro.hideLoading();
              Taro.redirectTo({
                url: '/pages/order/index?current=4'
              });
            })
            .catch((err) => {
              Taro.hideLoading();
              Taro.showToast({
                title: err.message,
                icon: 'none'
              });
            });
        }
      })
      .catch(() => {});
  };

  render() {
    const { list, loading, finished } = this.state;
    let loadTip = '';
    if (finished) {
      loadTip = list.length === 0 ? '暂无数据' : '没有更多啦～';
    } else if (loading) {
      loadTip = '加载中...';
    } else {
      loadTip = '点击加载更多~';
    }

    return (
      <View className='u-searchResult'>
        <View className='u-header bg-bai'>
          <View onClick={this.goSearch} className='u-icon'>
            <Iconfont type='iconsearch' size='20' color='#ccc' />
            <Text style={{ marginLeft: '4px' }}>搜索</Text>
          </View>
        </View>

        <ScrollView className='u-list' scrollY style={{ height: '400px' }} onScrollToLower={this.loadmore}>
          {list.map((item) => {
            return item.order.warrantyStatus != 0 ? (
              <RefundOrderItem
                key={item.id}
                orderInfo={item}
                onCancel={this.onCancel}
                onRepay={this.onRepay}
                onDeliveryOrder={this.onDeliveryOrder}
              />
            ) : (
              <OrderItem
                key={item.id}
                orderInfo={item}
                onCancel={this.onCancel}
                onRepay={this.onRepay}
                onDeliveryOrder={this.onDeliveryOrder}
              />
            );
          })}
          <View className='u-tip' onClick={this.loadmore}>
            <Text>{loadTip}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default searchOrderResult;
