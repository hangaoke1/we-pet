import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components';
import classNames from 'classnames';
import Iconfont from '@/components/Iconfont';
import GImg from '@/components/GImg';
import GImage from '@/components/GImage';
import GFloatLayout from '@/components/GFloatLayout';
import { AtInputNumber, AtButton } from 'taro-ui';
import shopApi from '@/api/shop';
import { getCart } from '@/actions/cart';
import _ from '@/lib/lodash';
import gotoLogin from '@/lib/gotoLogin';

import './index.less';

const defaultSku = {
  stock: 0,
  skuName: '此规格商品已下架',
  skuDetailImgUrl: '',
  price: '暂无价格'
};

@connect(({ user, cart }) => ({
  user,
  cart
}))
class Product extends Component {
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  config = {
    navigationBarTitleText: '商品详情'
  };

  state = {
    info: '',
    productBannerImgList: [],
    productDetailImgList: [],
    productSkuList: [],
    currentSku: {},
    choose: [],
    count: 1,
    buyNow: false,
    showParams: false,
    showSpecs: false,
    showQuick: false,
    buyLoading: false,
    scrollTop: ''
  };

  componentWillMount() {
    const params = this.$router.params;
    const skuId = params.skuId;
    Taro.showLoading();
    shopApi
      .queryProductFullInfoById({
        productId: params.productId
      })
      .then((res) => {
        Taro.hideLoading();
        const productSkuList = _.get(res, 'productSkuList', []);
        const currentSku = productSkuList.filter((sku) => sku.id == skuId)[0] || defaultSku;

        let productBannerImgList = _.get(res, 'productBannerImgList', []);
        if (productBannerImgList.length === 0) {
          productBannerImgList = productSkuList.map((item) => {
            return {
              id: item.id,
              imgUrl: item.skuImgUrl
            };
          });
        }

        let productDetailImgList = _.get(res, 'productDetailImgList', []);
        this.setState({
          info: _.cloneDeep(res),
          choose: _.cloneDeep(_.get(currentSku, 'specs', [])),
          productBannerImgList,
          productDetailImgList,
          productSkuList,
          currentSku
        });
      })
      .catch(() => {
        Taro.hideLoading();
      });
  }

  onPageScroll(e) {
    this.setState({
      scrollTop: e.scrollTop
    });
  }

  // 查询购物车
  queryShoppingCart = () => {
    shopApi.queryShoppingCart().then((res) => {
      console.log('>>> 查询购物车', res);
    });
  };

  handleBackTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0
    });
  };

  goCart = () => {
    Taro.switchTab({
      url: '/pages/cart/index'
    });
  };

  goShop = () => {
    Taro.switchTab({
      url: '/pages/shop/index'
    });
  };

  goUser = () => {
    Taro.switchTab({
      url: '/pages/user/index'
    });
  };

  doShare = () => {
    Taro.showToast({
      title: '分享成功',
      icon: 'none'
    });
  };

  setShowQuick = () => {
    this.setState({
      showQuick: true
    });
  };

  hideQuick = () => {
    this.setState({
      showQuick: false
    });
  };

  handleParamsOpen = () => {
    this.setState({
      showParams: true
    });
  };
  handleParamsClose = () => {
    this.setState({
      showParams: false
    });
  };

  handleSpecsOpen = (buyNow) => {
    this.setState({
      showSpecs: true,
      buyNow
    });
  };

  handleSpecsClose = () => {
    this.setState({
      showSpecs: false,
      count: 1
    });
  };

  handleCountChange = (value) => {
    this.setState({
      count: value
    });
  };

  changeChoose = (type, value) => {
    this.setState((state) => {
      // 根据choose 定位sku
      let newChoose = state.choose.map((item) => {
        if (item.type === type) {
          item.value = value;
        }
        return item;
      });
      let choosedSku = state.productSkuList.filter((sku) => {
        const mapA = {};
        const mapB = {};
        const skuSpecs = sku.specs;
        skuSpecs.forEach((item) => {
          mapA[item.type] = item.value;
        });
        newChoose.forEach((item) => {
          mapB[item.type] = item.value;
        });
        return _.isEqual(mapA, mapB);
      })[0];
      return {
        currentSku: choosedSku || defaultSku,
        choose: newChoose
      };
    });
  };

  // 立即购买
  buyNow = () => {
    console.log(this.setState.currentSku);
  };

  // 加入购物车
  addToCart = () => {
    if (!this.props.user.isLogin) {
      return gotoLogin();
    }

    // 立即购买
    if (this.state.buyNow) {
      Taro.setStorageSync('order_product', [
        {
          quantity: this.state.count,
          price: this.state.currentSku.price * this.state.count,
          productSku: this.state.currentSku,
          id: this.state.currentSku.id
        }
      ]);
      Taro.redirectTo({
        url: '/pages/confirmOrder/index?cartFlag=0'
      });
      return;
    }

    if (this.setState.buyLoading) {
      return;
    }
    const { currentSku, count } = this.state;
    this.setState({
      buyLoading: true
    });
    shopApi
      .addShoppingCart({
        skuId: currentSku.id,
        quantity: +count
      })
      .then(() => {
        this.setState({
          buyLoading: false,
          showSpecs: false
        });
        Taro.showToast({
          title: '添加成功',
          icon: 'success'
        });
        getCart();
      })
      .catch((error) => {
        this.setState({
          buyLoading: false
        });
        Taro.showToast({
          title: error.messsage || '添加购物车失败',
          icon: 'none'
        });
      });
  };

  render() {
    const {
      info,
      showParams,
      showSpecs,
      scrollTop,
      showQuick,
      choose,
      productBannerImgList,
      productDetailImgList,
      currentSku,
      buyLoading,
      buyNow
    } = this.state;
    const { cart } = this.props;
    const prefixCls = 'u-product';
    const product = _.get(info, 'product', {});
    const productCategory = _.get(info, 'productCategory', {});

    let choosedSku = currentSku;

    return (
      <View className={prefixCls}>
        {/* 商品头部 */}
        {showQuick ? (
          <View className='u-quick'>
            <View className='u-quick__content'>
              <View className='u-quick__title'>
                <Text>功能直达</Text>
                <Iconfont onClick={this.hideQuick} type='iconshanchu' color='#fff' size='20' />
              </View>
              <View className='u-quick__list'>
                <View className='u-quick__item' onClick={this.goShop}>
                  <Iconfont type='iconicon_shangcheng-xian' color='#fff' size='20' />
                  <View className='u-quick__name'>商城</View>
                </View>
                <View className='u-quick__item' onClick={this.goUser}>
                  <Iconfont type='iconicon_yonghu-xian' color='#fff' size='20' />
                  <View className='u-quick__name'>我的</View>
                </View>
                <View className='u-quick__item' onClick={this.goCart}>
                  <Iconfont type='iconicon_gouwuche-xian' color='#fff' size='20' />
                  <View className='u-quick__name'>购物车</View>
                </View>
                <View className='u-quick__item' onClick={this.doShare}>
                  <Iconfont type='iconfenxiang' color='#fff' size='20' />
                  <View className='u-quick__name'>分享</View>
                </View>
              </View>
            </View>
            <View className='u-quick__mask' onClick={this.hideQuick} />
          </View>
        ) : (
          <View className='u-header'>
            <View className='u-icon' onClick={this.goCart}>
              <Iconfont type='icongouwuche1' color='#fff' size='18' />
              <View className='u-count__icon bg-red2 f-number'>{cart.totalCount}</View>
            </View>
            <View className='u-icon' onClick={this.setShowQuick}>
              <Iconfont type='icongengduo' color='#fff' size='18' />
            </View>
          </View>
        )}

        {/* 商品轮播 */}
        <View className='u-swiper__wrap'>
          <Swiper
            className='u-swiper'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots
            autoplay={false}
          >
            {productBannerImgList.map((image) => (
              <SwiperItem key={image.id}>
                <GImage my-class='u-item' src={image.imgUrl} />
              </SwiperItem>
            ))}
          </Swiper>
        </View>

        {/* 商品基本信息 */}
        <View className='u-price'>
          <View className='u-price__left'>
            <Text className='u-price__unit'>¥</Text>
            <Text className='u-price__val f-number'>{choosedSku.price}</Text>
            {choosedSku && choosedSku.originPrice && (
              <Text className='line-through text-hui ml-2 font-s-28 f-number'>¥ {choosedSku.originPrice}</Text>
            )}
          </View>
          <View className='u-price__right'>
            <Iconfont type='iconiconfontfenxiang' color='#ccc' size='20' />
          </View>
        </View>
        <View className='u-name'>{choosedSku.skuName || product.name}</View>
        <View className='u-desc'>{product.detail}</View>
        
        {/* 商品参数 */}
        <View className='u-params'>
          <View className='u-params__item' onClick={this.handleParamsOpen}>
            <View className='u-params__label'>参数</View>
            <View className='u-params__val'>
              <Text>品牌 产地...</Text>
              <Iconfont type='iconarrowright' color='#333' size='14' />
            </View>
          </View>
          <View className='u-params__item' onClick={this.handleSpecsOpen.bind(this, false)}>
            <View className='u-params__label'>选择</View>
            <View className='u-params__val'>
              <Text>已选择 {choose.map((item) => item.value).join(' ')}</Text>
              <Iconfont type='iconarrowright' color='#333' size='14' />
            </View>
          </View>
        </View>

        {/* 商品详情图片 */}
        <View className='u-imgs'>
          {productDetailImgList.map((v) => {
            return <GImg key={v.id} maxWidth={750} force mode='aspectFit' src={v.imgUrl} />;
          })}

          {!productDetailImgList.length && (
            <View className='u-empty'>
              <Image src={require('../../images/product_empty.png')} />
              <View className='text-center font-s-32'>
                <Text className='text-hui'>暂无详情</Text>
              </View>
            </View>
          )}
        </View>

        {/* 底部操作 */}
        <View className='u-footer'>
          <View className='flex align-center'>
            <View className='u-footer__item' onClick={this.goCart}>
              <Iconfont type='iconicon_gouwuche-xian' color='#707070' size='26' />
              <View className='u-footer__item-count bg-red2 f-number'>{cart.totalCount}</View>
            </View>
          </View>
          <View className='flex align-center'>
            <AtButton
              loading={buyLoading}
              onClick={this.handleSpecsOpen.bind(this, false)}
              className='u-footer__btn u-footer__btn__add'
              disabled={choosedSku.stock === 0}
              type='primary'
              circle
            >
              加入购物车
            </AtButton>
            <AtButton
              className='u-footer__btn'
              disabled={choosedSku.stock === 0}
              type='primary'
              circle
              onClick={this.handleSpecsOpen.bind(this, true)}
            >
              立即购买
            </AtButton>
          </View>
        </View>

        <View
          className={classNames({
            'u-back': true,
            'u-back__active': scrollTop > 100
          })}
          onClick={this.handleBackTop}
        >
          <Iconfont type='iconfanhuidingbu' color='#333' size='12' />
          <Text>顶部</Text>
        </View>

        <GFloatLayout title='产品参数' isOpened={showParams} onClose={this.handleParamsClose}>
          <View className='u-info'>
            <View className='u-cel'>
              <View className='u-label'>品牌</View>
              <View className='u-val'>{product.brand}</View>
            </View>

            <View className='u-cel'>
              <View className='u-label'>商品分类</View>
              <View className='u-val'>{productCategory.categoryName}</View>
            </View>

            <View className='u-cel'>
              <View className='u-label'>原产地</View>
              <View className='u-val'>{product.address}</View>
            </View>

            <View className='u-ok' onClick={this.handleParamsClose}>
              完成
            </View>
          </View>
        </GFloatLayout>

        <GFloatLayout title='' isOpened={showSpecs} onClose={this.handleSpecsClose}>
          <View className='u-sku'>
            <View className='u-sku__top'>
              <Image className='u-sku__img' src={choosedSku.skuImgUrl} lazyLoad webp />
              <View className='u-sku__info'>
                <View className='u-sku__name'>{choosedSku.skuName}</View>
                <View className='u-sku__stock f-number'>库存{choosedSku.stock || 0}件</View>
                <View className='u-sku__price f-number'>¥ {choosedSku.price}</View>
              </View>
            </View>

            <View className='u-sku__specs'>
              {(product.specs || []).map((specs) => {
                const type = specs.type;
                const chooseItem = choose.filter((item) => item.type === type)[0];
                return (
                  <View key={specs.type}>
                    <View className='u-specs__label'>{specs.name}</View>
                    <View className='u-specs__list'>
                      {specs.val.map((v) => {
                        return (
                          <View
                            onClick={this.changeChoose.bind(this, specs.type, v)}
                            key={v}
                            className={classNames({
                              'u-specs__item': true,
                              'u-specs__active': chooseItem && v === chooseItem.value
                            })}
                          >
                            {v}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>

            <View className='u-sku__count'>
              <View className='u-count__label'>购买数量</View>
              <View className='u-count__action'>
                <AtInputNumber
                  min={choosedSku.stock > 0 ? 1 : 0}
                  max={choosedSku.stock}
                  step={1}
                  value={choosedSku.stock > 0 ? this.state.count : 0}
                  onChange={this.handleCountChange}
                />
              </View>
            </View>
            <AtButton
              loading={buyLoading}
              onClick={this.addToCart}
              className='u-addcart'
              disabled={choosedSku.stock === 0}
              type='primary'
              circle
            >
              {buyNow ? '立即购买' : '加入购物车'}
            </AtButton>
          </View>
        </GFloatLayout>
      </View>
    );
  }
}

export default Product;
