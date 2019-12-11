/**
 * @file 资产转科 - 转科管理 - 转科管理详情
 * @author Vania
 * @since 2018-04-09
 */
import React, { PureComponent } from 'react';
import { Layout, Card, Form, Row, Col, Input, Upload,Button } from 'antd';
import tableGrid from '../../../component/tableGrid';
import request from '../../../utils/request';
import transfer from '../../../api/transfer';
import { FTP } from '../../../api/local';
import querystring from 'querystring';

const { Content } = Layout;
const FormItem = Form.Item;
const { TextArea } = Input;
const { RemoteTable } = tableGrid;

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
const formStyleLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

class TransferManagerDetails extends PureComponent {
  state = {
    data: []
  };
 
  componentWillMount = () => {
    const transferGuid = this.props.match.params.id || this.props.id;
    this.setState({transferGuid: transferGuid});
    this.getApplyInfo(transferGuid);
  }
  getApplyInfo = (transferNo) => {
    let options = {
      body:querystring.stringify({transferGuid: transferNo}),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if (data.status) {
          const result = data.result.rows[0];
          this.setState({data: result})
        }
      }
    }
    request(transfer.getSelectTransferList, options);
  }

  //打印 
  printDetail = () =>{
    const transferGuid = this.props.match.params.id || this.props.id;
    let json = {transferGuid}
    window.open(transfer.printTransfer+'?'+querystring.stringify(json))
  }
  initAccessoryFormat =( backData , field)=>{
    if(backData){
      let accList=backData[field];
      if(Array.isArray(accList)){
        return accList
      }else if(accList){
        let list = accList.split(';');
        let retList = []
        list.map((item,index)=>{
          if(item!==""){
            let Item =  {
                  uid: index,
                  key:index,
                  name: `${item.split('/')[item.split('/').length-1]}`,
                  status: 'done',
                  url: `${FTP}${item}`,
                  thumbUrl: `${FTP}${item}`
            }
            if(`.${item.split('.')[item.split('.').length-1]}`===".pdf"){
              Item.thumbUrl=require('../../../assets/fujian.png')
            }
            
            retList.push(Item)
          }
          return item 
        })
        return retList
      }else{
        return []
      }
    }else{
      return []
    }
  }
  normFile = (e) => {//如 event）转化为控件的值
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  render() {
    // 资产列表渲染
    const columns = [
      {
        title: '资产编号',
        dataIndex: 'assetsRecord',
        width: 100,
        sorter: true
      },
      {
        title: '资产名称',
        dataIndex: 'equipmentStandardName',
        width: 100
      },
      {
        title: '型号',
        dataIndex: 'fmodel',
        width: 100
      },
      {
        title: '规格',
        dataIndex: 'spec',
        width: 100
      },
      {
        title: '使用科室',
        dataIndex: 'useDeptName',
        width: 100
      }
    ]
    const { data } = this.state;
    const { getFieldDecorator } = this.props.form;
    const commonUploadProps ={
      action:transfer.uploadFile,
      listType:"picture-card",
      withCredentials: true,
      name:"file",
      showUploadList:{
        showRemoveIcon:false
      }
    }
    const printHeader = (
      <div>
        申请信息
        <Button type='primary' style={{float:'right'}} onClick={()=>this.printDetail()}>打印</Button>
      </div>
    )
    return(
      <Content>
        {/* 申请信息部分 */}
        <Card title={printHeader} bordered={false} className="min_card">
          <Form>
            <Row>
              <Col span={8}>
                <FormItem label={`申请人`} {...formItemLayout}>
                {getFieldDecorator('createUserName', {
                  initialValue: data.createUserName
                })(
                  <Input style={{width: 200}} disabled={true} />
                )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`转出科室`} {...formItemLayout}>
                {getFieldDecorator('outDeptName', {
                  initialValue: data.outDeptName
                })(
                  <Input style={{width: 200}} disabled={true} />
                )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`转入科室`} {...formItemLayout}>
                {getFieldDecorator('inDeptName', {
                  initialValue: data.inDeptName
                })(
                  <Input style={{width: 200}} disabled={true} />
                )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`新存放地址`} {...formItemLayout}>
                {getFieldDecorator('newAdd', {
                  initialValue: data.newAdd
                })(
                  <Input style={{width: 200}} disabled={true} />
                )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`新保管人`} {...formItemLayout}>
                {getFieldDecorator('maintainUserName', {
                  initialValue: data.maintainUserName
                })(
                  <Input style={{width: 200}} disabled={true} />
                )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`计划转科时间`} {...formItemLayout}>
                {getFieldDecorator('transferDate', {
                  initialValue: data.transferDate?data.transferDate.substr(0,11):''
                })(
                  <Input style={{width: 200}} disabled={true} />
                )}
                </FormItem>
              </Col>
            </Row>
            <Row>
                <FormItem label={`转科原因`} {...formStyleLayout}>
                  {getFieldDecorator('transferCause', {
                    initialValue: data.transferCause?data.transferCause.substr(0,11):''
                  })(
                    <TextArea  style={{width: 608}} disabled={true}/>
                  )}
                </FormItem>
                <FormItem label={`申请附件`} {...formStyleLayout}>
                  {getFieldDecorator('tfAccessory', {
                    initialValue:this.initAccessoryFormat(data,'tfAccessory')||[],
                    valuePropName: 'fileList',
                    getValueFromEvent:this.normFile
                  })(
                    <Upload
                      {...commonUploadProps}
                    >
                    </Upload>
                  )}
                </FormItem>
            </Row>
          </Form>
        </Card>

        {/* 资产信息部分 */}
        <Card title="资产信息" bordered={false} style={{marginTop: 4}} className="min_card">
          <RemoteTable
            showHeader={true}
            columns={columns} 
            rowKey={'transferDetailGuid'}
            style={{marginTop: 10}} 
            scroll={{x: '100%', y : document.body.clientHeight - 110 }}
            size="small"
            url={transfer.getSelectTransferDetailList}
            query={{transferGuid:this.props.match.params.id||this.props.id}}
          />
        </Card>
        <Card title="转科意见" bordered={false} style={{marginTop: 4}} className="min_card">
          <Form>
            <Row>
              <Col span={24}>
                <FormItem label="意见" {...formStyleLayout}>
                {getFieldDecorator('transferOpinion',{
                  initialValue: data.transferOpinion
                })(<TextArea rows={4} disabled={true}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="clearfix">
                <FormItem label={`审批附件`} {...formStyleLayout} >
                  {getFieldDecorator('spAccessory', {
                    initialValue:this.initAccessoryFormat(data,'spAccessory')||[],
                    valuePropName: 'fileList',
                    getValueFromEvent:this.normFile
                  })(
                    <Upload
                      {...commonUploadProps}
                    >
                    </Upload>
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
export default Form.create()(TransferManagerDetails);