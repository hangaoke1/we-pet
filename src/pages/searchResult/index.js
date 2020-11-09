import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Iconfont from '@/components/Iconfont'
import shopApi from '@/api/shop'
import gotoLogin from '@/lib/gotoLogin'

import './index.less'

@connect(
  ({ user }) => ({
    user
  }),
  (dispatch) => ({})
)
class index extends Component {
  config = {
    navigationBarTitleText: '商品搜索'
  }

  state = {
    keyword: '',
    // 列表加载
    list: [],
    pageNo: 1,
    pageSize: 4,
    loading: false,
    finished: false
  }

  componentWillMount () {}

  componentDidMount () {}

  componentDidShow () {
    const newKeyword = Taro.getStorageSync('search_keyword')
    if (newKeyword === this.state.keyword) {
      return
    }
    this.setState(
      {
        keyword: newKeyword
      },
      () => {
        this.refresh()
      }
    )
  }

  init = () => {
    this.setState(
      {
        pageNo: 1,
        pageSize: 10,
        loading: false,
        finished: false,
        list: []
      },
      () => {
        this.loadmore()
      }
    )
  }

  refresh = () => {
    this.setState(
      {
        pageNo: 1,
        pageSize: 10,
        loading: false,
        finished: false,
        list: []
      },
      () => {
        this.loadmore()
      }
    )
  }

  loadmore = () => {
    const { loading, finished, pageNo, pageSize, keyword } = this.state
    if (loading || finished) {
      return
    }
    this.setState({
      loading: true
    })
    const params = {
      pageNo,
      pageSize,
      keyword
    }
    shopApi
      .queryProducts(params)
      .then((res) => {
        this.setState((state) => {
          return {
            pageNo: pageNo + 1,
            loading: false,
            finished: pageNo * pageSize >= res.totalCount ? true : false,
            list: [ ...state.list, ...res.items ]
          }
        })
      })
      .catch(() => {})
  }

  goSearch = () => {
    Taro.navigateTo({
      url: '/pages/search/index?from=searchResult'
    })
  }

  goProduct = (item) => {
    Taro.navigateTo({
      url: `/pages/product/index?productId=${item.productId}&skuId=${item.id}`
    })
  }

  addCart = (item, e) => {
    e.stopPropagation()
    if (!this.props.user.isLogin) {
      return gotoLogin()
    }
    Taro.showLoading({
      title: '加载中'
    })
    shopApi
      .addShoppingCart({
        skuId: item.id,
        quantity: 1
      })
      .then((res) => {
        Taro.hideLoading()
        Taro.showToast({
          title: '添加成功',
          icon: 'success'
        })
      })
      .catch((err) => {
        Taro.hideLoading()
        Taro.showToast({
          title: '添加失败',
          icon: 'none'
        })
      })
  }

  render () {
    const { list, loading, finished } = this.state
    let loadTip = ''
    if (finished) {
      loadTip = list.length === 0 ? '暂无数据' : '没有更多啦～'
    } else if (loading) {
      loadTip = '加载中...'
    } else {
      loadTip = '点击加载更多~'
    }

    return (
      <View className='u-searchResult'>
        <View className='u-header'>
          <View onClick={this.goSearch} className='u-icon'>
            <Iconfont type='iconsearch' size='20' color='#ccc' />
            <Text style={{ marginLeft: '4px' }}>搜索</Text>
          </View>
        </View>

        <ScrollView className='u-list' scrollY style={{ height: '400px' }} onScrollToLower={this.loadmore}>
          {list.map((item) => (
            <View key={item.id} className='u-product' onClick={this.goProduct.bind(this, item)}>
              <Image className='u-product__img' src={item.skuImgUrl} lazyLoad webp />
              <View className='u-product__info'>
                <View className='u-product__name'>{item.skuName}</View>
                <View className='u-product__bottom'>
                  <View className='u-product__price f-number'>¥ {item.price}</View>
                  <View className='u-product__add' onClick={this.addCart.bind(this, item)}>
                    <Iconfont type='icongouwuche' color='#fff' size='14' />
                  </View>
                </View>
              </View>
            </View>
          ))}
          <View className='u-tip' onClick={this.loadmore}>
            <Text>{loadTip}</Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default index
