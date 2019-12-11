/*计量查询- 详情*/
import React , { Component } from 'react';
import { Layout, Card, Col, Row, message, Upload} from 'antd';
import {FTP} from '../../../api/local';
import queryString from 'querystring';
import request from '../../../utils/request';
import meterStand from '../../../api/meterStand';
import assets from '../../../api/assets';
const { Content } = Layout;

class MeterQueryDetails extends Component{
  state = {
    SearchKey:'',//资产编号搜索
    assetsInfo:{},
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png',
    }],
    productType: {
      "01": "通用设备",
      "02": "电气设备",
      "03": "电子产品及通信设备",
      "04": "仪器仪表及其他",
      "05": "专业设备",
      "06": "其他"
    }
  }
  componentDidMount() {
    const recordInfoGuid = this.props.match.params.id;
    request(meterStand.meterRecordInfoList, {
      body: queryString.stringify({ recordInfoGuid }),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (data) => {
        if(data.status) {
          let assetsInfo = data.result.rows[0];
          let fileList = [];
          if(assetsInfo.accessory) {
            fileList = assetsInfo.accessory.split(';');
            if(fileList.length === 2 && fileList[1] === "") {
              fileList = [fileList[0]];
            };
            fileList = fileList.map((item, i) => {
              return {
                uid: (i + 1) * -1,
                name: item.split('/')[item.split('/').length - 1],
                status: 'done',
                url: `${FTP}${item}`,
                thumbUrl: `${FTP}${item}`,
              }
            });
          }
          
          this.setState({ assetsInfo, fileList });
        }else {
          message.error(data.msg);
        }
      },
      error: (err) => console.log(err)
    })
  }
  render(){
    const { assetsInfo, fileList } = this.state;
    const props = {
      action: assets.picUploadUrl,
      fileList
    };
    return(
      <Content className='ysynet-content'>
          {/* 资产信息部分 */}
          <Card title="资产信息" bordered={false} className="min_card">
              <Row>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>资产编号</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                        {assetsInfo.assetsRecord || ''}
                      </div>
                    </div>
                  </div>

                </Col>
                <Col span={8} offset={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>资产名称</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                        {assetsInfo.equipmentName || ''}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>型号</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                        {assetsInfo.fmodel || ''}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>规格</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                      {assetsInfo.spec || ''}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>资产类别</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                      {assetsInfo.productType || ''}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>使用科室</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                      {assetsInfo.useDeptName || ''}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>保管员</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                      {assetsInfo.custodian || ''}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>管理科室</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                      {assetsInfo.bDeptGuidName || ''}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
          </Card>
          {/* 资产信息部分 */}
          <Card title="检测信息" bordered={false} style={{marginTop: 4}} className="min_card">
              <Row>
                <Col span={8}>

                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>检定方式</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                        {assetsInfo.type === "00"? "内检" : "外检" || ''}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>计量周期</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                        {`${assetsInfo.measureCycly}月` || '计量周期'}
                      </div>
                    </div>
                  </div>
                </Col>

                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>本次待检日期</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                        {assetsInfo.measureDate || ''}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>下次待检日期</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                        {assetsInfo.nextMeasureDate || ''}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>证书编号</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                        {assetsInfo.certNo || ''}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>检定结果</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                        {assetsInfo.results === "00"? "合格" : "不合格" || ''}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>计量费用</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                        {assetsInfo.measurePay || ''}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>检定人</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                        {assetsInfo.verdictUserName || ''}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                  <Col span={8}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                      <label>附件</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                      <div className="ant-form-item-control">
                          <Upload 
                            {...props} 
                            showUploadList={{showRemoveIcon:false}}
                          >
                          </Upload>
                      </div>
                    </div>
                  </div>
                  </Col>
              </Row>
          </Card>
      </Content>
    )
  }
}

export default  MeterQueryDetails;
