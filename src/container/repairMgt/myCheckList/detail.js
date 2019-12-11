/**
 * 单据详情
 */
import React, { PureComponent } from 'react';
import AllDetail from '../repairMgtDetail';
class MyCheckListDetail extends PureComponent {
  render() {
    return (
      <AllDetail state={this.props.location.state}/>
    )
  }
}

export default MyCheckListDetail;