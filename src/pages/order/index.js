import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtButton } from 'taro-ui'
import Iconfont from '@/components/Iconfont'

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
    pageSize: 10,
    loading: false,
    finished: false
  }

  componentWillMount () {}

  componentDidMount () {}

  handleClick = (value) => {
    this.setState({
      current: value
    })
  }

  render () {
    const { list } = this.state

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

        {list.length === 0 ? (
          <View className='u-empty'>
            <View className='u-empty__label'>您还没有相关的订单</View>
            <AtButton className='u-empty__btn' type='primary' circle>去逛逛</AtButton>
          </View>
        ) : null}
      </View>
    )
  }
}

export default index
