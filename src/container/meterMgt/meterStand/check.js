/*计量台账- 检测*/
import React , { Component } from 'react';
import { Layout, Card, Button, Affix, Form, Icon ,  Col, Row, Input, Select, DatePicker, message , Upload} from 'antd';
import { Link } from 'react-router-dom';
import queryString from 'querystring';
import moment from 'moment';
import request from '../../../utils/request';
import assets from '../../../api/assets';
import {FTP} from '../../../api/local';
import meterStand from '../../../api/meterStand';
import {validMoney} from '../../../utils/tools';     //验证方法
const { Content } = Layout;
const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class CheckMeterStand extends Component{

      state = {
        assetsInfo:{},    //本条数据信息
        fileList:[],      
        nextMeasureDate: '',     //下次待检日期
        measureDate: '',         //本次待检日期
      }
      componentDidMount() {
        const assetsRecordGuid = this.props.match.params.id;
        request(meterStand.meterRecordList, {
          body: queryString.stringify({ assetsRecordGuid }),
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: (data) => {
            let assetsInfo = data.result.rows[0];
            let nextMeasureDate2 = this.nextMeasureDateValue(assetsInfo.nextMeasureDate, assetsInfo.measureCycly);
            assetsInfo.nextMeasureDate2 = nextMeasureDate2;
            this.setState({ 
              assetsInfo,  
              measureDate: moment(assetsInfo.nextMeasureDate, 'YYYY-MM-DD'),
              nextMeasureDate: moment(assetsInfo.nextMeasureDate2, 'YYYY-MM-DD'),
            });
          },
          error: (err) => console.log(err)
        })
      }
      save = () => {      //完成检定提交
        this.props.form.validateFields((err,values)=>{
          if(!err){
            values.measureDate = values.measureDate.format('YYYY-MM-DD');
            values.nextMeasureDate = values.nextMeasureDate.format('YYYY-MM-DD');
            for (const key in values) {
              values[key] = values[key] === undefined? '' : values[key];
            };
            values.assetsRecordGuid = this.state.assetsInfo.assetsRecordGuid;
            let {accessoryList, assetsInfo} = this.state;
            values.type = assetsInfo.type;
            values.measureCycly = assetsInfo.measureCycly;
            request(meterStand.insertMeterRecordInfo, {
              body: queryString.stringify({...values, accessoryList }),
              headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: (data) => {
                if(data.status) {
                  this.props.history.push('/meterMgt/meterStand');
                }
              },
              error: err => console.log(err)
            });
          }
        })
      }

      onStartChange = (measureDate) => {    
        this.setState({ measureDate })
      }

      onEndChange = (nextMeasureDate) => {
        this.setState({ nextMeasureDate })
      }

      disabledStartDate = (measureDate)=>{
        const {nextMeasureDate} = this.state;
        if (!nextMeasureDate || !measureDate) {
          return false;
        } 
        return measureDate.valueOf() > nextMeasureDate.valueOf();
      }

      disabledEndDate = (nextMeasureDate) => {
        const {measureDate} = this.state;
        if (!nextMeasureDate || !measureDate) {
          return false;
        } 
        return nextMeasureDate.valueOf() <= measureDate.valueOf();
      }

      nextMeasureDateValue = (nextMeasureDate, measureCycly) => {    //计算下次待检日期
        if (!nextMeasureDate) return;
        nextMeasureDate = nextMeasureDate.split('-');
        let moment = Number(nextMeasureDate[1]) + measureCycly%12, 
            year = Number(nextMeasureDate[0]), 
            addYear;

        if(measureCycly >= 12 && measureCycly%12 >=0 ) {

          addYear = Math.floor(measureCycly/12);

          year += addYear;

        };

        if( moment > 12 ) {

          year += 1;

        }
        moment = moment%12 < 10? `0${moment%12}`: moment%12;

        return `${year}-${moment}-${nextMeasureDate[2]}`;
      }

      handleChange = (fileListObj) => {   //上传附件
        let { fileList } = fileListObj ; 
        fileList = fileList.map((file) => {   //修改预览地址
          if (file.response) {
            file.url = FTP + file.response.result;
          }
          return file;
        });
        
        // 3. 过滤上传失败的文件
        fileList = fileList.filter((file) => {
          if (file.response) {
            return file.response.status;
          }
          return false;
        });
        
        let accessoryList = fileList.map(item => item.response.result);
        
        this.setState({accessoryList});
      }

      beforeUpload = (file) => {
        switch(file.type){
          case "application/png":
            return true;
          case "application/gif":
            return true;
          case "application/jpg":
            return true;
          case "application/jpeg":
            return true;
          case "application/pdf":
            return true;
          case "image/gif":
            return true;
          case "image/jpg":
            return true;
          case "image/png":
            return true;
          case "image/jpeg":
            return true;
          default:
            message.error('仅支持扩展名：.pdf .jpg .png .gif .jpeg！',3);
            break;
        };
        return false;
      }

      removeFile = (file) => {
        request(assets.deleteFile, {
          body: queryString.stringify({filePath: file.response.result}),
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: (data) => {
            if(data.status) {
              message.success('移除成功');
            }
          },
          error: err => console.log(err)
        })
      }
      render(){
        const { getFieldDecorator } = this.props.form;
        const { assetsInfo } = this.state;
        const props = {
          action: assets.uploadFile,
          data: (flie)=>({uploadFile: flie}),
          onChange: this.handleChange,
          multiple: true,
          listType: "picture-card",
          onRemove: this.removeFile,
          beforeUpload: this.beforeUpload
        };
        return(
          <Content className='ysynet-content'>
              {/* 保存申请信息按钮部分 */}
              <Affix>
                <div style={{background: '#fff', padding: '10px 20px', marginBottom: 4, display: 'flex', alignContent: 'center', justifyContent: 'flex-end'}}>
                <Button type="primary"><Link to={{pathname:`/meterMgt/meterStand/`}}>取消</Link></Button>
                <Button type="primary" onClick={this.save} style={{marginLeft:15}}>完成检定</Button>
                </div>
              </Affix>
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
                          {assetsInfo.bDeptName || ''}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
              </Card>
              {/* 资产信息部分 */}
              <Card title="检测信息" bordered={false} className="min_card">     
                <Form ref='checkForm'>
                  <Row>
                    <Col span={8}>
                      <FormItem  {...formItemLayout} label='检定方式'>
                        <span>{`${assetsInfo.type === "00"? "内检" : "外检" }`}</span>
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='计量周期'>
                        <span>{`${assetsInfo.measureCycly}月`}</span>
                      </FormItem>
                    </Col>
        
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='本次待检日期'>
                      {getFieldDecorator('measureDate',{
                        initialValue: moment(assetsInfo.nextMeasureDate, 'YYYY-MM-DD'),
                        rules:[{
                          required:true,message:"请选择本次待检日期!"
                        }]
                      })(
                        <DatePicker
                         disabledDate={this.disabledStartDate}
                         format={'YYYY-MM-DD'} 
                         style={{width:200}}
                         onChange={ this.onStartChange }
                         />
                      )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='下次待检日期'>
                      {getFieldDecorator('nextMeasureDate',{
                        initialValue: moment( assetsInfo.nextMeasureDate2 , 'YYYY-MM-DD'),
                        rules:[{   
                          required:true,message:"请选择下次待检日期!"
                        }]
                      })(
                        <DatePicker 
                          disabledDate={ this.disabledEndDate }
                          format={'YYYY-MM-DD'} 
                          style={{width:200}}
                          onChange={ this.onEndChange }
                          />
                      )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='证书编号'>
                        {getFieldDecorator('certNo')(
                          <Input placeholder="请输入证书编号" style={{width:200}}/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='检定结果'>
                        {getFieldDecorator('results', {
                          rules: [{
                            required:true,message:"请选择检定结果!"
                          }]
                        })(
                          <Select placeholder="请选择检定结果" style={{width:200}}>
                            <Option value="00">合格</Option>
                            <Option value="01">不合格</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='计量费用'>
                        {getFieldDecorator('measurePay', {
                           rules: [
                            { validator: validMoney }
                          ],
                        })(
                          <Input placeholder="请输入计量费用" addonAfter='元' style={{width:200}}/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='检定人'>
                        {getFieldDecorator('verdictUserName', )(
                          <Input placeholder="请输入检定人" style={{width:200}}/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='备注'>
                        {getFieldDecorator('remark')(
                          <TextArea
                            autosize={{
                              minRows: 4,
                              maxRows: 8
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                      <Col span={8}>
                        <FormItem label='附件' {...formItemLayout}>
                          {getFieldDecorator('accessoryList', )(
                            <div>
                              <Upload {...props} withCredentials={true}>
                                <Button>
                                  <Icon type="upload" /> 上传文件
                                </Button>
                              </Upload>
                              <small>支持扩展名：.pdf .jpg .png .gif .jpeg</small>
                            </div>
                          )}
                        </FormItem>
                      </Col>
                  </Row>
                </Form>
              </Card>
          </Content>  
        )
      }
}

export default   Form.create()(CheckMeterStand) ;