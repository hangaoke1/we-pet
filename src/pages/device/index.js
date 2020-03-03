import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import userApi from '@/api/user'

import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '宝贝监控'
  }

  state = {
    list: []
  }

  componentWillMount () {
    this.queryMyCameraList()
  }

  componentDidMount () {}

  goWebview = (item) => {
    const { url } = item
    if (!url) {
      Taro.showToast({
        title: '监控地址不存在',
        icon: 'none'
      })
      return
    }
    Taro.setStorageSync('device', item)
    Taro.navigateTo({
      url: '/pages/webview/index'
    })
  }

  queryMyCameraList = () => {
    Taro.showLoading()
    userApi
      .queryMyCameraList()
      .then((res) => {
        Taro.hideLoading()
        this.setState({
          list: res
        })
      })
      .catch((err) => {
        console.log(err)
        Taro.hideLoading()
        Taro.showToast({
          title: '监控查询失败',
          icon: 'none'
        })
      })
  }

  render () {
    // http://pet-agatha.oss-cn-hangzhou.aliyuncs.com/20200302/94bd3d83375a4c8c951d554d4ebfccaa.jpg
    const { list } = this.state
    return (
      <View className='u-device'>
        <View className='u-list'>
          {list.map((item) => (
            <View className='u-item' onClick={this.goWebview.bind(this, item)} key={item.id}>
              <View className='u-header'>
                <View className='u-name'>{item.cameraName}</View>
                <View className='u-status'>在线</View>
              </View>
              <View className='u-content'>
                <Image
                  className='u-img'
                  src='http://pet-agatha.oss-cn-hangzhou.aliyuncs.com/20200302/94bd3d83375a4c8c951d554d4ebfccaa.jpg'
                />
                <View className='u-cameraNo'>{item.cameraNo}</View>
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}

export default index