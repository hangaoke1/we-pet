import Taro, { Component } from '@tarojs/taro'
import { View, Picker, CoverView } from '@tarojs/components'
import { AtSwitch, AtInput, AtButton } from 'taro-ui'
import apiAddress from '@/api/address'

import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '新增地址',
    backgroundColor: '#f3f4f8'
  }

  state = {
    contact: '',
    mobile: '',
    detail: '',
    defaultFlag: false,
    region: []
  }

  componentWillMount () {}

  componentDidMount () {}

  change = (e) => {
    this.setState({
      region: e.detail.value
    })
  }

  handleChange = (key, e) => {
    this.setState({
      [key]: e
    })
  }

  handleAdd = () => {
    const { contact, mobile, detail, region, defaultFlag } = this.state
    const enable = contact && mobile && detail && region.length
    if (enable) {
      let params = {
        contact,
        mobile,
        detail,
        province: region[0],
        city: region[1],
        area: region[2],
        defaultFlag: defaultFlag ? 1 : 0
      }
      apiAddress.insertUserAddress(params).then(res => {
        Taro.showToast({
          title: '添加完成',
          icon: 'none'
        }).then(() => {
          Taro.navigateBack()
        })
      }).catch(err => {
        Taro.showToast({
          title: err.message,
          icon: 'none'
        })
      })
    }
  }

  render () {
    const prefixCls = 'u-addAddress'
    const { contact, mobile, detail, region, defaultFlag } = this.state
    const enable = contact && mobile && detail && region.length

    return (
      <View className={prefixCls}>
        <View className='u-one'>
          <AtInput title='收货人' type='text' placeholder='姓名' value={contact} onChange={this.handleChange.bind(this, 'contact')} />
          <AtInput title='电话' type='number' placeholder='手机号码' value={mobile} onChange={this.handleChange.bind(this, 'mobile')} />

          <Picker mode='region' onChange={this.change} value={region} >
            <View className='u-picker'>
              <AtInput title='所在地区' type='text' placeholder='请选择地址' value={this.state.region.join(' ')} />
              <CoverView className='u-cover' />
            </View>
          </Picker>

          <AtInput title='详细地址' type='text' placeholder='如道路、小区、楼号' value={detail} onChange={this.handleChange.bind(this, 'detail')} />
        </View>

        <View className='u-two'>
          <AtSwitch title='设为默认地址' color='#FF7013' checked={defaultFlag} onChange={this.handleChange.bind(this, 'defaultFlag')} />
        </View>

        <View className='u-action'>
          <AtButton full type='primary' disabled={!enable} onClick={this.handleAdd}>
            保存并使用
          </AtButton>
        </View>
      </View>
    )
  }
}

export default index
