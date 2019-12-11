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
const AssetsInfo = ({ data }) => (
  <Row>
    <Col span={8}>
      <FormItem label={`资产编号`} {...formItemLayout}>
        {
          data.assetsRecord
        }
      </FormItem>
    </Col>
    <Col span={8}>
      <FormItem label={`资产名称`} {...formItemLayout}>
        {
          data.equipmentStandardName
        }
      </FormItem>
    </Col>
    <Col span={8}>
      <FormItem label={`型号`} {...formItemLayout}>
        {
          data.fmodel
        }
      </FormItem>
    </Col>
    <Col span={8}>
      <FormItem label={`规格`} {...formItemLayout}>
        {
          data.spec
        }
      </FormItem>
    </Col>
    <Col span={8}>
      <FormItem label={`资产类别`} {...formItemLayout}>
        {
          data.productType
        }
      </FormItem>
    </Col>
    <Col span={8}>
      <FormItem label={`使用科室`} {...formItemLayout}>
       {
          data.useDept
        }
      </FormItem>
    </Col>
    <Col span={8}>
      <FormItem label={`保管员`} {...formItemLayout}>
      {
          data.custodian
        }
      </FormItem>
    </Col>
    <Col span={8}>
      <FormItem label={`管理科室`} {...formItemLayout}>
      {
          data.bDept
        }
      </FormItem>
    </Col>
    <Col span={8}>
      <FormItem label={`原值`} {...formItemLayout}>
      {
          data.originalValue
        }
      </FormItem>
    </Col>
  </Row>
)

export default AssetsInfo;