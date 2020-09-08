import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import { AtTabs, AtButton } from 'taro-ui';
import GLoading from '@/components/GLoading';
import GLoadMore from '@/components/GLoadMore';
import storeApi from '@/api/store';
import config from '@/config';
import { getStore } from '@/actions/store';
import ServiceOrder from '@/components/ServiceOrder';
import { getPet } from '@/actions/pet';

import './index.less';

@connect(({ pet, store }) => ({
  pet,
  store
}))
class StoreOrder extends Component {
  config = {
    navigationBarTitleText: '我的预约'
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
    getStore();
    getPet();
    this.init();
  }

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
    const currentMap = {
      0: 0,
      1: 100,
      2: 200,
      3: 900
    };
    this.setState({
      loading: true
    });
    const params = {
      pageNo,
      pageSize,
      reserveOrderStatus: currentMap[current]
    };
    storeApi
      .queryMyReserveWash(params)
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
  onCancel = (id) => {
    Taro.showModal({
      title: '提示',
      content: '是否确定取消预约订单',
      confirmColor: '#FF7013'
    })
      .then((res) => {
        if (res.confirm) {
          Taro.showLoading();
          storeApi
            .cancelReserveWash({
              id
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

  render() {
    const { list, loading, finished } = this.state;

    return (
      <View className='u-order'>
        <View className='u-header'>
          <View className='u-tab'>
            <AtTabs
              current={this.state.current}
              tabList={[ { title: '待支付' }, { title: '已预约' }, { title: '已完成' }, { title: '已取消' } ]}
              onClick={this.onChangeTab}
            />
          </View>
        </View>
        <ScrollView className='u-list' scrollY style={{ height: '400px' }} onScrollToLower={this.loadmore}>
          {list.length === 0 &&
          finished && (
            <View className='u-empty'>
              <Image className='u-empty__img' src={config.petAvatar} />
              <View className='u-empty__label'>您还没有相关的订单</View>
              <AtButton className='u-empty__btn' type='primary' circle onClick={this.goShop}>
                去预约
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
              <ServiceOrder key={item.id} item={item} onCancel={this.onCancel.bind(this)}>
                预约订单
              </ServiceOrder>
            ))}
          {list.length > 0 && <GLoadMore loading={loading} finished={finished} onClick={this.loadmore} />}
        </ScrollView>
      </View>
    );
  }
}

export default StoreOrder;
