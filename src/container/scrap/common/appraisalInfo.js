import React from 'react';
import { Row, Col, Form } from 'antd';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const formItemLayoutForOne = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const AppraisalInfo = ({ data }) => (
  <Row>
    <Col>
      <FormItem label={`鉴定参数`} {...formItemLayoutForOne}>
        { data.identifyName }
      </FormItem>
    </Col>
    <Col span={8}>  
      <FormItem label={`鉴定人`} {...formItemLayout}>
        { data.userName }
      </FormItem>
    </Col>
    <Col span={8}>  
      <FormItem label={`鉴定时间`} {...formItemLayout}>
        { data.identifyDate }
      </FormItem>
    </Col>
    <Col span={24}>
      <FormItem label={`鉴定意见`} {...formItemLayoutForOne}>
        { data.identifyOpinion }
      </FormItem>
    </Col>
  </Row> 
)

export default AppraisalInfo;