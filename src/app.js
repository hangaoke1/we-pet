/* eslint-disable import/first */
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import './styles/custom-theme.scss'
import token from '@/lib/token'
import configStore from './store'
import Index from './pages/index'
import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
const store = configStore()
class App extends Component {
  componentDidMount () {
    // 小程序系统session检测
    Taro.checkSession()
      .then(() => {
        console.log('>>> 小程序session有效')
      })
      .catch(() => {
        token.clear()
      })
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config = {
    pages: [ 'pages/index/index', 'pages/confirmOrder/index', 'pages/cart/index', 'pages/product/index', 'pages/user/index', 'pages/addressUpdate/index', 'pages/addressAdd/index', 'pages/address/index', 'pages/shop/index', 'pages/login/index', 'pages/test/index', 'pages/webview/index', 'pages/remark/index' ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#929292',
      selectedColor: '#fc454d',
      list: [
        {
          pagePath: 'pages/index/index',
          selectedIconPath: 'images/syclick@2x.png',
          iconPath: 'images/synormal@2x.png',
          text: '首页'
        },
        {
          pagePath: 'pages/shop/index',
          selectedIconPath: 'images/fjclick@2x.png',
          iconPath: 'images/fjnormal@2x.png',
          text: '商城'
        },
        {
          pagePath: 'pages/cart/index',
          selectedIconPath: 'images/fjclick@2x.png',
          iconPath: 'images/fjnormal@2x.png',
          text: '购物车'
        },
        {
          pagePath: 'pages/user/index',
          selectedIconPath: 'images/wdclick@2x.png',
          iconPath: 'images/wdnormal@2x.png',
          text: '我的'
        }
      ]
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
