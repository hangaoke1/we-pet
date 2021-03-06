import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import _ from '@/lib/lodash'
import Iconfont from '@/components/Iconfont'

import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '商品搜索'
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
    this.goResult(keyword)
  }

  goResult = (keyword) => {
    if (!keyword) { return }
    let history = Taro.getStorageSync('search_history') || []
    history = [ keyword, ...history ]
    history = _.uniq(history)
    Taro.setStorageSync('search_history', history)
    Taro.setStorageSync('search_keyword', keyword)
    if (this.$router.params.from === 'searchResult') {
      Taro.navigateBack()
    } else {
      Taro.redirectTo({
        url: '/pages/searchResult/index'
      })
    }
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
              <View className='u-item' key={item} onClick={this.goResult.bind(this, item)}>
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
