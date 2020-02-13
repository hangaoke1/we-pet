import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTextarea } from 'taro-ui'

import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '订单备注'
  }

  state = {
    value: ''
  }

  componentWillMount () {}

  componentDidMount () {
    const eventChannel = this.$scope.getOpenerEventChannel()
    const vm = this
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      vm.setState({
        value: data.data
      })
    })
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value
    })
  }

  handleSubmit = () => {
    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', {data: this.state.value});
    Taro.navigateBack()
  }

  render () {
    return (
      <View className='u-remark'>
        <AtTextarea
          className='u-textarea'
          value={this.state.value}
          onChange={this.handleChange}
          maxLength={800}
          height={500}
          placeholder='选填，如有特殊要求'
        />

        <View className='u-bottom' onClick={this.handleSubmit}>确定</View>
      </View>
    )
  }
}

export default index
