import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';
import findIndex from 'lodash/findIndex'

export default {
  get,
  isEqual,
  cloneDeep,
  uniq,
  findIndex,
  // 图片格式化webp
  url2Webp: (url) => {
    if (!url || url.indexOf('http') === -1) { return url }
    if (url.indexOf('imageView2/format/webp') > -1) {
      return url;
    }
    return url + `?imageView2/format/webp`;
  }
};
