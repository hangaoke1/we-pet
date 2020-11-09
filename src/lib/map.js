import Taro from '@tarojs/taro'
import config from '@/config'
import _ from '@/lib/lodash'
import QQMapWX from './qqmap-wx-jssdk1.2/qqmap-wx-jssdk'

export const qqmapsdk = new QQMapWX({
  key: config.mapKey
});

export const calcDistance = function(from, to){
  return new Promise((resolve, reject) => {
    qqmapsdk.calculateDistance({
      from,
      to: [ to ],
      success: function(res){
        //成功后的回调
        console.log('>>> 位置计算', res);
        if (res.status === 0) {
          return resolve(_.get(res, 'result.elements[0].distance'))
        } else {
          reject(new Error('无法计算'))
        }
      }
    });
  });
};
