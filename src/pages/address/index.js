/* eslint-disable react/jsx-closing-bracket-location */
import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text } from '@tarojs/components'
import Iconfont from '@/components/Iconfont'
import apiAddress from '@/api/address'
import { AtSwipeAction } from 'taro-ui'

import { getAddress, setAddress } from '@/actions/address'
import './index.less'

@connect(
  ({ address }) => ({
    address
  }),
  (dispatch) => ({})
)
class index extends Component {
  config = {
    navigationBarTitleText: '我的收货地址',
    backgroundColor: '#f3f4f8'
  }

  state = {}

  componentWillMount () {}

  componentDidMount () {}

  componentDidShow () {
    getAddress()
  }

  getWechatAddress = () => {
    const vm = this
    Taro.getSetting({
      success (res) {
        if (!res.authSetting['scope.address']) {
          Taro.authorize({
            scope: 'scope.address',
            success () {
              Taro.chooseAddress()
                .then((address) => {
                  console.log('>>> 收货地址', address)
                  vm.insertUserAddress(address)
                })
                .catch(() => {})
            }
          })
        } else {
          Taro.chooseAddress()
            .then((address) => {
              console.log('>>> 收货地址', address)
              vm.insertUserAddress(address)
            })
            .catch(() => {})
        }
      }
    })
  }

  // 从微信获取地址并添加
  insertUserAddress = (address) => {
    // TODO: 判断地址是否重复
    apiAddress
      .insertUserAddress({
        province: address.provinceName,
        city: address.cityName,
        area: address.countyName,
        detail: address.detailInfo,
        contact: address.userName,
        mobile: address.telNumber,
        defaultFlag: 0
      })
      .then((res) => {
        getAddress()
      })
      .catch((err) => {
        Taro.showToast({
          title: err.message,
          icon: 'none'
        })
      })
  }

  deleteAddress = (item) => {
    Taro.showModal({
      title: '提示',
      content: '是否删除当前地址',
      confirmColor: '#ffdb47'
    }).then((res) => {
      if (res.confirm) {
        Taro.showLoading()
        apiAddress
          .deleteUserAddress({
            id: item.id
          })
          .then(() => {
            getAddress()
          })
          .catch((err) => {
            Taro.showToast({
              title: err.message,
              icon: 'none'
            })
          })
          .finally(() => {
            Taro.hideLoading()
          })
      }
    })
  }

  addAddress = () => {
    Taro.navigateTo({
      url: '/pages/addressAdd/index'
    })
  }

  editAddress = (item) => {
    Taro.setStorageSync('EDIT_ADDRESS', item)
    Taro.navigateTo({
      url: '/pages/addressUpdate/index'
    })
  }

  hanldeSelectAddress = (id) => {
    if (this.$router.params.from === 'confirmOrder') {
      setAddress(id)
      Taro.navigateBack()
    }
  }

  render () {
    const prefixCls = 'u-address'
    const { address } = this.props
    const list = address.list

    return (
      <View className={prefixCls}>
        <View className='u-header' onClick={this.getWechatAddress}>
          <View className='u-header__left'>
            <Iconfont type='iconweixinzhifu' color='#84c83e' size='16' />
            <Text className='u-header__text'>获取微信收货地址</Text>
          </View>
          <Iconfont type='iconarrowright' color='#ccc' size='16' />
        </View>

        <View className='u-list'>
          {list.map((item) => (
            <View className='u-item__wrap' key={item.id}>
              <AtSwipeAction
                autoClose
                onClick={this.deleteAddress.bind(this, item)}
                options={[
                  {
                    text: '删除',
                    style: {
                      backgroundColor: '#FF4949'
                    }
                  }
                ]}
              >
                <View className='u-item'>
                  <View className='u-left' onClick={this.hanldeSelectAddress.bind(this, item.id)}>
                    <View>
                      <Text className='u-form__name'>{item.contact}</Text>
                      <Text className='u-form__tel'>{item.mobile}</Text>
                    </View>
                    <View className='u-form__detail'>
                      {item.province}
                      {item.city}
                      {item.area} {item.detail}
                    </View>
                    {item.defaultFlag && <View className='u-default'>默认</View>}
                  </View>
                  <View className='u-right' onClick={this.editAddress.bind(this, item)}>
                    <Iconfont type='iconbianji2' size='20' color='#999' />
                  </View>
                </View>
              </AtSwipeAction>
            </View>
          ))}
        </View>

        <View className='u-action' onClick={this.addAddress}>
          + 新增地址
        </View>
      </View>
    )
  }
}

export default index
