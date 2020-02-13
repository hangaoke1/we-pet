import Taro, { Component } from '@tarojs/taro'
import { View, Video } from '@tarojs/components'

import './index.less'

class index extends Component {

  config = {
    navigationBarTitleText: '小黄兜'
  }

  componentWillMount () {
    this.video = Taro.createVideoContext('myVideo', this)
  }

  componentDidMount () { }

  componentDidShow () {
    this.video && this.video.play()
  }

  componentDidHide () {
    this.video.stop()
  }

  render () {
    const prefixCls = 'ehome-index'

    return (
      <View className={prefixCls}>
        {/* <WebView src='https://www.hgaoke.com/video.html'></WebView> */}
        <Video id='myVideo' className="u-video" src="http://hls01open.ys7.com/openlive/8942c49004704113a646b22def9cad00.hd.m3u8" controls autoplay></Video>
      </View>
    )
  }
}

export default index