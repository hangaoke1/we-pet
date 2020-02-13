import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Iconfont from '@/components/Iconfont'

import './index.less'

class MessageResend extends Component {
  componentWillMount () {}

  componentDidMount () {}

  handleClose = () => {
    this.props.onClose && this.props.onClose()
  }

  preventTouchMove = (e) => {
    // const { isOpened } = this.props
    // if (isOpened) {
    //   e.stopPropagation()
    //   return
    // }
  }

  render () {
    const { isOpened, title } = this.props
    return (
      <View
        className={classNames({
          'u-float': true,
          'u-open': isOpened
        })}
      >
        <View className='u-mask' onClick={this.handleClose} onTouchMove={this.preventTouchMove} />
        <View className='u-content' onTouchMove={this.preventTouchMove}>
          {title && (
            <View className='u-title'>
              <Text>{title}</Text>
              <View className='u-close' onClick={this.handleClose}>
                <Iconfont type='iconshanchu' color='#333' size='16' />
              </View>
            </View>
          )}
          {this.props.children}
        </View>
      </View>
    )
  }
}

MessageResend.propTypes = {
  title: PropTypes.string,
  isOpened: PropTypes.bool,
  onClose: PropTypes.func
}

MessageResend.defaultProps = {
  isOpened: false
}

export default MessageResend
