/**
 * @file 资产转科 - 新建转科
 * @author Vania
 * @since 2018-04-08
 */
import React, { PureComponent } from 'react';
import { Layout, Card, Button, Icon , Affix, Form, Col, Row, Input, Select, DatePicker, Table, Modal, message, Upload } from 'antd';
import { productTypeData } from '../../../constants'
import tableGrid from '../../../component/tableGrid';
import querystring from 'querystring';
import request from '../../../utils/request';
import transfer from '../../../api/transfer';
import assets from '../../../api/assets';
import { FTP } from '../../../api/local';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const { RemoteTable } = tableGrid
const { TextArea } = Input;

let timeout;
let currentValue;
let currentValueRollOut;

// 表单布局样式
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
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

// 选择资产弹窗列表渲染
const productColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    render: (text, record, index) => <span>{`${index+1}`}</span>,
    width: 50
  },
  {
    title: '资产编号',
    dataIndex: 'assetsRecord',
    sorter: true,
    width: 150
  },
  {
    title: '资产名称',
    dataIndex: 'equipmentStandardName',
    width: 150
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
    title: '设备分类',
    dataIndex: 'productType',
    render: (text, record) => text ? productTypeData[text].text : null,
    width: 150
  },
  {
    title: '使用科室',
    dataIndex: 'useDept',
    width: 150
  }
]

// 新保管人模糊搜索
function fetchMaintainUsername(userName, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = userName;
  let options = {
    body:querystring.stringify({'userName':userName}),
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: d => {
      if (currentValue === userName) {
        const result = d.result;
        const userNameData = [];
        result.forEach((r) => {
          userNameData.push({
            value: r.value,
            userName: r.userName,
            deptName: r.deptName
          });
        });
        callback(userNameData);
      }
    }
  }
  request(transfer.getSelectUserNameList, options);
}

// 转出转入科室
function fetchOutDeptname( excludeUseDeptGuid , deptName, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValueRollOut = deptName;
  
  let options = {
    body:querystring.stringify({ excludeUseDeptGuid , deptName,}),
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: d => {
      if (currentValueRollOut === deptName) {
        const result = d.result;
        const deptNameData = [];
        result.forEach((r) => {
          deptNameData.push({
            value: r.value,
            text: r.text
          });
        });
        callback(deptNameData);
      }
    }
  }
  request(transfer.queryUserDeptListByUserId, options);
}
function fetchIntoDeptname( excludeUseDeptGuid ,deptName, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValueRollOut = deptName;
  let options = {
    body:querystring.stringify({ deptName , excludeUseDeptGuid,"deptType":"00"}),
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: d => {
      if (currentValueRollOut === deptName) {
        const result = d.result;
        const IntodeptNameData = [];
        result.forEach((r) => {
          IntodeptNameData.push({
            value: r.value,
            text: r.text
          });
        });
        callback(IntodeptNameData);
      }
    }
  }
  request(transfer.getSelectUseDeptList, options);
}
class NewTransfer extends PureComponent {
  state={
    loading: false,
    userNameData: [],// 新保管人保存数据
    userName: '',// 新保管人
    deptNameData: [],// 转出科室保存数据
    IntodeptNameData: [],// 转入科室保存数据
    deptName: '',// 转入转出科室
    productVisible: false,// 选择产品弹窗可视内容
    ProductType:'',//资产搜索条件
    mobile: '', //资产搜索value
    ProductModalCallBackKeys: [],//资产弹框选中保存数据的key
    ProductModalCallBack:[],//选择保管资产返回的数据
    ProductTabledata:[],//选择保管资产返回的数据(重新赋值给这个)
    CacheProductTabledata:[],//缓存
    fstate: '', //转出科室 00已转出
    useDeptGuid:'',
    data: {},
    newAddressEdit: false,
    callBack: {}
  }

  componentWillMount (){
    this.handleChangeRollOut();
    this.handleChangeInto();
  }

