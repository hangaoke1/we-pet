import Taro, { Component } from '@tarojs/taro'
import { View, Picker, CoverView } from '@tarojs/components'
import { AtSwitch, AtInput, AtButton } from 'taro-ui'
import Iconfont from '@/components/Iconfont'
import apiAddress from '@/api/address'
import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '修改地址',
    backgroundColor: '#f3f4f8'
  }

  state = {
    id: '',
    contact: '',
    mobile: '',
    detail: '',
    defaultFlag: false,
    region: []
  }

  componentWillMount () {
    const address = Taro.getStorageSync('EDIT_ADDRESS')
    this.setState({
      id: address.id,
      contact: address.contact,
      mobile: address.mobile,
      detail: address.detail,
      defaultFlag: !!address.defaultFlag,
      region: [address.province, address.city, address.area]
    })
  }

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

  handleUpdate = () => {
    const { contact, mobile, detail, region, defaultFlag, id } = this.state
    const enable = contact && mobile && detail && region.length
    if (enable) {
      let params = {
        id,
        contact,
        mobile,
        detail,
        province: region[0],
        city: region[1],
        area: region[2],
        defaultFlag: defaultFlag ? 1 : 0
      }
      console.log('>>> 地址入参', params)
      apiAddress.updateUserAddress(params).then(() => {
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
              <AtInput title='所在地区' type='text' placeholder='请选择地址' value={this.state.region.join(' ')}></AtInput>
              <View className='u-arrow'><Iconfont type='iconarrowright' size='20'></Iconfont></View>
              <CoverView className='u-cover' />
            </View>
          </Picker>

          <AtInput title='详细地址' type='text' placeholder='如道路、小区、楼号' value={detail} onChange={this.handleChange.bind(this, 'detail')} />
        </View>

        <View className='u-two'>
          <AtSwitch title='设为默认地址' checked={defaultFlag} onChange={this.handleChange.bind(this, 'defaultFlag')} />
        </View>

        <View className='u-action' onClick={this.handleUpdate}>
          <AtButton full type='primary' disabled={!enable}>
            保存并使用
          </AtButton>
        </View>
      </View>
    )
  }
}

export default index
