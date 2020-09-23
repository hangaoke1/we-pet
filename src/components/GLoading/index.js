import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View } from '@tarojs/components'

import './index.less'

export default class AtLoading extends Component {
  render () {
    const { color, size } = this.props
    const loadingSize = typeof size === 'string' ? size : String(size)
    const sizeStyle = {
      width: size ? `${Taro.pxTransform(parseInt(loadingSize))}` : '',
      height: size ? `${Taro.pxTransform(parseInt(loadingSize))}` : ''
    }
    const colorStyle = {
      border: color ? `1px solid ${color}` : '',
      'border-color': color ? `${color} transparent transparent transparent` : ''
    }
    const ringStyle = Object.assign({}, colorStyle, sizeStyle)

    return (
      <View className='at-loading' style={sizeStyle}>
        <View className='at-loading__ring' style={ringStyle} />
        <View className='at-loading__ring' style={ringStyle} />
        <View className='at-loading__ring' style={ringStyle} />
      </View>
    )
  }
}

AtLoading.defaultProps = {
  size: 0,
  color: ''
}

AtLoading.propTypes = {
  size: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  color: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
}
