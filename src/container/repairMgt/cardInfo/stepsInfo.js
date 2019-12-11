import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import { Steps } from 'antd';
const Step = Steps.Step;
class StepsInfo extends PureComponent {
  static defaultProps = {
    current: 0
  }
  static propTypes = {
    current: propTypes.number.isRequired
  }
  render() {
    const { current } = this.props;
    return (
      <Steps current={current}>
        <Step title="故障报修" />
        <Step title="接单维修" />
        <Step title="检查验收" />
        <Step title="关闭工单" />
      </Steps>
    )
  }
}
export default StepsInfo;