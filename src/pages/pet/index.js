import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtSwipeAction } from "taro-ui";
import Iconfont from "@/components/Iconfont";
import { getPet } from "@/actions/pet";
import getPetYear from "@/lib/getPetYear";
import petApi from "@/api/pet";
import config from "@/config";

import "./index.less";

@connect(
  ({ pet }) => ({
    pet
  }),
  dispatch => ({})
)
class Pet extends Component {
  config = {
    navigationBarTitleText: "我的爱宠",
    backgroundColor: "#f3f4f8"
  };

  componentWillMount() {}

  componentDidShow() {
    getPet();
  }

  deletePet = (item, event) => {
    console.log(">>> event", event);
    if (event.text === "删除") {
      Taro.showModal({
        title: "提示",
        content: `确定要删除${item.petName}吗？`
      }).then(res => {
        if (res.confirm) {
          Taro.showLoading();
          petApi
            .removePetRecord({
              id: item.id
            })
            .then(() => {
              Taro.hideLoading();
              getPet();
            })
            .catch(error => {
              Taro.hideLoading();
              Taro.showToast({
                title: error.message || "删除失败",
                icon: "none"
              });
            });
        }
      });
    } else {
      this.goUpdatePet(item);
    }
  };

  goAddPet = () => {
    Taro.navigateTo({
      url: "/pages/petDetail/index"
    });
  };

  goUpdatePet = item => {
    Taro.setStorageSync("pet_update", item);
    Taro.navigateTo({
      url: "/pages/petDetail/index?id=" + item.id
    });
  };

  render() {
    const { pet } = this.props;
    return (
      <View className="u-pet">
        <View className="u-list">
          {pet.list.map(item => (
            <View className="u-item__wrap" key={item.id}>
              <AtSwipeAction
                // autoClose
                onClick={this.deletePet.bind(this, item)}
                options={[
                  {
                    text: "编辑",
                    style: {
                      backgroundColor: "#F5A623"
                    }
                  },
                  {
                    text: "删除",
                    style: {
                      backgroundColor: "#FF4949"
                    }
                  }
                ]}
              >
                <View className="u-item">
                  <Image
                    class="u-item__img"
                    src={item.avatar || config.petAvatar}
                    lazyLoad
                    webp
                  />
                  <View className="u-item__info">
                    <View className="u-item__name">
                      <Text>{item.petName}</Text>
                      <View
                        className="u-item__sex"
                        style={{
                          backgroundColor: item.sex == 0 ? "#40a9ff" : "#ff7875"
                        }}
                      >
                        <Iconfont
                          type={item.sex == 0 ? "iconnanxing" : "iconmu"}
                          color="#fff"
                          size="12"
                        />
                      </View>
                    </View>
                    {/* <View className="u-item__desc">
                      {item.petBreed}{" "}
                      {item.bearFlag === 0 ? "未绝育" : "已绝育"}{" "}
                      {getPetYear(item.birthday)}
                    </View> */}
                    <View className="flex align-center">
                      <View className="u-petBreed">{item.petBreed}</View>
                      <View className="ml-1 mr-2 text-hui font-s-24">
                        生日：{item.birthday.slice(5)}
                      </View>
                      <View className="text-hui font-s-24">
                        {getPetYear(item.birthday)}
                      </View>
                    </View>
                  </View>
                </View>
              </AtSwipeAction>
            </View>
          ))}
        </View>
        <View className="u-action" onClick={this.goAddPet}>
          + 添加宠物档案
        </View>
      </View>
    );
  }
}

export default Pet;
