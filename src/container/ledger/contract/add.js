/*
 * @Author: yuwei - 新建合同
 * @Date: 2018-07-10 16:45:38 
* @Last Modified time: 2018-07-10 16:45:38 
 */
import React, { Component } from 'react';
import { Row,Col,Input, Layout,Button,message,Form,Select, Upload , Icon} from 'antd';
import ledger from '../../../api/ledger';
import upkeep from '../../../api/upkeep';
import request from '../../../utils/request';
import queryString from 'querystring';
// import PicWall from '../../../component/picWall';
import { FTP } from '../../../api/local';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { contractTypeSelect  } from '../../../constants';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const formItemLayoutLine = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const formItemLayoutLine2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
class AddContract extends Component {
  state={
    query:{},
    manageSelect:[],
    useSelect:[],
    outDeptOptions: [],
    postFile:[],
    editStatus:false,
    editStatusText:'新建合同',
    fOrgName:"",//乙方名称
    bDeptName:"",//管理科室名称
    fillBackData:{},//回填数据
  }
  componentDidMount = () => {
    console.log(this.props)
    //this.props.user.orgName/orgId
    if(this.props.match.params.id){
      console.log('编辑状态')
      this.setState({
        editStatusText:'编辑合同',
        editStatus:true,
      })
      request(ledger.queryContractList,{
        body:queryString.stringify({contractId:this.props.match.params.id}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            this.setState({fillBackData:data.result.rows[0]})
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      })
    }
    this.getManageSelect();
    this.getUseSelect();
    this.outDeptSelect();
  }

  getManageSelect = () => {
    request(ledger.selectUseDeptList,{
      body:queryString.stringify({deptType:"01"}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({manageSelect:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  getUseSelect = () => {
    request(ledger.selectUseDeptList,{
      body:queryString.stringify({deptType:"00"}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({useSelect:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  outDeptSelect = () => {
    request(ledger.getSelectFOrgList,{
      body:queryString.stringify({}),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
                this.setState({outDeptOptions:data.result})
        }else{
                message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }

  handleSubmit = () =>{
    this.props.form.validateFieldsAndScroll((err,values)=>{
      console.log(values)
      if(!err){
        let url = ledger.insertContract ; 
        if(this.state.editStatus){//编辑
          url = ledger.updateContract;
          delete values.rOrgId;
          delete values.RN;
          values = Object.assign(this.state.fillBackData,values);
          values.fstate="00";
        }else{//新增
          values.rOrgId=this.props.user.orgId;
          values.rOrgName=this.props.user.orgName;
          values.fOrgName=this.state.fOrgName;
          values.bDeptName=this.state.bDeptName;
          values.fstate="00";
        }
        values.tfAccessoryList = this.getFileUrl(values.tfAccessory)
        delete values.tfAccessory;
        console.log(JSON.stringify(values))
        request(url,{
          body:JSON.stringify(values),
          headers: {
              'Content-Type': 'application/json'
          },
          success: data => {
            if(data.status){
              message.warn('保存成功！')      
              const {history} = this.props;
              history.push('/ledger/contract')
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      }
    })
  }

  goBack = ()=>{
    const { history } = this.props;
    history.push('/ledger/contract');
  }

  filterOption = (input, option) => {
    if(option.props.children){
      return option.props.children.indexOf(input) >= 0
    }
    return false
  }
  fetchSelect=(input)=>{
    request(ledger.selectUseDeptList,{
      body:queryString.stringify({deptType:"01",deptName:input}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({manageSelect:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }

  normFile = (e) => {
    console.log('Upload event:', e);
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
       if(config.type[i] === `.${strArr[strArr.length-1]}` || config.type[i] === `.${strArr[strArr.length-1]}`.toLocaleLowerCase()){
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
  handleChange = (fileListObj,key) => {
    let { file, fileList } = fileListObj;  
    if(file.status === 'done') {
      file.response && !file.response.status && message.error('上传失败，请重新上传');
      fileList.filter((file) => file.response&&file.response.status);
      fileList.map((file) => {   //修改预览地址
        if (file.response) {
          let url = file.response.result.split('/');
          url.shift();
          url = url.join('/');
          file.url = FTP + '/' + url;
        }
        if(file.type==="application/pdf" ||  file.type==="application/zip"){
          file.thumbUrl = require('../../../assets/fujian.png')
        }
        return file;
      });
    }
  }
  initFileUrl = (str) => {
    if( !str ) { return [] };
    let urlArr = str.split(';');
    if( urlArr && !urlArr.length ) { return [] }
    let ret = urlArr.map( (item , index ) => {
      let len = item.split('/') ;
      let name = len[ len.length -1 ];
      let type = name.split('.')[name.split('.').length-1];
      let ret = {
        uid: index,
        name,
        status: 'done',
        url:`${FTP}${item}`,
      }
      if(type === 'pdf' || type === 'zip' ){
        ret.thumbUrl = require('../../../assets/fujian.png');
      }
      return ret
    })
    ret = ret.slice(0,ret.length-1);
    return ret
  }
  getFileUrl = ( arr ) => {
    if( arr && !arr.length ) { return [] }
    let ret = arr.map( (item) => {
      if(item.status === "done" || (item.response && item.response.status) ){
        return item.url.replace(FTP,'meqm')
      }
      return null
    })
    return ret // && ret.length && ret.join(';')
  }
  
  render() {
    const commonProps = {
      listType:"picture-card",
      action: upkeep.uploadFile,
      withCredentials: true,
      beforeUpload:(file, fileList)=>this.beforeUploadFilter(file, fileList,{type:['.jpeg','.jpg','.png','.bmp','.pdf','.zip'],size:10}),
      onChange:(info)=>this.handleChange(info, 'tfAccessory')
      // showUploadList:{
      //   showRemoveIcon:editable
      // },
      // data:{"assetsRecordGuid":this.props.assetsRecordGuid},
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const { getFieldDecorator , getFieldValue } = this.props.form;
    const {  editStatusText , fillBackData } = this.state;//editStatus postFile ,
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <h3 style={{padding:'24px'}}>{editStatusText}  
          <Button style={{float:'right'}} onClick={()=>this.goBack()}>取消</Button>
          <Button type='primary' style={{float:'right',marginRight:8}}  onClick={()=>this.handleSubmit()}>确认</Button>
        </h3>
        <Form >
            <FormItem
              {...formItemLayout}
              label="合同名称"
              >
              {getFieldDecorator('contractName',{
                initialValue:fillBackData.contractName||'',
                rules:[{required:true,message:'请选择合同名称'}]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="甲方"
              >
              {getFieldDecorator('rOrgId',{
                initialValue:fillBackData.orgName||this.props.user.orgName,
                rules:[{required:true,message:'请选择甲方'}]
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="乙方"
              >
              {getFieldDecorator('fOrgId',{
                initialValue:fillBackData.fOrgId||"",
                rules:[{required:true,message:'请选择乙方'}]
              })(
                <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option)=>this.filterOption(input, option)}
                onSelect={(value, option)=>{
                  console.log(option.props.children)
                  if(option.props.children){
                    this.setState({fOrgName:option.props.children})
                  }
                }}
                >
                    <Option value="" key={-1}>全部</Option>
                    {
                        this.state.outDeptOptions.map((item,index) => {
                        return <Option key={item.orgId} value={item.orgId}>{item.orgName}</Option>
                        })
                    }
                </Select>
              )}
            </FormItem>
            <Row>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="合同类型"
                >
                  {getFieldDecorator('contractFlag',{
                    initialValue:"01",
                    rules:[{required:true,message:'请选择合同类型'}]
                  })(
                    <Select>
                    {
                      contractTypeSelect.map((item)=>{
                        return <Option value={item.value} key={item.value}>{item.text}</Option>
                      })
                    }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine2}
                  label="合同编号"
                >
                  {getFieldDecorator('contractNo',{
                    initialValue:fillBackData.contractNo||"",
                    rules:[{required:true,message:'请填写合同编号'}]
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="管理科室"
                >
                  {getFieldDecorator('bDeptGuid',{
                    initialValue:fillBackData.bDeptGuid||"",
                    rules:[{required:true,message:'请选择管理科室'}]
                  })(
                    <Select 
                      // showSearch
                      // placeholder={'请选择'}
                      // optionFilterProp="children"
                      // filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                      onSearch={this.fetchSelect}
                      showSearch
                      placeholder={'请选择'}
                      filterOption={false}
                      onSelect={(value, option)=>{
                        console.log(option.props.children)
                        if(option.props.children){
                          this.setState({bDeptName:option.props.children})
                        }
                      }}
                      >
                          {/* <Option value="" key={-1}>全部</Option> */}
                          {
                              this.state.manageSelect.map((item,index) => {
                              return <Option key={index} value={item.value}>{item.text}</Option>
                              })
                          }
                      </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayoutLine2}
                  label="申请科室"
                >
                  {getFieldDecorator('deptGuid',{
                    initialValue:fillBackData.deptGuid||"",
                  })(
                    <Select 
                    showSearch
                    placeholder={'请选择申请科室'}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                    >
                        {
                            this.state.useSelect.map((item,index) => {
                            return <Option key={index} value={item.value}>{item.text}</Option>
                            })
                        }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
            <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="合同金额"
                >
                  {getFieldDecorator('totalPrice',{
                    initialValue:fillBackData.totalPrice||"",
                    rules:[{required:true,message:'请选择合同金额'}]
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <FormItem label='附件' {...formItemLayout}
                extra="最多上传8份附件，限10M以内，支持图片格式：JPG、JPEG、PNG、BMP，支持附件格式：ZIP、PDF">
                {
                  getFieldDecorator('tfAccessory',{
                    initialValue:this.initFileUrl(fillBackData.tfAccessory)||[],
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile, 
                  })(
                    <Upload {...commonProps}>
                      {
                        getFieldValue('tfAccessory') && getFieldValue('tfAccessory').length >=8 ?
                        null:uploadButton
                      }
                    </Upload>
                  )
                }
              </FormItem>
            </Row>
        </Form>
      </Content>
    )
  }
}
export default withRouter(connect(state => state)(Form.create()(AddContract)));