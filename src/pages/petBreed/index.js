import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIndexes, AtSearchBar } from 'taro-ui'
import data from '@/assets/pet'
import _ from '@/lib/lodash'

import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '宝贝种类'
  }

  state = {
    petType: 1, // 1狗 2猫
    keyword: '',
    showList: []
  }

  componentDidMount () {
    const eventChannel = this.$scope.getOpenerEventChannel()
    const vm = this
    eventChannel.on('acceptDataFromOpenerPage', function (res) {
      vm.setState({
        petType: res.petType,
        showList: res.petType == 1 ? data.dog : data.cat
      })
    })
  }

  onClick = (item) => {
    console.log('>>> 点击', item)
    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', { data: item.name});
    Taro.navigateBack()
  }

  onChange = (keyword) => {
    const { petType } = this.state
    let showList = petType == 1 ? data.dog : data.cat
    if (keyword) {
      showList = _.cloneDeep(showList)
      showList.forEach(v => {
        v.items = v.items.filter(item => item.name.includes(keyword))
      })
      showList = showList.filter(item => item.items.length)
    }
    this.setState({
      keyword,
      showList
    })
  }

  render () {
    const { showList, keyword } = this.state
    return (
      <View className='u-petType' style='height:100vh'>
        <View className='u-search'>
          <AtSearchBar value={keyword} onChange={this.onChange.bind(this)} />
        </View>
        <AtIndexes list={showList} onClick={this.onClick.bind(this)}></AtIndexes>
      </View>
    )
  }
}

export default index
