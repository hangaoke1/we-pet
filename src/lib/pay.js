/**
 * 唤起微信支付
 */
import MD5 from 'js-md5'
import Taro from '@tarojs/taro'
import config from '@/config'

function requestPaymentPro (params) {
  const timeStamp = parseInt(Date.now()/ 1000) + ''
  const nonceStr = params.nonceStr
  const paySign = MD5(`appId=${config.appId}&nonceStr=${nonceStr}&package=${params.package}&signType=MD5&timeStamp=${timeStamp}&key=${config.payKey}`)

  return new Promise((resolve, reject) => {
    Taro.requestPayment({
      nonceStr,
      package: params.package,
      paySign,
      timeStamp,
      signType: 'MD5',
      success (res) {
        resolve(res)
      },
      fail (res) {
        reject(res)
      }
    })
  })
}

export default requestPaymentPro
