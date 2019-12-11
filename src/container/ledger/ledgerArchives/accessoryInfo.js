/**
 *  档案管理-资产档案-详情-附件信息
 */
import React, { Component } from 'react';
import { Row,Col,Icon,Upload,Button ,Input,message,Alert,Select,Form,Modal,Divider} from 'antd';
import TableGrid from '../../../component/tableGrid';
import assets from '../../../api/assets';
import { FTP } from '../../../api/local';
import { fetchData } from '../../../utils/tools';
import { certCodeData } from "../../../constants";
import querystring from 'querystring';
const FormItem =Form.Item;
const { Option } =  Select;
const { RemoteTable } = TableGrid;
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
class AccessoryInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      messageError : "",
      showModal:false,//控制弹出层
      certCode:'00',//默认选择的上传类型 / 将用于上传参数data
      record:null,//当前正在编辑的附件信息
      editable:true,//当前编辑状态
      banType:false,//当前类型是否能编辑
    }
  }

  //搜索内容
  queryHandler = () => {
    let query = this.props.form.getFieldsValue(['certCode_search','accessoryName_search']);
    const { certCode_search , accessoryName_search } = query;
    const { assetsRecordGuid } = this.props;
    query.certCode = certCode_search;
    query.accessoryName = accessoryName_search;
    query.assetsRecordGuid = assetsRecordGuid;
    delete query['certCode_search']
    delete query['accessoryName_search']
    this.refs.table.fetch(query);
    this.setState({ query })

  }
  //删除
  handleDelete = (accessoryId) => {
    fetchData(assets.deleteAssetsFile, querystring.stringify({accessoryId}), data => {
      if(data.status){
          message.success("操作成功!");
          this.refs.table.fetch();
      }else{
        message.error(data.msg)
      }
    })
  }

  /* 附件相关内容   */
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  //回显附件格式
  initAccessoryFormat =( backData , pathname , filename)=>{
    if(backData){
      let path=backData[pathname];
      let file=backData[filename];
      if(Array.isArray(path)){
        return path
      }else if(path){
        let list = path.split(';');
        let filenameList = file.split(';');
        let retList = []
        list.map((item,index)=>{
          if(item!==""){
            let Item =  {
                  uid: index,
                  key:index,
                  name: filenameList[index],
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
  //处理提交数据的格式
  formatAccessory=(fileList)=>{//obj  此处直接接收的为fileList的值
    if(fileList&&fileList.length){
      let tfAccessoryFileList =[];
      let accessoryNameList =[];
      fileList.map(item=>{
        if(item.response){
          tfAccessoryFileList.push(item.response.result.filePath)
          accessoryNameList.push(item.response.result.accessoryName)
        }else{
          if(item.url){
            accessoryNameList.push(item.name)
            tfAccessoryFileList.push(item.url.replace(FTP,''))
          }
        }
        return item
      })
      console.log(tfAccessoryFileList,accessoryNameList)
      return {
        tfAccessoryFile:tfAccessoryFileList.join(';'),
        accessoryName:accessoryNameList.join(';'),
      }
    }else{
      return {
        tfAccessoryFile:null,
        accessoryName:null
      }
    }
  }
  //上传附件之前过滤类型与大小
  beforeUploadFilter = (file, fileList , config)=>{
    this.setState({loading: true});
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
    if(file.status === 'done' && file.status.response) {
      file.response && !file.response.status && message.error('上传失败，请重新上传');
      fileList.filter((file) => file.response&&file.response.status);
      fileList.map((file) => {   //修改预览地址
        if (file.response && file.response.result) {
          let url = file.response.result.filePath.split('/');
          url.shift();
          url = url.join('/');
          file.url = FTP + '/' + url;
        }
        if(file.type.toLocaleLowerCase()==="application/pdf" || file.type.toLocaleLowerCase()==="application/zip" ){
          file.thumbUrl = require('../../../assets/fujian.png')
        }
        return file;
      });
    }
  }
  // 提交弹窗中的数据 submit
  submit = () => {
    const { record } = this.state;
    this.props.form.validateFieldsAndScroll((errs,values)=>{
      if(!errs){
        delete values['certCode_search']
        delete values['accessoryName_search']
        values.assetsRecordGuid = this.props.assetsRecordGuid;
        values.certCode = this.state.certCode;
        const { accessoryName , tfAccessoryFile} = this.formatAccessory(values.tfAccessoryFile);
        values.accessoryName = accessoryName ? accessoryName :"";     //附件名字字符串
        values.tfAccessoryFile = tfAccessoryFile?tfAccessoryFile:""; //附件路径字符串
        if(record&&record.accessoryId){
          values.accessoryId=record.accessoryId
        }
        console.log('modal values', values)
        fetchData(assets.insertAssetsFile, querystring.stringify(values), data => {
          if(data.status){
            this.setState({showModal:false,editable:true,record:null,banType:false})
            this.refs.table.fetch()
            this.props.freshDetail();//刷新资产档案的图片
          }else{
            message.error(data.msg)
          }
        })
      }
    })
  }

  render () {
    const columns = [
      {
        title:'序号',
        dataIndex:'index',
        width: 50,
        render:(text,record,index)=>`${index+1}`
      },
      {
        title:'文件名',
        dataIndex:'accessoryName',
        width:200
      },
      {
        title: '文档类型',
        dataIndex: 'certCode',
        width: 100,
        render : text => certCodeData[text].text
      },
      {
        title: '上传者',
        dataIndex: 'createUserName',
        width: 100
      },
      {
        title: '上传时间',
        dataIndex: 'createTime',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'certId',
        width: 80,
        render: (text, record) => 
          <span>
            <a  onClick={()=>this.setState({record,showModal:true,editable:false})}>查看</a>
            <Divider type="vertical" />
            <a  onClick={()=>this.setState({record,showModal:true,banType:true})}>编辑</a>
            <Divider type="vertical" />
            <a onClick={this.handleDelete.bind(null, record.accessoryId)}>删除</a>
          </span>  
      },
    ];
    const { record , editable , showModal , banType } = this.state;
    const { assetsRecordGuid } = this.props;
    const { getFieldDecorator } = this.props.form;
   
    const commonProps = {
      listType: 'picture',
      action: assets.assetsUploadFile,
      withCredentials: true,
      showUploadList:{
        showRemoveIcon:editable
      },
      data:{"assetsRecordGuid":this.props.assetsRecordGuid},
    };
    
    return (
      <div className='ysynet-content ysynet-common-bgColor' style={{padding:'12px 24px'}}>
          {
              this.state.messageError === "" ? null
              :
              <Alert message="错误提示"  type="error" description={<div dangerouslySetInnerHTML={{__html:this.state.messageError}}></div>} showIcon closeText="关闭" />
          }
          <Row style={{marginTop:10}}>
            <Col span={8}>
              <FormItem label='文档类型' {...formItemLayout}>
                {
                  getFieldDecorator('certCode_search',{
                    initialValue:''
                  })(
                    <Select style={{width: '100%'}}>
                    {/* 00登记表，01验收表，02合同，03资产图片，04其他 */}
                      <Option value=''>全部</Option>
                      <Option value='00'>登记表</Option>
                      <Option value='01'>验收表</Option>
                      <Option value='02'>合同</Option>
                      <Option value='03'>资产图片</Option>
                      <Option value='04'>其他</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='文件名' {...formItemLayout}>
                {
                  getFieldDecorator('accessoryName_search')(
                    <Input style={{width: '100%'}}/>
                  )
                }
              </FormItem>
            </Col>
            <Col span={3}>
                <Button type='primary' style={{float: 'right'}} onClick={this.queryHandler}>搜索</Button>
            </Col>
          </Row>
          <Row>
            <Button type='primary' onClick={()=>this.setState({showModal:true})}>新增文档</Button>
          </Row>
          <RemoteTable
            loading={ this.state.loading}
            ref='table'
            showHeader={true}
            query={{ assetsRecordGuid }}
            url={assets.selectCertInfoList}
            scroll={{x: '100%', y : document.body.clientHeight - 341}}
            columns={columns}
            rowKey={'RN'}
            style={{marginTop: 10}}
            size="small"
          /> 
         
          <Modal 
            maskClosable={false}
            destroyOnClose={true}
            title={editable?'新增/编辑文档':'查看文档'}
            footer={editable?(
              <div>
                  <Button type='primary' onClick={this.submit}>提交</Button>
                  <Button onClick={()=>this.setState({showModal:false,editable:true,record:null,banType:false})}>取消</Button>
              </div>
            ):null}
            visible={showModal}
            onCancel={()=>this.setState({showModal:false,editable:true,record:null,banType:false})}
            >
            {
              showModal && 
              (<div>
                <FormItem {...formItemLayout} label='文档类型'>
                {
                  getFieldDecorator('certCode',{
                    initialValue:record?record.certCode:'00'
                  })(
                    <Select style={{width: '100%'}}
                      disabled={!editable||banType}
                      onSelect={(e)=>this.setState({certCode:e})}>
                       {/* 00登记表，01验收表，02合同，03资产图片，04其他 */}
                      <Option value='00'>登记表</Option>
                      <Option value='01'>验收表</Option>
                      <Option value='02'>合同</Option>
                      <Option value='03'>资产图片</Option>
                      <Option value='04'>其他</Option>
                    </Select>
                  )
                }
            </FormItem>
                <FormItem {...formItemLayout} label='选择文件'
                  extra='支持扩展名：.jpeg、.jpg、.png、.pdf、.zip'>
                    {getFieldDecorator('tfAccessoryFile', {
                      initialValue:this.initAccessoryFormat(record,'tfAccessoryFile','accessoryName')||[],
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                    })(
                      <Upload 
                        {...commonProps}
                        beforeUpload={(file, fileList)=>this.beforeUploadFilter(file, fileList,{type:['.jpeg','.jpg','.png','.pdf','.zip'],size:2})}
                        onChange={(info)=>this.handleChange(info, 'tfAccessoryFile')}
                      >
                      {
                        !editable ? null:
                        (this.props.form.getFieldValue('tfAccessoryFile')&&
                        this.props.form.getFieldValue('tfAccessoryFile').length )
                        >= 8 ? null : 
                        (
                          <Button>
                            <Icon type="upload" />上传文件
                          </Button>
                        )
                      }
                        
                      </Upload>
                    )}
                </FormItem>
                </div>)
            }
          </Modal>
      </div>
    )
  }
}
export default Form.create()(AccessoryInfo) 