/**
 * @file 报废信息
 */
import React, { PureComponent } from 'react';
import { Row, Col, Form } from 'antd';
import PicWall from '../../../component/picWall'
import { FTP} from '../../../api/local'
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
class ScrapInfo extends PureComponent {
  getFileList = () => {
    const { data } = this.props;
    const fileList = [];
    if (data.scrapAccessory) {
      data.scrapAccessory.split(';').map((item, index) => fileList.push({
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
        <Col>
          <FormItem label={`报废原因`} {...formItemLayoutForOne}>
            { data.scrapCause }
          </FormItem>
        </Col>
        <Col>  
          <FormItem label={`使用情况`} {...formItemLayoutForOne}>
            { data.useSituation }
          </FormItem>
        </Col>
        <Col>  
          <FormItem label={`报废附件`} {...formItemLayoutForOne}>
            <PicWall isAdd={false} fileList={this.getFileList()}/>
          </FormItem>
        </Col>
      </Row>
    )
  }
}
export default ScrapInfo;