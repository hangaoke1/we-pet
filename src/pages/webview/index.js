import Taro, { Component } from '@tarojs/taro'
import { View, Video, WebView } from '@tarojs/components'

import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '有宠'
  }

  state = {
    device: Taro.getStorageSync('device') || {}
  }

  componentWillMount () {
    this.video = Taro.createVideoContext('myVideo', this)
  }

  componentDidMount () {}

  componentDidShow () {
    this.video && this.video.play()
  }

  componentDidHide () {
    this.video.stop()
  }

  render () {
    const { url, cameraName, id, cameraNo } = this.state.device
    return (
      // http://hls01open.ys7.com/openlive/8942c49004704113a646b22def9cad00.hd.m3u8
      <View className='u-webview'>
        {/* <WebView src='https://www.hgaoke.com/video.html'></WebView> */}
        <Video id='myVideo' className='u-video' src={url} controls autoplay />
        <View className='u-info'>
          <View className='u-item'>
            <View className='u-label'>设备编号：</View>
            <View className='u-value'>{id}</View>
          </View>
          <View className='u-item'>
            <View className='u-label'>设备序列号：</View>
            <View className='u-value'>{cameraNo}</View>
          </View>
          <View className='u-item'>
            <View className='u-label'>设备名称：</View>
            <View className='u-value'>{cameraName}</View>
          </View>
        </View>
        <View className='u-tip'>如无法看到监控直播，请联系宠物店</View>
      </View>
    )
  }
}

export default index
