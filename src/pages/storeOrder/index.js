import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtTabs, AtButton } from 'taro-ui'
import GLoading from '@/components/GLoading'
import storeApi from '@/api/store'
import config from '@/config'
import { getStore } from '@/actions/store'
import ServiceOrder from '@/components/ServiceOrder'

import './index.less'

@connect(
  ({ pet, store }) => ({
    pet, store
  }),
  (dispatch) => ({})
)
class index extends Component {
  config = {
    navigationBarTitleText: '预约订单'
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
    // this.init()
    getStore()
  }

  componentDidMount () {}

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
    const params = {
      pageNo,
      pageSize
    }
    storeApi
      .queryMyReserveWash(params)
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

  onChangeTab = (value) => {
    if (this.state.current === value) { return }
    this.setState(
      {
        current: value
      },
      () => {
        this.refresh()
      }
    )
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
              tabList={[
                { title: '已预约' },
                { title: '已完成' }
              ]}
              onClick={this.onChangeTab}
            />
          </View>
        </View>
        <ScrollView className='u-list' scrollY style={{ height: '400px' }} onScrollToLower={this.loadmore}>
          {list.length === 0 &&
          finished && (
            <View className='u-empty'>
              <Image className='u-empty__img' src={config.petAvatar}></Image>
              <View className='u-empty__label'>您还没有相关的订单</View>
              <AtButton className='u-empty__btn' type='primary' circle onClick={this.goShop}>
                去预约
              </AtButton>
            </View>
          )}
          {list.length === 0 &&
          loading && (
            <View className='u-loading'>
              <GLoading color='#ffdb47' size='60' />
            </View>
          )}
          <ServiceOrder></ServiceOrder>
          {list.length > 0 &&
            list.map((item) => (
              <View key={item.id}>预约订单</View>
            ))}
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
