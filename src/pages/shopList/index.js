import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import ProductNew from '@/components/ProductNew';
import shopApi from '@/api/shop';
import GLoadMore from '@/components/GLoadMore';

import './index.less';

export default class ShopList extends Component {
  config = {
    navigationBarTitleText: '商品列表',
    backgroundColor: '#F2F3F4'
  };

  state = {
    list: [],
    loading: false,
    finished: false,
    pageNo: 1,
    pageSize: 10
  };

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: this.$router.params.name || '商品列表'
    });
    this.getList();
  }

  onReachBottom() {
    this.getList();
  }

  getList = () => {
    const { loading, finished, pageNo, pageSize } = this.state;
    if (loading || finished) {
      return;
    }
    this.setState({
      loading: true
    });

    shopApi
      .queryProducts({
        pageSize,
        pageNo,
        categoryId: Number(this.$router.params.categoryId),
        hotFlag: Number(this.$router.params.hotFlag),
        keyword: this.$router.params.keyword
      })
      .then((res) => {
        this.setState((state) => {
          return {
            pageNo: pageNo + 1,
            loading: false,
            finished: pageNo * pageSize >= res.totalCount ? true : false,
            list: [ ...state.list, ...res.items ]
          };
        });
      })
      .catch(() => {});
  };
  render() {
    const { list, loading, finished } = this.state;
    return (
      <View className='u-shopList'>
        <View className='flex justify-between flex-wrap p-2'>
          {list.map((v) => {
            return <ProductNew info={v} key={v.id} />;
          })}
        </View>
        {list.length === 0 && finished ? (
          <View className='u-empty'>
            <Image src={require('../../images/product_empty.png')} />
            <View className='text-center font-s-32'>
              <Text className='text-hui'>还没有商品哦</Text>
            </View>
          </View>
        ) : (
          <GLoadMore onClick={this.getList} finished={finished} loading={loading} />
        )}
      </View>
    );
  }
}
