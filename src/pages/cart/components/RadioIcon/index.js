import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View } from '@tarojs/components'
import Iconfont from '@/components/Iconfont'

import './index.less'

class index extends Component {
  componentWillMount () {}

  componentDidMount () {}

  handleClick = (e) => {
    this.props.onClick && this.props.onClick(e)
  }

  handleTap = (e) => {
    this.props.onTap && this.props.onTap(e)
  }

  render () {
    const prefixCls = 'u-icon'
    const { selected, size } = this.props
    return (
      <View className={prefixCls} onClick={this.handleClick} onTap={this.handleTap}>
        {selected ? (
          <Iconfont type='iconhints-success' size={size} color='#ffdb47' />
        ) : (
          <Iconfont type='iconcb' size={size} color='#ccc' />
        )}
      </View>
    )
  }
}

index.propTypes = {
  onClick: PropTypes.func,
  onTap: PropTypes.func,
  selected: PropTypes.bool,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

index.defaultProps = {
  selected: false,
  size: 20
}

export default index
