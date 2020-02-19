import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import _ from '@/lib/lodash'
import Iconfont from '@/components/Iconfont'

import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '搜索'
  }

  state = {
    value: '',
    history: Taro.getStorageSync('search_history') || []
  }

  componentWillMount () {}

  componentDidMount () {}

  onChange = (value) => {
    this.setState({
      value: value
    })
  }

  onConfirm = () => {
    const keyword = this.state.value
    let history = Taro.getStorageSync('search_history') || []
    history = [ keyword, ...history ]
    history = _.uniq(history)
    Taro.setStorageSync('search_history', history)
    // TODO: 
  }

  clearHistory = () => {
    Taro.setStorageSync('search_history', [])
    this.setState({
      history: []
    })
  }

  render () {
    const prefixCls = 'ehome-index'
    const { history } = this.state
    return (
      <View className={prefixCls}>
        <AtSearchBar
          showActionButton
          value={this.state.value}
          onChange={this.onChange}
          onConfirm={this.onConfirm}
          onActionClick={this.onConfirm}
        />
        <View className='u-history'>
          <View className='u-title'>
            <View className='u-label'>搜索历史</View>
            <View onClick={this.clearHistory}>
              <Iconfont type='icondel' size='20' color='#ccc' />
            </View>
          </View>
          <View className='u-list'>
            {history.map((item) => (
              <View className='u-item' key={item}>
                {item}
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }
}

export default index
