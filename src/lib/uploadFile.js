import Taro from '@tarojs/taro'
import config from '@/config'
import token from '@/lib/token'

export default function (filePath) {
  return Taro.uploadFile({
    url: config.uploadUrl,
    filePath,
    name: 'file'
  }).then(responese => {
    const res = JSON.parse(responese.data)
    // 成功
    if (res.code === 200) {
      return res.data
    }
    // 业务异常
    if (res.code === 999) {
      return Promise.reject(res)
    }
    // 登录状态过期
    if (res.code === 900) {
      token.clear()
      return Promise.reject(res)
    }
    return Promise.reject(res)
  })
}