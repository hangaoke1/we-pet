import Taro, { Component } from '@tarojs/taro';
import { View, Input, Picker, Text, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import dayjs from 'dayjs';
import Iconfont from '@/components/Iconfont';
import uploadFile from '@/lib/uploadFile';
import petApi from '@/api/pet';

import './index.less';

class PetDetail extends Component {
  static options = {
    addGlobalClass: true // 支持使用全局样式
  };

  config = {
    navigationBarTitleText: '爱宠信息'
  };

  state = {
    currentDate: dayjs().format('YYYY-MM-DD'),
    form: {
      petName: '',
      avatar: '',
      petBreed: '',
      petType: 1,
      sex: '',
      bearFlag: '',
      birthday: ''
    }
  };
  componentWillMount() {
    if (this.$router.params.id) {
      const form = Taro.getStorageSync('pet_update');
      this.setState({
        form
      });
    }
  }

  componentDidMount() {}

  showType = () => {
    Taro.showActionSheet({
      itemList: [ '猫', '狗' ]
    })
      .then((res) => {
        if (res.tapIndex === 0) {
          this.setState((state) => {
            const form = state.form;
            if (form.petType != 2) {
              form.petBreed = '';
            }
            form.petType = 2;
            return {
              form: form
            };
          });
        }
        if (res.tapIndex === 1) {
          this.setState((state) => {
            const form = state.form;
            if (form.petType != 1) {
              form.petBreed = '';
            }
            form.petType = 1;
            return {
              form: form
            };
          });
        }
      })
      .catch(() => {});
  };

  setSex = (v) => {
    this.setState((state) => {
      const form = state.form;
      form.sex = v;
      return {
        form: form
      };
    });
  };

  showJueyu = () => {
    Taro.showActionSheet({
      itemList: [ '是', '否' ]
    })
      .then((res) => {
        if (res.tapIndex === 0) {
          this.setState((state) => {
            const form = state.form;
            form.bearFlag = 1;
            return {
              form: form
            };
          });
        }
        if (res.tapIndex === 1) {
          this.setState((state) => {
            const form = state.form;
            form.bearFlag = 0;
            return {
              form: form
            };
          });
        }
      })
      .catch(() => {});
  };

  dateChange = (event) => {
    this.setState((state) => {
      const form = state.form;
      form.birthday = event.detail.value;
      return {
        form
      };
    });
  };

  changeAvatar = () => {
    Taro.showActionSheet({
      itemList: [ '拍照', '从手机相册选择' ]
    })
      .then((res) => {
        if (res.tapIndex === 0) {
          Taro.chooseImage({
            count: 1,
            sourceType: [ 'camera' ]
          }).then((res) => {
            uploadFile(res.tempFilePaths[0]).then((data) => {
              console.log('>>> 文件地址', data);
              this.setState((state) => {
                const form = state.form;
                form.avatar = data;
                return {
                  form
                };
              });
            });
          });
        }
        if (res.tapIndex === 1) {
          Taro.chooseImage({
            count: 1,
            sourceType: [ 'album' ]
          }).then((res) => {
            uploadFile(res.tempFilePaths[0]).then((data) => {
              this.setState((state) => {
                const form = state.form;
                form.avatar = data;
                return {
                  form
                };
              });
            });
          });
        }
      })
      .catch(() => {});
  };

  goPetBreed = () => {
    const vm = this;
    Taro.navigateTo({
      url: '/pages/petBreed/index',
      events: {
        acceptDataFromOpenedPage(data) {
          vm.setState((state) => {
            const form = state.form;
            form.petBreed = data.data;
            return {
              form
            };
          });
        }
      },
      success(res) {
        const { petType } = vm.state.form;
        res.eventChannel.emit('acceptDataFromOpenerPage', { petType });
      }
    });
  };

  handleNameChange = (e) => {
    this.setState((state) => {
      const form = state.form;
      form.petName = e.detail.value;
      return {
        form
      };
    });
  };

  handleSubmit = () => {
    const form = this.state.form;
    if (!form.petName) {
      return Taro.showToast({
        title: '请填写宠物昵称',
        icon: 'none'
      });
    }
    if (!form.petType) {
      return Taro.showToast({
        title: '请填写宠物种类',
        icon: 'none'
      });
    }
    if (!form.petBreed) {
      return Taro.showToast({
        title: '请填写宠物品种',
        icon: 'none'
      });
    }
    petApi
      .insertPetRecord(form)
      .then(() => {
        Taro.showToast({
          title: '添加成功',
          icon: 'success'
        });
        Taro.navigateBack();
      })
      .catch((error) => {
        console.error(error);
        Taro.showToast({
          title: error.message,
          icon: 'none'
        });
      });
  };

  handleUpdate = () => {
    const form = this.state.form;
    if (!form.petName) {
      return Taro.showToast({
        title: '请填写宠物昵称',
        icon: 'none'
      });
    }
    if (!form.petType) {
      return Taro.showToast({
        title: '请填写宠物种类',
        icon: 'none'
      });
    }
    if (!form.petBreed) {
      return Taro.showToast({
        title: '请填写宠物品种',
        icon: 'none'
      });
    }
    petApi
      .updatePetRecord(form)
      .then(() => {
        Taro.showToast({
          title: '修改成功',
          icon: 'success'
        });
        Taro.navigateBack();
      })
      .catch((error) => {
        console.error(error);
        Taro.showToast({
          title: error.message,
          icon: 'none'
        });
      });
  };

  handleDelete = () => {
    Taro.showModal({
      title: '提示',
      content: `确定要删除${this.state.form.petName}吗？`
    }).then((res) => {
      if (res.confirm) {
        Taro.showLoading();
        petApi
          .removePetRecord({
            id: this.state.form.id
          })
          .then(() => {
            Taro.hideLoading();
            Taro.navigateBack();
          })
          .catch((error) => {
            Taro.hideLoading();
            Taro.showToast({
              title: error.message || '删除失败',
              icon: 'none'
            });
          });
      }
    });
  };

  render() {
    const { currentDate, form } = this.state;
    return (
      <View className='u-petDetail'>
        <View className='u-form'>
          <View className='flex align-center justify-center py-4 border-bottom-divider'>
            <View className='u-avatar' onClick={this.changeAvatar}>
              {form.avatar ? (
                <Image class='u-avatar__image' src={form.avatar} />
              ) : (
                <View className='u-avatar__placehold flex align-center justify-center'>
                  <Iconfont type='icongoujiaoyin' size='26' color='#999' />
                </View>
              )}
              <View className='u-avatar__xiangji'>
                <Iconfont type='iconxiangji' size='18' color='#FF7013' />
              </View>
            </View>
          </View>
          <View className='u-form__item'>
            <View className='u-form__label'>宠物名称</View>
            <View className='u-form__value'>
              <Input
                placeholder='请设置宠物名称'
                className='u-form__input'
                placeholderStyle='color: #999'
                value={form.petName}
                onChange={this.handleNameChange}
              />
            </View>
          </View>
          <View className='u-form__item'>
            <View className='u-form__label'>宠物性别</View>
            <View className='u-form__value' onClick={this.showSex}>
              <View className='flex align-center'>
                <View className='mr-3 flex align-center' onClick={this.setSex.bind(this, 0)}>
                  {String(form.sex) === '0' ? (
                    <Iconfont type='icongong-xuanzhong' size='18' color='#2F6BFE' />
                  ) : (
                    <Iconfont type='icongong-weixuanzhong' size='18' color='#ccc' />
                  )}
                  <Text
                    className='ml-1'
                    style={{
                      color: String(form.sex) === '0' ? '#333' : '#ccc'
                    }}
                  >
                    GG
                  </Text>
                </View>
                <View className='flex align-center' onClick={this.setSex.bind(this, 1)}>
                  {String(form.sex) === '1' ? (
                    <Iconfont type='iconmu-xuanzhong' size='18' color='pink' />
                  ) : (
                    <Iconfont type='iconmu-weixuanzhong' size='18' color='#ccc' />
                  )}
                  <Text
                    className='ml-1'
                    style={{
                      color: String(form.sex) === '1' ? '#333' : '#ccc'
                    }}
                  >
                    MM
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className='u-form__item'>
            <View className='u-form__arrow' onClick={this.showType}>
              <Iconfont type='iconarrowright' size='18' color='#ccc' />
            </View>
            <View className='u-form__label'>宠物种类</View>
            <View className='u-form__value' onClick={this.showType}>
              {form.petType == 1 ? '狗' : '猫'}
            </View>
          </View>
          <View className='u-form__item'>
            <View className='u-form__arrow'>
              <Iconfont type='iconarrowright' size='18' color='#ccc' />
            </View>
            <View className='u-form__label'>宠物品种</View>
            <View className='u-form__value' onClick={this.goPetBreed}>
              {form.petBreed ? <Text>{form.petBreed}</Text> : <Text className='text-hui'>请选择宠物品种</Text>}
            </View>
          </View>
          <View className='u-form__item'>
            <View className='u-form__arrow'>
              <Iconfont type='iconarrowright' size='18' color='#ccc' />
            </View>
            <View className='u-form__label'>宠物生日</View>
            <View className='u-form__value'>
              <Picker mode='date' value={form.birthday} start='1990-01-01' end={currentDate} onChange={this.dateChange}>
                <View class='picker'>
                  {form.birthday ? <Text>{form.birthday}</Text> : <Text className='text-hui'>请选择宝贝的生日</Text>}
                </View>
              </Picker>
            </View>
          </View>
          <View className='u-form__item'>
            <View className='u-form__label'>宠物体重</View>
            <View className='u-form__value'>
              <Input
                placeholder='请输入宠物体重'
                className='u-form__input'
                placeholderStyle='color: #999'
                value={form.petWeight}
              />
            </View>
          </View>

          <View className='u-form__item'>
            <View className='u-form__arrow' onClick={this.showJueyu}>
              <Iconfont type='iconarrowright' size='18' color='#ccc' />
            </View>
            <View className='u-form__label'>是否绝育</View>
            <View className='u-form__value' onClick={this.showJueyu}>
              {String(form.bearFlag) === '0' && <Text>否</Text>}
              {String(form.bearFlag) === '1' && <Text>是</Text>}
              {String(form.bearFlag) === '' && <Text className='text-hui'>选填</Text>}
            </View>
          </View>
        </View>

        {form.id ? (
          <View className='flex align-center justify-center mt-3'>
            <AtButton className='u-delete' type='secondary' circle onClick={this.handleDelete}>
              删除档案
            </AtButton>
            <AtButton className='u-update ml-4' type='primary' circle onClick={this.handleUpdate}>
              确认提交
            </AtButton>
          </View>
        ) : (
          <AtButton className='u-action' type='primary' circle onClick={this.handleSubmit}>
            确认提交
          </AtButton>
        )}
      </View>
    );
  }
}

export default PetDetail;
