import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Image } from '@tarojs/components'
import { AtSwipeAction, AtInputNumber } from 'taro-ui'
import _ from '@/lib/lodash'
import { getCart } from '@/actions/cart'
import shopApi from '@/api/shop'
import RadioIcon from '../RadioIcon'

import './index.less'

class index extends Component {
  state = {
    loading: false
  }

  componentWillMount () {}

  componentDidMount () {}

  deleteAddress = () => {
    const { cartItem } = this.props
    const id = _.get(cartItem, 'productSku.id')
    if (id) {
      this.props.onDelete && this.props.onDelete(id)
    }
  }

  handleCountChange = (value) => {
    this.setState({
      loading: true
    })
    Taro.showLoading({
      title: '正在加载'
    })

    const { cartItem } = this.props
    const id = _.get(cartItem, 'productSku.id')
    shopApi
      .alterShoppingCartQuantity({
        skuId: id,
        quantity: value
      })
      .then(() => {
        this.setState({
          loading: false
        })
        Taro.hideLoading()
        getCart()
      })
      .catch((err) => {
        this.setState({
          loading: false
        })
        Taro.hideLoading()
        Taro.showToast({
          title: err.message || '操作失败',
          icon: 'none'
        })
      })
  }

  changeSelected = () => {
    const { cartItem } = this.props
    const id = _.get(cartItem, 'productSku.id')
    if (id) {
      this.props.onChange && this.props.onChange(id)
    }
  }

  goProduct = () => {
    const { cartItem } = this.props
    const productSku = cartItem.productSku
    Taro.navigateTo({
      url: `/pages/product/index?productId=${productSku.productId}&skuId=${productSku.id}`
    })
  }

  render () {
    const prefixCls = 'u-product'
    const { selected, cartItem } = this.props
    const { loading } = this.state
    const productSku = cartItem.productSku || {}
    let specs = _.get(productSku, 'specs', []).map((s) => s.name + '/' + s.value).join('/')
    return (
      <View className={prefixCls}>
        <AtSwipeAction
          onClick={this.deleteAddress.bind(this)}
          autoClose
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
            <View className='u-radio' onClick={this.changeSelected}>
              <RadioIcon selected={selected} />
            </View>
            <View className='u-content'>
              <Image className='u-img' onClick={this.goProduct} src={productSku.skuImgUrl} lazyLoad webp />
              <View className='u-info'>
                <View className='u-top' onClick={this.goProduct}>
                  <View className='u-name'>{productSku.skuName}</View>
                  <View className='u-specs'>{specs}</View>
                </View>
                <View className='u-bottom'>
                  <View className='u-price' onClick={this.goProduct}>¥ {productSku.price}</View>
                  <View className='u-count'>
                    <AtInputNumber
                      className='u-count__action'
                      min={1}
                      max={productSku.stock}
                      step={1}
                      disabled={loading}
                      value={cartItem.quantity}
                      onChange={this.handleCountChange}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </AtSwipeAction>
      </View>
    )
  }
}

index.propTypes = {
  selected: PropTypes.bool,
  cartItem: PropTypes.object,
  onChange: PropTypes.func,
  onDelete: PropTypes.func
}

index.defaultProps = {
  selected: false,
  cartItem: {}
}

export default index
