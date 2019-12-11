import React, { Component } from 'react';
import { Row, Col } from 'antd';
import InputWrapper from '../../../component/inputWrapper';

class SystemGroup extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <Row>
        <Col span={12}><InputWrapper onEndEdit={val => alert(val)}/></Col>
      </Row>
    )
  }
}
export default SystemGroup;