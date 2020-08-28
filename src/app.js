/* eslint-disable import/first */
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import './styles/custom-theme.scss'
import token from '@/lib/token'
import configStore from './store'
import Index from './pages/index'

import './app.less'
import './styles/animate.min.css';
import './styles/base.css';

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
    pages: [
      'pages/subscribeConfirm/index',
      'pages/subscribe/index',
      'pages/pet/index',
      'pages/allService/index',
      'pages/index/index',
      'pages/device/index',
      'pages/storeOrder/index',
      'pages/searchOrderResult/index',
      'pages/searchOrder/index',
      'pages/searchResult/index',
      'pages/search/index',
      'pages/orderDetail/index',
      'pages/user/index',
      'pages/order/index',
      
      'pages/petDetail/index',
      'pages/petBreed/index',
      'pages/confirmOrder/index',
      'pages/cart/index',
      'pages/product/index',
      'pages/addressUpdate/index',
      'pages/addressAdd/index',
      'pages/address/index',
      'pages/shop/index',
      'pages/login/index',
      'pages/test/index',
      'pages/webview/index',
      'pages/remark/index'
    ],
    plugins: {},
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序定位'
      }
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#333333',
      selectedColor: '#333333',
      list: [
        {
          pagePath: 'pages/index/index',
          selectedIconPath: 'images/home_active.png',
          iconPath: 'images/home.png',
          text: '首页'
        },
        {
          pagePath: 'pages/shop/index',
          selectedIconPath: 'images/market_active.png',
          iconPath: 'images/market.png',
          text: '商城'
        },
        {
          pagePath: 'pages/cart/index',
          selectedIconPath: 'images/cart_active.png',
          iconPath: 'images/cart.png',
          text: '购物车'
        },
        {
          pagePath: 'pages/user/index',
          selectedIconPath: 'images/my_active.png',
          iconPath: 'images/my.png',
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
