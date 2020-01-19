import Taro from '@tarojs/taro'
import config from '@/config'
import token from '@/lib/token'
// 请求拦截
const requestInterceptors = (opts) => {
  const apiPrefix = config.server
  // 请求url拼接
  if (!/http/.test(opts.url)) {
    opts.url = apiPrefix + opts.url
  }
  opts.headers = {
    Authorization: token.get()
  }
  return opts
}

export default function axios (opts) {
  opts = requestInterceptors(opts)

  return Taro.request(opts).then((res) => {
    const data = res.data
    // 成功
    if (data.code === 200) {
      return data
    }
    // 业务异常
    if (data.code === 999) {
      return Promise.reject(data)
    }
    // 登录状态过期
    if (data.code === 900) {
      // TODO: 清除本地token
      return Promise.reject(data)
    }
    return Promise.reject(data)
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
