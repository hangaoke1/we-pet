import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import classnames from 'classnames';

import _ from '@/lib/lodash';
import Iconfont from '@/components/Iconfont';
import GLoadMore from '@/components/GLoadMore';

import shopApi from '@/api/shop';

import Product from './components/Product';

import './index.less';

export default class ShopCenter extends Component {
  config = {
    navigationBarTitleText: '',
    disableScroll: true
  };

  state = {
    currentIndex: '',
    refresherTriggered: false,
    categoryId: '',
    petType: '', // 宠物类型
    categoryList: [],
    productList: [],
    loading: false,
    finished: false,
    pageNo: 1,
    pageSize: 10
  };

  componentDidMount() {
    this.getCategory();
  }

  // 根据分类获取商品
  getProduct() {
    const { loading, finished, pageNo, pageSize, petType, categoryId } = this.state;
    if (loading || finished) {
      return;
    }
    this.setState({
      loading: true
    });
    shopApi
      .queryProducts({
        petType,
        categoryId,
        pageNo,
        pageSize
      })
      .then((res) => {
        this.setState((state) => {
          return {
            pageNo: pageNo + 1,
            loading: false,
            finished: pageNo * pageSize >= res.totalCount ? true : false,
            productList: [ ...state.productList, ...res.items ]
          };
        });
      });
  }

  getCategory() {
    const categoryId = Number(this.$router.params.categoryId)
    shopApi
      .queryProductCategory({ pageNo: 1, pageSize: 999 })
      .then((res) => {
        // TODO: 外部点击默认进入分类
        this.setState(
          {
            categoryList: res || [],
            categoryId: categoryId || res[0].id
          },
          () => {
            this.getProduct();
          }
        );
      })
      .catch(() => {});
  }

  changeCategory(v) {
    if (this.state.categoryId === v.id) {
      return;
    }
    this.setState(
      {
        categoryId: v.id,
        loading: false,
        finished: false,
        pageNo: 1,
        productList: []
      },
      () => {
        this.getProduct();
      }
    );
  }

  changePetType(petType) {
    if (this.state.petType === petType) {
      return;
    }
    this.setState(
      {
        petType,
        loading: false,
        finished: false,
        pageNo: 1,
        productList: []
      },
      () => {
        this.getProduct();
      }
    );
  }

  onRefresherRefresh = () => {
    this.setState({
      refresherTriggered: true
    });
    const { categoryList, categoryId } = this.state;
    const currentIndex = _.findIndex(categoryList, (v) => v.id === categoryId);
    if (currentIndex > 0) {
      const preCategory = categoryList[currentIndex - 1];
      setTimeout(() => {
        this.setState(
          {
            currentIndex,
            categoryId: preCategory.id,
            refresherTriggered: false,
            loading: false,
            finished: false,
            pageNo: 1,
            productList: []
          },
          () => {
            this.getProduct();
          }
        );
      }, 300);
    } else {
      setTimeout(() => {
        this.setState({
          currentIndex,
          refresherTriggered: false
        });
      }, 300);
    }
  };

  onScrollToLower = () => {
    this.getProduct();
  };

  goSearch = () => {
    Taro.navigateTo({
      url: '/pages/search/index'
    });
  };

  render() {
    const { categoryList, categoryId, petType, refresherTriggered, productList, loading, finished, currentIndex } = this.state;
    return (
      <View className='u-shopCenter'>
        {/* 搜索头部 */}
        <View className='u-shopCenter__header' onClick={this.goSearch}>
          <View className='u-shopCenter__search flex align-center p-2'>
            <Iconfont type='iconsousuo' size='12' color='#999' />
            <Text className='text-hui ml-2'>请输入您想搜索的商品</Text>
          </View>
        </View>
        {/* 宠物种类筛选条件 */}
        <View className='u-shopCenter__filter'>
          <View
            className={classnames('u-shopCenter__filterItem', { 'u-shopCenter__filterActive': petType === '' })}
            onClick={this.changePetType.bind(this, '')}
          >
            全部
          </View>
          <View
            className={classnames('u-shopCenter__filterItem', { 'u-shopCenter__filterActive': petType === 0 })}
            onClick={this.changePetType.bind(this, 0)}
          >
            通用
          </View>
          <View
            className={classnames('u-shopCenter__filterItem', { 'u-shopCenter__filterActive': petType === 1 })}
            onClick={this.changePetType.bind(this, 1)}
          >
            狗狗
          </View>
          <View
            className={classnames('u-shopCenter__filterItem', { 'u-shopCenter__filterActive': petType === 2 })}
            onClick={this.changePetType.bind(this, 2)}
          >
            猫咪
          </View>
        </View>
        {/* 主体 */}
        <View className='u-shopCenter__body'>
          {/* 左侧分类 */}
          <View className='u-shopCenter__category flex-0'>
            {categoryList.map((v) => {
              const classStr = classnames('u-shopCenter__categoryItem', { active: v.id === categoryId });
              return (
                <View className={classStr} key={v.id} onClick={this.changeCategory.bind(this, v)}>
                  {v.categoryName}
                </View>
              );
            })}
          </View>
          {/* 右侧列表 */}
          <ScrollView
            className='u-shopCenter__list'
            scrollY
            scrollWithAnimation
            refresherEnabled
            refresherTriggered={refresherTriggered}
            onRefresherRefresh={this.onRefresherRefresh}
            onScrollToLower={this.onScrollToLower}
            refresherDefaultStyle='none'
          >
            <View className='u-refresh__tip' slot='refresher'>
              { currentIndex === 0 ? '已经到顶了哦' : '释放返回上一分类' }
            </View>
            {productList.map((v) => {
              return <Product item={v} key={v.id} />;
            })}
            {productList.length === 0 &&
            finished && (
              <View className='u-empty'>
                <Image src={require('../../images/product_empty.png')} />
                <View className='text-center'>
                  <Text className='text-hui'>还没有商品哦</Text>
                </View>
              </View>
            )}
            {loading && productList.length > 0 && <GLoadMore onClick={this.getList} finished={finished} loading={loading} />}
          </ScrollView>
        </View>
      </View>
    );
  }
}
