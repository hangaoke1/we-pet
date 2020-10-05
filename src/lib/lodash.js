import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';

export default {
  get,
  isEqual,
  cloneDeep,
  uniq,
  // 图片格式化webp
  url2Webp: (url) => {
    if (!url) { return url }
    if (url.indexOf('imageView2/format/webp') > -1) {
      return url;
    }
    return url + `?imageView2/format/webp`;
  }
};
