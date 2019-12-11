import React, { Component } from 'react';
import { Badge, Icon } from 'antd';
/**
 * @file 头部站内信息
 */
class PhxlMail extends Component {
  shouldComponentUpdate = (nextProps, nextState) => (
    this.props.count === nextProps.count
  )
  render() {
    return (
      <Badge count={this.props.count}>
        <Icon type='bell' style={{fontSize: 18}}/>
      </Badge>
    )
  }
}
export default PhxlMail;