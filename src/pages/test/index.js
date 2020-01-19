import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image, Button, Picker } from '@tarojs/components'
import './index.less'

export default class Index extends Component {
  state = {
    region: [],
    customItem: '全部'
  }

  componentWillMount () {}

  componentDidMount () {
    Taro.login({}).then((res) => {
      console.log('>>> 登录', res)
    })
  }

  componentWillUnmount () {}

  componentDidShow () {}

  componentDidHide () {}

  config = {
    navigationBarTitleText: '测试'
  }

  getUserInfo = (e) => {
    console.log(e.detail.userInfo)
  }

  getAddress = () => {
    Taro.getSetting({
      success (res) {
        if (!res.authSetting['scope.address']) {
          Taro.authorize({
            scope: 'scope.address',
            success () {
              Taro.chooseAddress().then((address) => {
                console.log('>>> 收货地址', address)
              })
            }
          })
        } else {
          Taro.chooseAddress().then((address) => {
            console.log('>>> 收货地址', address)
          })
        }
      }
    })
  }

  change = (e) => {
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setState({
      region: e.detail.value
    })
  }

  render () {
    return (
      <View className='index'>
        <Swiper className='u-swiper' indicatorColor='#999' indicatorActiveColor='#333' circular indicatorDots autoplay>
          <SwiperItem>
            <Image
              className='u-item'
              src='https://img11.360buyimg.com/babel/s700x360_jfs/t1/4776/39/2280/143162/5b9642a5E83bcda10/d93064343eb12276.jpg!q90!cc_350x180'
            />
          </SwiperItem>
          <SwiperItem>
            <View className='u-item'>2</View>
          </SwiperItem>
          <SwiperItem>
            <View className='u-item'>3</View>
          </SwiperItem>
        </Swiper>
        <Text>Hello world!</Text>
        <Button open-type='contact'>进入客服会话</Button>
        <Button open-type='getUserInfo' onGetUserInfo={this.getUserInfo}>
          获取用户信息
        </Button>
        <Button onClick={this.getAddress}>获取用户收货地址</Button>
        <Picker mode='region' onChange={this.change} value={this.state.region} custom-item={this.state.customItem}>
          <View class='Picker'>当前选择：{JSON.stringify(this.state.region)}</View>
        </Picker>
      </View>
    )
  }
}
