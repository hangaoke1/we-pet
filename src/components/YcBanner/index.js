import Taro, { Component } from '@tarojs/taro';
import { Swiper, SwiperItem } from '@tarojs/components';
import GImage from '@/components/GImage';

import './index.less'

export default class YcBanner extends Component {

  render() {
    const { banners = [] } = this.props
    return (
      <Swiper className='yc-banner' circular autoplay>
        {banners.map((banner) => (
          <SwiperItem key={banner.id}>
            <GImage my-class='yc-banner__image' src={banner.imgUrl} resize="750" mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>
    );
  }
}
