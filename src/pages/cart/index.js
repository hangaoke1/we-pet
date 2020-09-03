import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View, Text } from "@tarojs/components";
import { getCart } from "@/actions/cart";
import shopApi from "@/api/shop";
import { AtButton } from "taro-ui";
import _ from "@/lib/lodash";
import GLogin from "@/components/GLogin";
import ProductItem from "./components/ProductItem";
import RadioIcon from "./components/RadioIcon";

import "./index.less";

@connect(({ cart, user }) => ({
  cart,
  user
}))
class Cart extends Component {
  config = {
    navigationBarTitleText: "购物车",
    backgroundTextStyle: "dark",
    backgroundColor: "#f3f4f8"
  };

  state = {
    choosed: [],
    edit: false
  };

  componentWillMount() {}

  componentDidMount() {}

  componentDidShow() {
    this.init();
  }

  init = () => {
    getCart().then(() => {
      const { cart } = this.props;
      const allIds = _.get(cart, "items", []).map(sku => sku.productSku.id);
      if (!this.hasInit) {
        this.hasInit = true;
        this.allIds = allIds;
        this.setState({
          choosed: allIds
        });
      } else {
        const newIds = allIds.filter(id => !this.allIds.includes(id));
        this.allIds = allIds;
        this.setState(state => {
          return {
            choosed: _.uniq([...state.choosed, ...newIds])
          };
        });
      }
    });
  };

  selectChange = id => {
    this.setState(state => {
      const choosed = state.choosed;
      let newChoosed = [];
      if (choosed.includes(id)) {
        newChoosed = [...choosed.filter(v => v !== id)];
      } else [(newChoosed = [id, ...choosed])];
      return {
        choosed: newChoosed
      };
    });
  };

  handleDeleteChoosed = () => {
    const choosed = this.state.choosed;
    if (choosed.length === 0) {
      return Taro.showToast({
        title: "您还没有选择宝贝哦～",
        icon: "none"
      });
    }
    Taro.showModal({
      title: "提示",
      content: `确认将这${choosed.length}个宝贝删除?`
    }).then(res => {
      if (res.confirm) {
        const id = choosed.join("-");
        this.handleDelete(id);
      }
    });
  };

  handleDelete = id => {
    Taro.showLoading({
      title: "正在删除"
    });
    shopApi
      .clearShoppingCart({
        skuIds: id
      })
      .then(() => {
        getCart();
        Taro.hideLoading();

        const choosed = this.state.choosed;
        const ids = String(id).split("-");
        let newChoosed = [...choosed.filter(item => !ids.includes("" + item))];
        this.setState({
          choosed: newChoosed
        });
      })
      .catch(err => {
        Taro.hideLoading();
        Taro.showToast({
          title: err.message || "删除失败",
          icon: "none"
        });
        console.error(err);
      });
  };

  changeSelectedAll = () => {
    const { cart } = this.props;
    const { choosed } = this.state;
    const isSelectedAll = choosed.length === _.get(cart, "items.length", 0);
    const allIds = _.get(cart, "items", []).map(sku => sku.productSku.id);
    if (isSelectedAll) {
      this.setState({
        choosed: []
      });
    } else {
      this.setState({
        choosed: [...allIds]
      });
    }
  };

  handleEditOpen = () => {
    this.setState({
      edit: true
    });
  };

  handleEditClose = () => {
    this.setState({
      edit: false
    });
  };

  // 结算
  handleSubmit = () => {
    const { choosed } = this.state;
    const { cart } = this.props;
    if (!choosed.length) {
      return Taro.showToast({
        title: "您还没有选择宝贝哦～",
        icon: "none"
      });
    } else {
      let orderProduct = cart.items.filter(item =>
        choosed.includes(item.productSku.id)
      );
      Taro.setStorageSync("order_product", orderProduct);
      Taro.navigateTo({
        url: "/pages/confirmOrder/index?cartFlag=1"
      });
    }
  };

  render() {
    const prefixCls = "u-cart";
    const { cart, user } = this.props;
    const { choosed, edit } = this.state;
    const isSelectedAll = choosed.length === _.get(cart, "items.length", 0);
    const priceTotal = _.get(cart, "items", [])
      .filter(item => choosed.includes(item.productSku.id))
      .reduce((total, item) => {
        return total + Number(item.price);
      }, 0);
    const isLogin = user.isLogin;
    return isLogin ? (
      <View className={prefixCls}>
        <View className="u-header">
          <View className="u-header__l">购物车({cart.totalCount})</View>
          {edit ? (
            <View className="u-header__r" onClick={this.handleEditClose}>
              完成
            </View>
          ) : (
            <View className="u-header__r" onClick={this.handleEditOpen}>
              管理
            </View>
          )}
        </View>

        <View className="u-list">
          {cart.items.map(cartItem => {
            return (
              <ProductItem
                key={cartItem.id}
                selected={choosed.includes(cartItem.productSku.id)}
                cartItem={cartItem}
                onChange={this.selectChange}
                onDelete={this.handleDelete}
              />
            );
          })}
        </View>

        <View className="u-action">
          <View className="u-action__left" onClick={this.changeSelectedAll}>
            <RadioIcon selected={isSelectedAll} />
            <Text className="u-action__all">全选</Text>
          </View>
          {edit ? (
            <View className="u-action__right">
              <AtButton
                className="u-action__btn"
                type="primary"
                circle={false}
                full
                onClick={this.handleDeleteChoosed}
              >
                删除
              </AtButton>
            </View>
          ) : (
            <View className="u-action__right">
              <View>
                <Text className="u-action__label">合计：</Text>
                <Text className="u-action__val">¥ {priceTotal.toFixed(2)}</Text>
              </View>
              <AtButton
                className="u-action__btn"
                type="primary"
                circle={false}
                full
                onClick={this.handleSubmit}
              >
                结算
              </AtButton>
            </View>
          )}
        </View>
      </View>
    ) : (
      <GLogin />
    );
  }
}

export default Cart;
