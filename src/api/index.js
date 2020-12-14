import Taro from '@tarojs/taro'
import config from '@/config'
import _ from '@/lib/lodash'
import token from '@/lib/token'

// 请求拦截
const requestInterceptors = (opts) => {
  const apiPrefix = config.server
  // 请求url拼接
  if (!/http/.test(opts.url)) {
    opts.url = apiPrefix + opts.url
  }

  // 默认参数
  const ShopId = _.get(Taro.getStorageSync('currentStore'), 'id');
  const Authorization = token.get() || ''
  const header = {}
  if (Authorization) {
    header.Authorization = Authorization
  }
  if (ShopId) {
    header.ShopId = ShopId
  }
  opts.header = header
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
