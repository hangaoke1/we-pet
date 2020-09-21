import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Image, Text } from '@tarojs/components';
import { AtTabs } from 'taro-ui';
import Iconfont from '@/components/Iconfont';
import RefundOrderItem from '@/components/RefundOrderItem';
import GLoading from '@/components/GLoading';
import GLoadMore from '@/components/GLoadMore';
import shopApi from '@/api/shop';

import './index.less';

class RefundOrder extends Component {
  config = {
    navigationBarTitleText: '退款/售后'
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

    const currentMap = {
      0: 1,
      1: 2,
      2: 3,
      3: 4,
      4: 5,
      5: 6
    };
    const params = {
      pageNo,
      pageSize,
      orderStatus: '',
      warrantyStatus: currentMap[current]
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
                { title: '退款中' },
                { title: '退款关闭' },
                { title: '退款成功' },
                { title: '退货中' },
                { title: '退货关闭' },
                { title: '退货成功' }
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
              <Image className='u-empty__img' src={require('../../images/order_empty.png')} />
              <View className='u-empty__label'>
                您还没有订单哦，<Text className='main-color' onClick={this.goShop}>
                  去逛逛
                </Text>
              </View>
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
              <RefundOrderItem
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

export default RefundOrder;
