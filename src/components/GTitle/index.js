import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import PropTypes from "prop-types";

import Iconfont from "@/components/Iconfont";
import "./index.less";

export default class GTitle extends Component {
  static propTypes = {
    title: PropTypes.string,
    style: PropTypes.object,
    showMore: PropTypes.bool,
    onShowMore: PropTypes.func
  };

  static defaultProps = {
    showMore: false
  };

  render() {
    const { title, showMore, style, onShowMore } = this.props;
    return (
      <View className="g-title" style={style}>
        <Text>{title}</Text>
        {showMore && (
          <View className="g-subTitle" onClick={onShowMore}>
            <Text style={{ color: "#FF7013" }}>更多</Text>
            <Iconfont
              type="iconarrowright"
              size="18"
              color="#FF7013"
            ></Iconfont>
          </View>
        )}
      </View>
    );
  }
}
