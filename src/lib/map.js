import Taro from '@tarojs/taro'

export function goLocation () {
  const key = 'JDZBZ-2Y2CW-V3HRN-RKL7T-WD6YS-Q4FP4' //使用在腾讯位置服务申请的key
  const referer = '有宠宠物生活馆' //调用插件的app的名称
  const location = JSON.stringify({
    latitude: 30.206371,
    longitude: 120.202034
  })
  const category = '生活服务,娱乐休闲'

  Taro.navigateTo({
    url:
      'plugin://chooseLocation/index?key=' +
      key +
      '&referer=' +
      referer +
      '&location=' +
      location +
      '&category=' +
      category
  })
}
