/**
 * @file 资产转科 - 转科管理 - 转科管理操作
 * @author Vania
 * @since 2018-04-09
 */
import React, { PureComponent } from 'react';
import styles from './style.css';
import { Layout, Card, Form, Row, Col, Input, Upload, Icon, Affix, Button, message } from 'antd';
import tableGrid from '../../../component/tableGrid';
import request from '../../../utils/request';
import querystring from 'querystring';
import transfer from '../../../api/transfer';
import { FTP } from '../../../api/local';

const { Content } = Layout;
const FormItem = Form.Item;
const { TextArea } = Input;
const { RemoteTable } = tableGrid

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

class TransferRecordEdit extends PureComponent {
  state = {
    data:[],
    transferGuid: '',
  };  
  
  componentWillMount =() =>{
    //获取id 根据id号查详情
    const transferGuid = this.props.match.params.id || this.props.id;
    this.setState({transferGuid: transferGuid})
    this.getApplyInfo({transferGuid});
  }
  //获取详情
  getApplyInfo = (transferNo) => {
    let options = {
      body:querystring.stringify({transferGuid: transferNo}),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        const result = data.result.rows[0];
        this.setState({data:result});
      }
    }
    request(transfer.getSelectTransferList, options);
  }
  /**--------------------图片上传内容Start-------------------------*/
  formatAccessory=(fileList)=>{//obj  此处直接接收的为fileList的值
    if(fileList&&fileList.length){//保留上传时返回的 24321/的地址路径
      let retList = fileList.map(item=>{
          if(item.response){
            return item.response.result
          }else{
            return item.url.replace(FTP,'')
          }
      })
      return retList.join(';')
    }else{
      return null
    }
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
  //上传附件之前过滤类型与大小
  beforeUploadFilter = (file, fileList,config)=>{
    //过滤文件大小
    const isLt2M = file.size   < config.size * 1024 * 1024;
    let type = false;
    if (!isLt2M) {
      message.error(`上传文件不能大于${config.size}MB!`);
      return false
    }
    //过滤文件类型
    for(let i =0;i<config.type.length;i++){
       let strArr = file.name.split('.');
       if (config.type[i] === (`.${strArr[strArr.length-1]}`).toLocaleLowerCase()) {
         type=true
         return
       }else{
         type=false
       }
    }
    if (!type) {
      message.error('您只能上传该附件支持的文件类型');
    }
    
    return type && isLt2M;
  }
  handleChangeUpload = (fileListObj) => {
    let { file , fileList } = fileListObj;  
    if(file.status === 'done') {
      file.response && !file.response.status && message.error('上传失败，请重新上传');
      fileList.filter((file) => file.response&&file.response.status);
      fileList.map((file) => {   //修改预览地址
        if (file.response) {
          let url = file.response.result.split('/');
          url.shift();
          url = url.join('/');
          file.url = FTP.YSYPATH + '/' + url;
        }
        if(file.type==="application/pdf"){
          file.thumbUrl = require('../../../assets/fujian.png')
        }
        return file;
      });
    }
  }
  /**--------------------图片上传内容End-------------------------*/
  //提交数据
  handleSubmit = (fstate) =>{
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
          // values.fstate = fstate;
          // values.transferGuid = this.state.transferGuid;
          // values.spAccessory = this.formatAccessory(values.spAccessory);
          // debugger
          let json ={
            transferGuid  :this.state.transferGuid,
            fstate : fstate,
            transferOpinion: values.transferOpinion,
            spAccessory:this.formatAccessory(values.spAccessory)
          }
          console.log(JSON.stringify(json))
          this.sendAjax(json)
      }
    });
  }
  //发出请求
  sendAjax = (value) =>{
    let options = {
      body:querystring.stringify(value),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          message.success( '操作成功')
          setTimeout(()=>{
            this.props.history.push('/transfer/transferManager')
          },1000)
        }else{
          message.error(data.msg)
        }
      }
    }
    request(transfer.getUpdateTransfer, options)
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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const commonUploadProps ={
      action:transfer.uploadFile,
      listType:"picture-card",
      withCredentials: true,
      name:"file",
      showUploadList:{
        showRemoveIcon:false
      }
    }
    const { data } = this.state;
    const { getFieldDecorator } = this.props.form;
    return(
      <Content>
        {/* 保存申请信息按钮部分 */}
        <Affix>
          <div style={{background: '#fff', padding: '10px 20px', marginBottom: 4, display: 'flex', alignContent: 'center', justifyContent: 'flex-end'}}>
            <Button type="default" onClick={()=>this.handleSubmit('07')}>关闭</Button>
            <Button type="primary" style={{marginLeft: 22}} onClick={()=>this.handleSubmit('03')}>完成</Button>
          </div>
        </Affix>
        <Form>
          {/* 申请信息部分 */}
          <Card title="申请信息" bordered={false} className="min_card">
          <Row>
              <Col span={8}>
                <FormItem label={`申请人`} {...formItemLayout}>
                {getFieldDecorator('createUserName', {
                  initialValue:data.createUserName
                })(<Input style={{width: 200}} disabled={true} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`转出科室`} {...formItemLayout}>
                  {getFieldDecorator('outDeptName',{
                    initialValue:data.outDeptName
                  })(<Input style={{width: 200}} disabled={true} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`转入科室`} {...formItemLayout}>
                  {getFieldDecorator('inDeptName',{
                    initialValue:data.inDeptName
                  })(<Input style={{width: 200}} disabled={true} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`新存放地址`} {...formItemLayout}>
                  {getFieldDecorator('newAdd',{
                    initialValue:data.newAdd
                  })(<Input style={{width: 200}} disabled={true} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`新保管人`} {...formItemLayout}>
                  {getFieldDecorator('maintainUserName',{
                    initialValue:data.maintainUserName
                  })(<Input style={{width: 200}} disabled={true} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`计划转科时间`} {...formItemLayout}>
                  {getFieldDecorator('transferDate',{
                     initialValue: data.transferDate?data.transferDate.substr(0,11):''
                  })(<Input style={{width: 200}} disabled={true} />)}
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
          </Card>
          {/* 资产信息部分 */}
          <Card title="资产信息" className={`${styles.defineForm}  min_card`}  bordered={false} style={{marginTop: 4}} >
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
            <Row>
              <Col span={24}>
                <FormItem label="意见" {...formStyleLayout}>
                  {getFieldDecorator('transferOpinion')(<TextArea rows={4}  />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
                <FormItem label={`审批附件`} {...formStyleLayout}>
                  {getFieldDecorator('spAccessory', {
                    valuePropName: 'fileList',
                    getValueFromEvent:this.normFile
                  })(
                    <Upload
                      {...commonUploadProps}
                      showUploadList={{
                        showRemoveIcon:true
                      }}
                      beforeUpload={(file, fileList)=>this.beforeUploadFilter(file, fileList,{type:['.jpg','.jpeg','.png'],size:2})}
                      onChange={(info)=>this.handleChangeUpload(info, 'spAccessory')}
                    >
                      { this.props.form.getFieldValue('spAccessory')&&
                        this.props.form.getFieldValue('spAccessory').length
                        >= 3 ? null : uploadButton}
                    </Upload>
                  )}
                </FormItem>
            </Row>
          </Card>
        </Form>
      </Content>
    )
  }
}
export default Form.create()(TransferRecordEdit);
