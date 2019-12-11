/**
 * 报废执行
 */
import React, { PureComponent } from 'react';
import { Row, Col, Form } from 'antd';
import PicWall from '../../../component/picWall'
import { FTP } from '../../../api/local'
const FormItem = Form.Item;
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
class ImplementInfo extends PureComponent {
  getFileList = () => {
    const { data } = this.props;
    const fileList = [];
    if (data.spAccessory) {
      data.spAccessory.split(';').map((item, index) => fileList.push({
        uid: index + 1,
        url: `${FTP}${item}`
      }))
      fileList.pop();
    }
    return fileList;
  }
  render() {
    const { data } = this.props;
    return (
      <Row>
        <Col span={24}>
          <FormItem label={`意见`} {...formItemLayoutForOne}>
            { data.executeScrapOpinion }
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label={`审批附件`} {...formItemLayoutForOne}>
          <PicWall isAdd={false} fileList={this.getFileList()}/>
          </FormItem>
        </Col>
      </Row> 
    )
  }
}

export default ImplementInfo;