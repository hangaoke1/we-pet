
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import '../../assets/font.less'

export default function Iconfont (props) {
  const { size = 28, color = '#ccc' } = props

  function handleClick(e) {
    props.onClick && props.onClick(e)
  }

  return (
    <View
      className={'my-class u-iconfont iconfont ' + props.type}
      style={{
        display: 'flex',
        color: color,
        fontSize: size + 'px'
      }}
      onClick={handleClick}
    />
  )
}

Iconfont.externalClasses = ['my-class']
