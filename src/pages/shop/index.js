/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-closing-bracket-location */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import classNames from 'classnames'
import { AtDrawer, AtButton } from 'taro-ui'
import Iconfont from '@/components/Iconfont'
import Product from '@/components/Product'
import ProductPro from '@/components/ProductPro'
import shopApi from '@/api/shop'
import { getCart } from '@/actions/cart'

import './index.less'

class index extends Component {
  config = {
    navigationBarTitleText: '商城'
  }

  state = {
    // 1列表 2卡片
    showType: 1,
    // 1狗狗 2猫猫
    petType: 1,
    // 1品牌 2地址
    subType: '',
    subList: [],
    // 品牌
    brand: '',
    brandList: [],
    // 产地
    address: '',
    addressList: [],
    min: '',
    max: '',
    tMin: '',
    tMax: '',
    // 左侧商品类型
    categoryId: 0,
    categoryList: [],
    // 列表加载
    list: [],
    pageNo: 1,
    pageSize: 10,
    loading: false,
    finished: false,
    showDrawer: false
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {}

  componentDidMount () {
    shopApi.queryProductCategory().then((res) => {
      this.setState(
        {
          categoryList: res || []
        },
        () => {
          this.init()
        }
      )
    })
  }

  componentDidShow () {
    getCart()
  }

  changeShowType = () => {
    const { showType } = this.state
    this.setState({
      showType: showType === 1 ? 2 : 1
    })
  }

  changePetType = () => {
    const { petType } = this.state
    this.setState(
      {
        petType: petType === 1 ? 2 : 1,
        list: []
      },
      () => {
        this.init()
      }
    )
  }

  changeCategoryId = (categoryId) => {
    this.setState(
      {
        categoryId
      },
      () => {
        this.init()
      }
    )
  }

  goSearch = () => {
    Taro.showToast({
      title: '前往搜索',
      icon: 'none'
    })
  }

  init = () => {
    this.setState(
      {
        list: [],
        pageNo: 1,
        pageSize: 10,
        brand: '',
        // brandList: [],
        address: '',
        // addressList: [],
        subType: '',
        subList: [],
        min: '',
        max: '',
        loading: false,
        finished: false
      },
      () => {
        this.getFilter()
        this.loadmore()
      }
    )
  }

  refresh = () => {
    this.setState(
      {
        list: [],
        pageNo: 1,
        pageSize: 10,
        finished: false,
        loading: false
      },
      () => {
        // 查询商品
        this.loadmore()
      }
    )
  }

  getFilter = () => {
    const { categoryId, petType } = this.state
    shopApi
      .getFilter({
        categoryId,
        petType
      })
      .then((res) => {
        // 查询结果
        console.log('>>> 品牌、地址', res)
        this.setState({
          brandList: res.brandList,
          addressList: res.addressList
        })
      })
  }

  loadmore = () => {
    const { loading, finished, brand, address, categoryId, pageNo, pageSize, list, petType, min, max } = this.state
    if (loading || finished) {
      return
    }
    this.setState({
      loading: true
    })
    const params = {
      petType,
      brand,
      address,
      categoryId,
      pageNo,
      pageSize,
      min,
      max
    }
    // console.log('>>> 查询参数', params)
    shopApi.queryProducts(params).then((res) => {
      console.log('>>> 查询商品结果', res)
      this.setState((state) => {
        return {
          loading: false,
          finished: pageNo * pageSize > res.totalCount ? true : false,
          list: [ ...state.list, ...res.items ]
        }
      })
    })
  }

  selectSubType = (val) => {
    const { subType, brand, address } = this.state
    if (subType === 1) {
      if (brand && brand !== val) {
        return
      }
      this.setState(
        (state) => ({
          subType: state.brand === val ? 1 : '',
          brand: state.brand === val ? '' : val
        }),
        () => {
          this.refresh()
        }
      )
    }
    if (subType === 2) {
      if (address && address !== val) {
        return
      }
      this.setState(
        (state) => ({
          subType: state.address === val ? 2 : '',
          address: state.address === val ? '' : val
        }),
        () => {
          this.refresh()
        }
      )
    }
  }

  changSubType = (type) => {
    const { subType, brandList, addressList } = this.state
    if (type === subType) {
      this.setState({
        subType: ''
      })
    } else {
      this.setState({
        subType: type,
        subList: type === 1 ? brandList : addressList
      })
    }
  }

  hideSubType = () => {
    this.setState({
      subType: ''
    })
  }

  handleShowDrawer = () => {
    this.setState((state) => ({
      showDrawer: true,
      tMin: state.min,
      tMax: state.max,
      subType: ''
    }))
  }
  onDrawerClose = () => {
    this.setState(() => ({
      showDrawer: false
    }))
  }

  handleMinChange = (e) => {
    const value = e.target.value
    this.setState({
      tMin: value
    })
  }

  handleMaxChange = (e) => {
    const value = e.target.value
    this.setState({
      tMax: value
    })
  }

  resetPrice = () => {
    this.setState(
      {
        tMax: '',
        tMin: '',
        min: '',
        max: ''
      },
      () => {
        this.refresh()
      }
    )
  }

  changePrice = () => {
    this.setState(
      (state) => ({
        max: state.tMax,
        min: state.tMin,
        showDrawer: false
      }),
      () => {
        this.refresh()
      }
    )
  }

  preventTouchMove = (e) => {
    e.stopPropagation()
    return
  }

  render () {
    const prefixCls = 'u-shop'
    const {
      petType,
      categoryList,
      categoryId,
      showType,
      finished,
      loading,
      brand,
      subType,
      subList,
      address,
      list,
      showDrawer,
      tMin,
      tMax,
      min,
      max
    } = this.state
    let loadTip = ''
    if (finished) {
      loadTip = '没有更多啦～'
    } else if (loading) {
      loadTip = '加载中...'
    } else {
      loadTip = '点击加载更多~'
    }
    return (
      <View className={prefixCls}>
        <View className='u-header'>
          <View className='u-type'>
            <View className='u-type__item' onClick={this.changePetType}>
              猫猫
            </View>
            <View className='u-type__item' onClick={this.changePetType}>
              狗狗
            </View>
            <View
              className={classNames({
                'u-type__dot': true,
                'u-type__active': petType === 1
              })}
            />
          </View>
          <View className='u-search' onClick={this.goSearch}>
            <Iconfont type='iconsearch' size='18' color='#333' />
            <Text className='u-search__text'>搜索</Text>
          </View>
        </View>

        <View className='u-content'>
          <View className='u-category'>
            {categoryList.map((item) => (
              <View
                key={item.id}
                onClick={this.changeCategoryId.bind(this, item.categoryId)}
                className={classNames({
                  'u-category__item': true,
                  'u-category__active': item.categoryId === categoryId
                })}
              >
                {item.categoryName}
              </View>
            ))}
          </View>

          <View className='u-info'>
            <Image className='u-banner' src='https://hgkcdn.oss-cn-shanghai.aliyuncs.com/pet/banner2.jpeg' lazyLoad webp />

            <View className='u-filter'>
              <View className='u-filter__left'>
                <View
                  className={classNames({
                    'u-filter__brand': true,
                    'u-filter__selected': !!brand
                  })}
                  onClick={this.changSubType.bind(this, 1)}
                >
                  <Text style={{ marginLeft: '10px' }}>品牌</Text>
                  {subType === 1 ? (
                    <Iconfont my-class='u-filter__icon' type='iconwebicon216' size={10} />
                  ) : (
                    <Iconfont my-class='u-filter__icon' type='iconwebicon215' size={10} />
                  )}
                </View>
                <View
                  className={classNames({
                    'u-filter__brand': true,
                    'u-filter__selected': !!address
                  })}
                  onClick={this.changSubType.bind(this, 2)}
                >
                  <Text style={{ marginLeft: '10px' }}>产地</Text>
                  {subType === 2 ? (
                    <Iconfont my-class='u-filter__icon' type='iconwebicon216' size={10} />
                  ) : (
                    <Iconfont my-class='u-filter__icon' type='iconwebicon215' size={10} />
                  )}
                </View>
              </View>
              <View className='u-filter__right'>
                <View className='u-filter__showtype' onClick={this.changeShowType}>
                  {showType === 1 ? (
                    <Iconfont type='iconliebiao1' size='16' />
                  ) : (
                    <Iconfont type='iconshebeizhongleifenbu' size='16' />
                  )}
                </View>
                <View
                  className={classNames({
                    'u-filter__selected': !!(min || max)
                  })}
                  onClick={this.handleShowDrawer}
                >
                  筛选
                </View>
              </View>
              {subType && (
                <View className='u-filter__wrap'>
                  <View className='u-filter__mask' onTouchMove={this.preventTouchMove} onClick={this.hideSubType} />
                  <View className='u-filter__ctx'>
                    <View className='u-filter__list'>
                      {subList.map((item) => (
                        <View
                          key={item}
                          className={classNames({
                            'u-filter__item': true,
                            'u-filter__active': subType === 1 ? item === brand : item === address
                          })}
                          onClick={this.selectSubType.bind(this, item)}
                        >
                          {item}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>

            <ScrollView className='u-list' scrollY style={{ height: '400px' }} onScrollToLower={this.loadmore}>
              {showType === 1 ? (
                <View className='u-style-one'>{list.map((item) => <Product key={item.id} item={item} />)}</View>
              ) : (
                <View className='u-style-two'>{list.map((item) => <ProductPro key={item.id} item={item} />)}</View>
              )}
              <View className='u-tip' onClick={this.loadmore}>
                <Text>{loadTip}</Text>
              </View>
            </ScrollView>
          </View>
        </View>

        <AtDrawer show={showDrawer} onClose={this.onDrawerClose} right mask>
          <View className='u-drawer__title'>价格区间(元)</View>
          <View className='u-drawer'>
            <Input value={tMin} className='u-input' type='number' placeholder='最低价' onChange={this.handleMinChange} />
            <View className='u-line' />
            <Input value={tMax} className='u-input' type='number' placeholder='最高价' onChange={this.handleMaxChange} />
          </View>
          <View className='u-drawer__action'>
            <AtButton className='u-drawer__btn' type='secondary' size='small' onClick={this.resetPrice}>
              重置
            </AtButton>
            <AtButton className='u-drawer__btn' type='primary' size='small' onClick={this.changePrice}>
              确认
            </AtButton>
          </View>
        </AtDrawer>
      </View>
    )
  }
}

export default index
