import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtButton } from 'taro-ui'
import Iconfont from '@/components/Iconfont'
import OrderItem from '@/components/OrderItem'
import GLoading from '@/components/GLoading'
import shopApi from '@/api/shop'

import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '我的订单'
  }

  state = {
    current: 0,
    // 列表加载
    list: [],
    pageNo: 1,
    pageSize: 4,
    loading: false,
    finished: false
  }

  componentWillMount () {
    this.init()
  }

  componentDidMount () {}

  init = () => {
    this.setState(
      {
        current: 0,
        pageNo: 1,
        pageSize: 10,
        loading: false,
        finished: false,
        list: []
      },
      () => {
        this.loadmore()
      }
    )
  }

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
        this.loadmore()
      }
    )
  }

  loadmore = () => {
    const { loading, finished, pageNo, pageSize, current } = this.state
    if (loading || finished) {
      return
    }
    this.setState({
      loading: true
    })
    // 订单状态，为空表示查询全部。100待支付，200待发货，300待收货，400已完成，900已取消
    const currentMap = {
      0: '',
      1: 100,
      2: 200,
      3: 300,
      4: 400,
      5: 900
    }
    const params = {
      pageNo,
      pageSize,
      orderStatus: currentMap[current]
    }
    shopApi
      .queryOrder(params)
      .then((res) => {
        res.items.forEach((item) => {
          item.id = item.order.orderId
        })
        this.setState((state) => {
          return {
            pageNo: pageNo + 1,
            loading: false,
            finished: pageNo * pageSize > res.totalCount ? true : false,
            list: [ ...state.list, ...res.items ]
          }
        })
      })
      .catch(() => {})
  }

  handleClick = (value) => {
    this.setState(
      {
        current: value
      },
      () => {
        this.refresh()
      }
    )
  }

  onCancel = (orderId) => {
    console.log('>>> 取消订单', orderId)
    Taro.showModal({
      title: '提示',
      content: '是否确定取消订单',
      confirmColor: '#ffdb47'
    })
      .then((res) => {
        if (res.confirm) {
          Taro.showLoading()
          shopApi
            .cancelOrder({
              orderId
            })
            .then(() => {
              Taro.hideLoading()
              this.refresh()
            })
            .catch((err) => {
              Taro.hideLoading()
              Taro.showToast({
                title: err.message,
                icon: 'success'
              })
            })
        }
      })
      .catch(() => {})
  }

  render () {
    const { list, loading, finished } = this.state
    let loadTip = ''
    if (finished) {
      loadTip = '没有更多啦～'
    } else if (loading) {
      loadTip = '加载中...'
    } else {
      loadTip = '点击加载更多~'
    }

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
              onClick={this.handleClick}
            />
          </View>
          <View className='u-search'>
            <Iconfont type='iconsearch' size='16' color='#ccc' />
          </View>
        </View>
        <ScrollView className='u-list' scrollY style={{ height: '400px' }} onScrollToLower={this.loadmore}>
          {list.length === 0 &&
          finished && (
            <View className='u-empty'>
              <View className='u-empty__label'>您还没有相关的订单</View>
              <AtButton className='u-empty__btn' type='primary' circle>
                去逛逛
              </AtButton>
            </View>
          )}
          {list.length === 0 &&
          loading && (
            <View className='u-loading'>
              <GLoading color='#ffdb47' size='60' />
            </View>
          )}
          {list.length > 0 && list.map((item) => <OrderItem key={item.id} orderInfo={item} onCancel={this.onCancel} />)}
          {list.length > 0 && (
            <View className='u-tip' onClick={this.loadmore}>
              <Text>{loadTip}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    )
  }
}

export default index
