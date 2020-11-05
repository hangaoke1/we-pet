import Taro from '@tarojs/taro'

export default function (phone) {
  Taro.makePhoneCall({
    phoneNumber: phone
  }).catch(() => {})
}
