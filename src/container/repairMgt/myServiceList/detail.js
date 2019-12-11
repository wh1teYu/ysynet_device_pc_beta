/**
 * 我的维修单  - 详情
 */
import React, { PureComponent } from 'react';
import AllDetail from '../repairMgtDetail';

class MyServiceDetail extends PureComponent {
  render() {
    return (
      <AllDetail state={this.props.location.state} showPrint={true}/>
    )
  }
}

export default MyServiceDetail;
