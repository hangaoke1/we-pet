const serviceList = [
  {
    name: '洗澡',
    desc: '暂无描述',
    icon: 'http://pet-agatha.oss-cn-hangzhou.aliyuncs.com/20200303/c5271b59e31c436080d6e839704bfe39.jpg',
    price: 80
  },
  {
    name: 'SPA',
    desc: '暂无描述',
    icon: 'http://pet-agatha.oss-cn-hangzhou.aliyuncs.com/20200303/f0ede866160941b1b57cf937af0351a6.jpg',
    price: 198
  },
  {
    name: '美容',
    desc: '暂无描述',
    icon: 'http://pet-agatha.oss-cn-hangzhou.aliyuncs.com/20200303/4544f8827b3f422c89f630581fcfb799.jpg',
    price: 40
  },
  {
    name: '洁齿',
    desc: '暂无描述',
    icon: 'http://pet-agatha.oss-cn-hangzhou.aliyuncs.com/20200303/8eee5b359c6946af818338c4d731bbfc.jpg',
    price: 40
  },
  {
    name: '造型',
    desc: '暂无描述',
    icon: 'http://pet-agatha.oss-cn-hangzhou.aliyuncs.com/20200303/8eee5b359c6946af818338c4d731bbfc.jpg',
    price: 58
  },
]

const serviceMap = {}
serviceList.forEach(v => {
  serviceMap[v.name] = v;
})

export default {
  serviceList,
  serviceMap
}