  // 新保管人
  handleChange = (userName) => {
    this.setState({ userName });
    fetchMaintainUsername(userName, userNameData => this.setState({ userNameData }));
  }
  // 转出科室
  handleChangeRollOut = (deptName) => {
    this.setState({ deptName });
    let val = this.props.form.getFieldsValue();
    const { outDeptguid } = val;
    fetchOutDeptname( outDeptguid , deptName, deptNameData => this.setState({ deptNameData }));
  }
  // 转入科室
  handleChangeInto = (deptName) => {
    this.setState({ deptName });
    let val = this.props.form.getFieldsValue();
    const { outDeptguid } = val;
    fetchIntoDeptname(   outDeptguid , deptName, IntodeptNameData => this.setState({ IntodeptNameData }));
  }
  showModalIs = () => {
    const values = this.props.form.getFieldsValue();
    if (values.outDeptguid) {
      this.showModal();
    } else {
      message.warning('请选择转出科室之后再选择资产！');
    }
  }
  // 资产弹窗
  showModal = () => {
    if(this.refs.proTable){
      this.refs.proTable.fetch({useDeptGuid: this.state.outDeptguid});
    }
    this.setState({productVisible: true});
  }
  handleOk = () => {
    this.setState({loading: true});
    let newData = this.state.ProductModalCallBack;
    setTimeout(() => {
      let outDeptguid = this.state.outDeptguid;
      this.resetAll(outDeptguid);
      this.setState((prevState)=>{
        // 去重: 后面的参数是根据什么去重,一定要加上
        let uniqTableData = _.uniqBy(prevState.ProductTabledata.concat(newData), 'assetsRecordGuid');
        return{
          loading: false, 
          productVisible: false ,
          ProductModalCallBack: [],
          ProductTabledata: uniqTableData
        }
      });
    }, 1000);
  }  
  handleCancel = () => {
    this.setState({
      productVisible: false,
      ProductType: '',//资产搜索条件
      mobile: '', //资产搜索value
      ProductModalCallBackKeys: [],//资产弹框选中保存数据的key
      ProductModalCallBack: [], //资产弹框选中保存数据的返回的数据
    });
  }
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
  sendEndAjax =(json)=>{
    const values = this.props.form.getFieldsValue();
    const data = {
      fstate: '00',
      useDeptGuid: values.outDeptguid,
      useDeptName: this.state.outDeptname,
    }
    let transferDetails = [],postData = {};
    json.map((item,index)=>{
      return transferDetails.push({
        assetsRecordGuid: item,
        useDeptGuid: data.useDeptGuid,
        useDeptName: data.useDeptName
      })
    });
    postData.transferDetails = transferDetails;
    postData.fstate = data.fstate;
    postData.outDeptguid = values.outDeptguid;
    postData.outDeptname = this.state.outDeptname;
    postData.inDeptguid = values.inDeptguid;
    postData.inDeptname = this.state.inDeptname;
    postData.newAdd = values.newAdd;
    postData.maintainUserid = values.maintainUserid;
    postData.transferCause = values.transferCause;
    postData.tfAccessory = this.formatAccessory(values.tfAccessory);
    if (this.state.maintainUsername) {
      postData.maintainUsername = this.state.maintainUsername.split('-')[0];
    }
    postData.transferDate = values.transferDate.format('YYYY-MM-DD');
    console.log(JSON.stringify(postData),'postData')
    let options = {
      body:JSON.stringify(postData),
      headers: {
        'Content-Type': 'application/json'
      },
      success: data => {
        if(data.status){
          message.success('新增成功');
          this.props.form.resetFields();
          this.setState({ProductTabledata: [],ProductModalCallBackKeys : []});
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    }
    request(transfer.getInsertTransfer,options)
  }
  resetAll=(val)=>{
    let { ProductModalCallBack, outDeptname } = this.state;
    ProductModalCallBack.map((item,index)=> {
      item.useDept = outDeptname;
      item.useDeptGuid = val;
      return null;
    });
  }
  // 资产弹框搜索框
  productQueryHandler = (value) => {
    //this.setState({mobile: value});
    let json = {
      ProductType: this.state.ProductType,
      mobile: value,
      // useDeptGuid: this.state.inDeptguid
      useDeptGuid: this.state.outDeptguid
    }
    this.refs.proTable.fetch(json);
  }
  // 通过转入科室接口带出新存放地址数据
  getNewAddessInfo = (value,option) => {
    this.setState({inDeptguid: value,inDeptname:option.props.children});
    let options = {
      body:querystring.stringify({'deptId': value}),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        const values = this.props.form.getFieldsValue();
        if (data.result.length === 0) {
          values.newAdd = '';
          this.setState({newAddressEdit: false});
          this.props.form.setFieldsValue({newAdd:''})
        } else {
          const result = data.result[0].address;
          values.newAdd = result;
          this.setState({newAddressEdit: true});
          this.props.form.setFieldsValue({newAdd:result})
        }
        // this.setState({data: values});
      }
    }
    request(transfer.getSelectDeptAddress, options);
  }
  //保存
  save = () =>{
    const { ProductModalCallBackKeys } = this.state;
    if (!ProductModalCallBackKeys.length) {
      return message.warning("请至少选择一条资产！");
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.sendEndAjax(this.state.ProductModalCallBackKeys);
      }
    })
  }
  // 假删除
  deleteProRow =(isParent,record)=>{
    let { ProductModalCallBackKeys } = this.state;
    let a =_.cloneDeep(this.state.ProductTabledata);
    if(isParent){//如果是删除父级
      _.remove(a,function(n){
        ProductModalCallBackKeys = ProductModalCallBackKeys.filter((sub)=>{
          return sub !== record.assetsRecordGuid
        })
        return n.assetsRecord===record.assetsRecord
      })
    }
    this.setState({
      ProductTabledata: a,
      CacheProductTabledata: a,
      ProductModalCallBackKeys
    })
  }

  //选择转出科室下拉框-
  setRollOut = (val,option) =>{
    this.props.form.setFieldsValue({
      inDeptguid:"",
      newAdd:"",
    })
    let outDeptguid = this.props.form.getFieldValue('outDeptguid');
    fetchIntoDeptname( outDeptguid , val, IntodeptNameData => this.setState({ IntodeptNameData }));
    this.setState({newAddressEdit:false, outDeptguid:val, outDeptname: option.props.children })
  }

  //转出科室
  fetchSelect = (input)=>{

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

  render() {
    const { productVisible, ProductType, mobile, ProductModalCallBackKeys, ProductTabledata, data } = this.state;
    const { getFieldDecorator } = this.props.form;
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
      // data:{tfAccessoryGuid:'666'},
    }
    // 资产列表渲染
    const columns = [
      {
        title: '操作',
        dataIndex: 'transferGuid',
        width: 150,
        render: (text, record, index) => { 
          return <a onClick={()=>this.deleteProRow(true,record)}>删除</a>;
        }
      },
      {
        title: '资产编号',
        dataIndex: 'assetsRecord',
        width: 200,
        sorter: true
      },
      {
        title: '资产名称',
        dataIndex: 'equipmentStandardName',
        width: 200
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
        dataIndex: 'useDept',
        width: 100
      }
    ]
    return (
      <Content className='ysynet-content'>
        {/* 保存申请信息按钮部分 */}
        <Affix>
          <div style={{background: '#fff', padding: '10px 20px', marginBottom: 4, display: 'flex', alignContent: 'center', justifyContent: 'flex-end'}}>
            <Button type="primary" onClick={this.save}>保存</Button>
          </div>
        </Affix>
        {/* 申请信息部分 */}
        <Card title="申请信息" bordered={false} className="min_card">
          <Form ref='searchForm'>
            <Row>
              <Col span={8}>
                <FormItem label={`申请人`} {...formItemLayout}>
                  {getFieldDecorator('createUserName', {initialValue: this.props.user.userName})(<Input style={{width: 200}} disabled={true} placeholder={`请输入当前用户名`} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`转出科室`} {...formItemLayout}>
                {getFieldDecorator('outDeptguid',{
                  rules:[
                    {required:true, message: '请搜索选择转出科室'}
                  ]
                })(
                  <Select
                  showSearch
                  filterOption={false}
                  onSearch={this.handleChangeRollOut}
                  // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  style={{width: 200}}
                  onSelect={(val,option)=>this.setRollOut(val,option)}
                  placeholder={`请搜索选择转出科室`}
                >
                  {this.state.deptNameData.map(d => {
                    return <Option value={d.value} key={d.value}>{d.text}</Option>
                  })}
                </Select>
                )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`转入科室`} {...formItemLayout}>
                {getFieldDecorator('inDeptguid',{
                  rules:[
                    {required:true, message: '请搜索选择转入科室',}
                  ]
                })(
                  <Select
                  showSearch
                  filterOption={false}
                  onSearch={this.handleChangeInto}
                  // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  style={{width: 200}}
                  placeholder={`请搜索选择转入科室`}
                  disabled={this.state.outDeptguid?false:true}
                  onSelect={this.getNewAddessInfo}
                  >
                    {this.state.IntodeptNameData.map(d => {
                      return <Option value={d.value} key={d.value}>{d.text}</Option>
                    })}
                  </Select>
                )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label={`新存放地址`} {...formItemLayout}>
                  {getFieldDecorator('newAdd', {
                    initialValue: data.newAdd,
                    rules:[
                      {required: true, message: '新存放地址不能为空'}
                    ]
                  })(
                    <Input disabled={this.state.newAddressEdit} placeholder={`请输入新存放地址`} style={{width: 200}}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`新保管人`} {...formItemLayout}>
                {getFieldDecorator('maintainUserid',{})(
                  <Select
                  showSearch
                  onSearch={this.handleChange}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  allowClear={true}
                  filterOption={false}
                  style={{width: 200}}
                  onSelect={(val,option) => this.setState({ maintainUsername:option.props.children })}
                  placeholder={`请搜索选择新保管人`}
                >
                  {this.state.userNameData.map(d => {
                    return <Option value={d.value} key={d.value}>{d.userName+'-'+d.deptName}</Option>
                  })}
                </Select>
                )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`计划转科时间`} {...formItemLayout}>
                  {getFieldDecorator('transferDate', {
                    rules: [
                      {required: true, message: '请选择计划转科时间'}
                    ]
                  })(<DatePicker style={{width: 200}} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <FormItem label={`转科原因`} {...formStyleLayout}>
                  {getFieldDecorator('transferCause', {
                    rules: [{max: 250}]
                  })(
                    <TextArea  style={{width: 608}} placeholder={`请输入转科原因`} maxLength="250" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <FormItem label={`申请附件`} {...formStyleLayout}
                  extra='上传申请附件（最大2M，推荐分辨率1200x750，支持扩展名：.jpg、jpeg、.png，最多1张）'>
                  {getFieldDecorator('tfAccessory', {
                    valuePropName: 'fileList',
                    getValueFromEvent:this.normFile
                  })(
                    <Upload
                      {...commonUploadProps}
                      beforeUpload={(file, fileList)=>this.beforeUploadFilter(file, fileList,{type:['.jpg','.jpeg','.png'],size:2})}
                      onChange={(info)=>this.handleChangeUpload(info, 'tfAccessory')}
                    >
                      { this.props.form.getFieldValue('tfAccessory')&&
                        this.props.form.getFieldValue('tfAccessory').length
                        >= 1 ? null : uploadButton}
                    </Upload>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        {/* 资产信息部分 */}
        <Card title="资产信息" bordered={false} style={{marginTop: 4}} className="min_card">
          <Button type="primary" style={{marginBottom: 10}} onClick={() => this.showModalIs()}>选择资产</Button>
          <Table
          columns={columns}
          scroll={{x: '100%'}}
          rowKey={'assetsRecordGuid'}
          dataSource={ProductTabledata}
          />
        </Card>

        {/* 选择资产弹窗 */}
        <Modal
        visible={productVisible}
        title={`选择要转科的资产`}
        width='900px'
        onOk={()=>this.handleOk()}
        onCancel={()=>this.handleCancel()}
        footer={null}
        >
          <Row>
            <Col span={20} style={{marginBottom: 15}}>
              <Select name="ProductType" value={ProductType} onChange={(v)=>{this.setState({ProductType: v})}} style={{width: 200}}>
                <Option value="">全部分类</Option>
                <Option value="01">通用设备</Option>
                <Option value="02">电气设备</Option>
                <Option value="03">电子产品及通信设备</Option>
                <Option value="04">仪器仪表及其他</Option>
                <Option value="05">专业设备</Option>
                <Option value="06">其他</Option>
              </Select>
              <Search
              placeholder="请输入资产编号/名称"
              style={{width: 350, marginLeft: 15}}
              enterButton="搜索"
              onChange={(v)=>{this.setState({mobile: v.target.value})}}
              value={mobile}
              onSearch={value=>{this.productQueryHandler(value)}}
              />
            </Col>
            <Col span={4} style={{textAlign: 'right'}}>
              <Button key="submit" type="primary" onClick={()=>this.handleOk()}>添加</Button>
            </Col>
          </Row>
          {/* RemoteTable-->远程连接,需要一个url接口,因此假数据对他不起作用 */}
          <RemoteTable
          ref='proTable' // 根据搜索后进行刷新列表
          showHeader={true}
          query={{useDeptGuid: this.state.outDeptguid}}
          url={assets.selectAssetsIsNormalUseList}
          rowKey={'assetsRecordGuid'}
          columns={productColumns}
          scroll={{x: '100%', y: document.body.clientHeight - 110 }}
          size="small"
          rowSelection={{
            // 选中项发生变化的时的回调
            selectedRowKeys: ProductModalCallBackKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              // 参数1.是assetsRecordGuid的value  参数2.一组数据
              // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              this.setState({
                'ProductModalCallBack': selectedRows, //全部数据
                'ProductModalCallBackKeys': selectedRowKeys //key值ID
              })
            },
            getCheckboxProps: record => {
              return ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
              })
            },
          }}
          />
        </Modal>
      </Content>  
    )
  }
}
export default withRouter(connect(state => state)(Form.create()(NewTransfer)));