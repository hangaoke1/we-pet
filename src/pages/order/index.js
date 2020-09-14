import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Image } from '@tarojs/components';
import { AtTabs, AtButton } from 'taro-ui';
import Iconfont from '@/components/Iconfont';
import OrderItem from '@/components/OrderItem';
import GLoading from '@/components/GLoading';
import GLoadMore from '@/components/GLoadMore';
import shopApi from '@/api/shop';
import requestPaymentPro from '@/lib/pay';
import config from '@/config';

import './index.less';

class index extends Component {
  config = {
    navigationBarTitleText: '我的订单'
  };

  state = {
    current: 0,
    // 列表加载
    list: [],
    pageNo: 1,
    pageSize: 4,
    loading: false,
    finished: false
  };

  componentWillMount() {
    this.init();
  }

  componentDidMount() {}

  init = () => {
    this.setState(
      {
        current: this.$router.params.current ? Number(this.$router.params.current) : 0,
        pageNo: 1,
        pageSize: 10,
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
        pageSize: 10,
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
    const { loading, finished, pageNo, pageSize, current } = this.state;
    if (loading || finished) {
      return;
    }
    this.setState({
      loading: true
    });
    // 订单状态，为空表示查询全部。100待支付，200待发货，300待收货，400已完成，900已取消
    const currentMap = {
      0: '',
      1: 100,
      2: 200,
      3: 300,
      4: 400,
      5: 900
    };
    const params = {
      pageNo,
      pageSize,
      orderStatus: currentMap[current]
    };
    shopApi
      .queryOrder(params)
      .then((res) => {
        res.items.forEach((item) => {
          item.id = item.order.orderId;
        });
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

  onChangeTab = (value) => {
    if (this.state.current === value) {
      return;
    }
    this.setState(
      {
        current: value
      },
      () => {
        this.refresh();
      }
    );
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

  goShop = () => {
    Taro.switchTab({
      url: '/pages/shop/index'
    });
  };

  goSearch = () => {
    Taro.navigateTo({
      url: '/pages/searchOrder/index'
    });
  };

  render() {
    const { list, loading, finished } = this.state;

    return (
      <View className='u-order'>
        <View className='u-header'>
          <View className='u-tab'>
            <AtTabs
              current={this.state.current}
              scroll
              tabList={[
                { title: '全部' },
                { title: '待付款' },
                { title: '待发货' },
                { title: '待收货' },
                { title: '已完成' },
                { title: '已取消' }
              ]}
              onClick={this.onChangeTab}
            />
          </View>
          <View className='u-search' onClick={this.goSearch}>
            <Iconfont type='iconsearch' size='16' color='#ccc' />
          </View>
        </View>
        <ScrollView className='u-list' scrollY style={{ height: '400px' }} onScrollToLower={this.loadmore}>
          {list.length === 0 &&
          finished && (
            <View className='u-empty'>
              <Image className='u-empty__img' src={config.petAvatar} />
              <View className='u-empty__label'>您还没有相关的订单</View>
              <AtButton className='u-empty__btn' type='primary' circle onClick={this.goShop}>
                去逛逛
              </AtButton>
            </View>
          )}
          {list.length === 0 &&
          loading && (
            <View className='u-loading'>
              <GLoading color='#FF7013' size='60' />
            </View>
          )}
          {list.length > 0 &&
            list.map((item) => (
              <OrderItem
                key={item.id}
                orderInfo={item}
                onCancel={this.onCancel}
                onRepay={this.onRepay}
                onDeliveryOrder={this.onDeliveryOrder}
              />
            ))}
          {list.length > 0 && <GLoadMore loading={loading} finished={finished} onClick={this.loadmore} />}
        </ScrollView>
      </View>
    );
  }
}

export default index;
