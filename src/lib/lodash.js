import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';
import findIndex from 'lodash/findIndex';

export default {
  get,
  isEqual,
  cloneDeep,
  uniq,
  findIndex,
  // 图片格式化webp
  url2Webp: (url, size) => {
    // 本地图片直接返回
    if (!url || url.indexOf('http') === -1) {
      return url;
    }

    // 已经通过webp压缩
    if (url.indexOf('imageView2/format/webp') > -1) {
      return url + `${size ? `/w/${size}` : ''}`;
    }

    // 常规压缩
    return url + `?imageView2/format/webp${size ? `/w/${size}` : ''}`;
  }
};
