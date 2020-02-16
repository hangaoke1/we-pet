import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtSwipeAction } from 'taro-ui'
import Iconfont from '@/components/Iconfont'
import { getPet } from '@/actions/pet'
import getPetYear from '@/lib/getPetYear'
import petApi from '@/api/pet'
import defaultImg from '@/lib/defaultImg'

import './index.less'

@connect(
  ({ pet }) => ({
    pet
  }),
  (dispatch) => ({})
)
class index extends Component {
  config = {
    navigationBarTitleText: '我的爱宠'
  }

  componentWillMount () {}

  componentDidShow () {
    getPet()
  }

  deletePet = (item) => {
    Taro.showModal({
      title: '提示',
      content: `确定要删除${item.petName}吗？`
    }).then((res) => {
      if (res.confirm) {
        Taro.showLoading()
        petApi
          .removePetRecord({
            id: item.id
          })
          .then(() => {
            Taro.hideLoading()
            getPet()
          })
          .catch((error) => {
            Taro.hideLoading()
            Taro.showToast({
              title: error.message || '删除失败',
              icon: 'none'
            })
          })
      }
    })
  }

  goAddPet = () => {
    Taro.navigateTo({
      url: '/pages/petDetail/index'
    })
  }

  goUpdatePet = (item) => {
    Taro.setStorageSync('pet_update', item)
    Taro.navigateTo({
      url: '/pages/petDetail/index?id=' + item.id
    })
  }

  render () {
    const { pet } = this.props
    return (
      <View className='u-pet'>
        <View className='u-list'>
          {pet.list.map((item) => (
            <View className='u-item__wrap' key={item.id}>
              <AtSwipeAction
                autoClose
                onClick={this.deletePet.bind(this, item)}
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
                  <Image class='u-item__img' src={item.avatar || defaultImg.petAvatar} lazyLoad webp />
                  <View className='u-item__info'>
                    <View className='u-item__name'>
                      <Text>{item.petName}</Text>
                      <View
                        className='u-item__sex'
                        style={{
                          backgroundColor: item.sex == 0 ? '#40a9ff' : '#ff7875'
                        }}
                      >
                        <Iconfont type={item.sex == 0 ? 'iconnanxing' : 'iconnvxing'} color='#fff' size='12' />
                      </View>
                    </View>
                    <View className='u-item__desc'>
                      {item.petBreed} {item.bearFlag === 0 ? '未绝育' : '已绝育'} {getPetYear(item.birthday)}
                    </View>
                    <View className='u-item__edit' onClick={this.goUpdatePet.bind(this, item)}>
                      <Iconfont type='iconbianji2' color='#333' size='16' />
                    </View>
                  </View>
                </View>
              </AtSwipeAction>
            </View>
          ))}
        </View>
        <View className='u-action' onClick={this.goAddPet}>
          + 添加宠物档案
        </View>
      </View>
    )
  }
}

export default index
