import Taro from '@tarojs/taro'

const gotoLogin = function () {
  var pages = Taro.getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  if (url.indexOf('login') === -1) {
    Taro.navigateTo({
      url: '/pages/login/index'
    })
  }
}

export default gotoLogin
