import Taro from '@tarojs/taro'
import config from '@/config'
import token from '@/lib/token'
import gotoLogin from '@/lib/gotoLogin'
// 请求拦截
const requestInterceptors = (opts) => {
  const apiPrefix = config.server
  // 请求url拼接
  if (!/http/.test(opts.url)) {
    opts.url = apiPrefix + opts.url
  }
  opts.header = {
    Authorization: token.get() || ''
  }
  return opts
}

export default function axios (opts) {
  opts = requestInterceptors(opts)

  return Taro.request(opts).then((responese) => {
    const res = responese.data
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
      // gotoLogin()
      return Promise.reject(res)
    }
    return Promise.reject(res)
  })
}

export const get = function (url, data = {}, config = {}) {
  return axios(
    Object.assign(
      {
        url,
        method: 'GET',
        data: data
      },
      config
    )
  )
}

export const post = function (url, data = {}, config = {}) {
  return axios(
    Object.assign(
      {
        url,
        method: 'POST',
        data: data
      },
      config
    )
  )
}
