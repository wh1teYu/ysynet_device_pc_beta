import React, { Component } from 'react';
import { Row,Col,DatePicker,Input,Icon, Layout,Upload,Button,Table,
  Tag,message,Radio,Menu,Dropdown,Alert, Form,Select, Modal,Progress,TreeSelect} from 'antd';
import TableGrid from '../../../component/tableGrid';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import { Link } from 'react-router-dom'
import assets from '../../../api/assets';
import basicdata from '../../../api/basicdata';
import styles from './style.css';
import { ledgerData,useFstateSel } from '../../../constants';
import request from '../../../utils/request';
// import exportRequest from '../../../utils/exportRequest';
import queryString from 'querystring';
import moment from 'moment';
import _ from 'lodash';
const Confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { RemoteTable } = TableGrid;
let useFstate = [];
let columns = [
  {
    title: '操作',
    dataIndex: 'RN',
    width: 180,
    render: (text, record) =>
      <span>
        <Link to={{pathname: `/ledger/ledgerArchives/${record.assetsRecordGuid}`}}><Icon type="profile" />详情</Link>
        <Link className={styles['ml10']}  to={{pathname: `/ledger/lifecycle/${record.assetsRecordGuid}`}}><Icon type="profile" />生命周期</Link>
        <a className={styles['ml10']} target="_blank" href={assets.printEquipmentQrcode+"?"+queryString.stringify({assetsRecordGuid:record.assetsRecordGuid})}>打码</a>
        <Link className={styles['ml10']}  to={{pathname: `/ledger/benefitAnalysis/${record.assetsRecordGuid}`}}><Icon type="profile" />效益分析</Link>
      </span>
  },
  {
    title: '资产编号',
    dataIndex: 'assetsRecord',
    width: 120,
    sorter:true
  },
  {
    title: '状态',
    dataIndex: 'useFstate',
    width: 60,
    filters: useFstateSel,
    onFilter: (value, record) => { 
      console.log(value,record.useFstate);
      if (useFstate.indexOf(value) === -1) {
        useFstate.push(value)
      }
      return (record && record.useFstate===value)
    },
    render: text =><Tag color={ledgerData[text].color}> { ledgerData[text].text } </Tag>,
  },
  {
    title: '资产名称',
    dataIndex: 'equipmentStandardName',
    width: 150
  },
  {
    title: '型号',
    dataIndex: 'fmodel',
    width: 70
  },
  // {
  //   title: '资产分类',
  //   dataIndex: 'productType',
  //   width: 100,
  //   render: text => text ?  productTypeData[text].text  : null
  // },
  {
    title: '保管员',
    dataIndex: 'custodian',
    width: 100
  },
  {
    title: '使用科室',
    dataIndex: 'useDept',
    width: 120
  },
  {
    title: '管理科室',
    dataIndex: 'bDept',
    width: 70
  },
  {
    title: '购买金额',
    dataIndex: 'buyPrice',
    width: 70,
    render:(text)=>Number(text)?Number(text).toFixed(2):''
  },
  {
    title: '购置日期',
    dataIndex: 'buyDate',
    width: 120,
    render:(text)=>text?text.substr(0,11):''
  },
];
const messageInfo = "添加大量的信息，建议使用导入功能。导入前请先下载Excel格式模版文件。";
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

class SearchForm extends Component {

  state={
    display: this.props.isShow?'block':'none',expand:this.props.isShow,
    manageSelect:[],
    outDeptOptions: [],
    treeData:[],
  }
  constructor(props){
    super(props)
    this.fetchSelect = _.debounce(this.fetchSelect,500)
    this.fetchUseSelect = _.debounce(this.fetchUseSelect,500)
  }
  componentDidMount = () => {
    this.getManageSelect();
    this.outDeptSelect();
    this.getTreeData();
  }

  getManageSelect = () => {
    request(assets.queryManagerDeptListByUserId,{
      body:queryString.stringify({}),
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
  outDeptSelect = () => {
    request(assets.selectUseDeptList,{
      body:queryString.stringify({deptType:"00"}),
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
  //获取物资分类
  getTreeData = (searchName) => {
    const json = {tfClo:'material',searchName};
    request(basicdata.searchStaticZc,{
      body:queryString.stringify(json),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: data => {
        if (data.status) {
          let treeData = this.formatTreeData(data.result);
          this.setState({ treeData });
        } else {
          message.error(data.msg);
        }
      },
      error: err => {console.log(err)}
    })
  }
  //处理物资分类数据
  formatTreeData = (data) => {
    return data.map((item)=>{
      item.title = item.tfComment;
      item.value = item.key = item.staticId;
      if (item.children) {
        this.formatTreeData(item.children);
      }
      return item
    })
  }

  //物资分类 搜索
  onChange = (value, label, extra) => {
    this.props.form.resetFields('typeId');
    this.getTreeData(value)
  }

  toggle = () => {
    const { display , expand} = this.state;
    this.props.changeQueryToggle()
    this.setState({
      display: display === 'none' ? 'block' : 'none',
      expand: !expand
    })
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.buyDate){
        values.buyDateStart=moment(values.buyDate[0]).format('YYYY-MM-DD');
        values.buyDateEnd=moment(values.buyDate[1]).format('YYYY-MM-DD');
        delete values['buyDate'];
      }
      this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
    this.props.handleReset();
  }

  //管理科室
  fetchSelect = (input)=>{
    request(assets.queryManagerDeptListByUserId,{
      body:queryString.stringify({}),
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
  //使用科室- 简码搜索
  fetchUseSelect = (input)=>{
    request(assets.selectUseDeptList,{
      body:queryString.stringify({deptType:"00",deptName:input}),
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
  render(){
    const { getFieldDecorator } = this.props.form;
    const { display, treeData } = this.state;
    console.log("treeData",treeData)
    return (
      <Form  onSubmit={this.handleSearch}>
        <Row>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="资产编码"
            >
              {getFieldDecorator('assetCode')(
                <Input placeholder='请输入资产编码'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="资产名称"
            >
              {getFieldDecorator('assetName')(
                <Input placeholder='请输入资产名称'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="型号"
            >
              {getFieldDecorator('fmodel')(
                <Input  placeholder='请输入型号'/>
              )}
            </FormItem>
          </Col>
          <Col span={6} style={{textAlign:'right',paddingRight:15,paddingTop:5}}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginLeft: 8,}} onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
          </Col>
        </Row>
        <Row style={{display: display}}>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="规格"
            >
              {getFieldDecorator('spec')(
                <Input  placeholder='请输入规格'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="管理科室"
            >
              {getFieldDecorator('manageDeptGuid',{
                initialValue:""
              })(
                <Select
                onSearch={this.fetchSelect}
                showSearch
                placeholder={'请选择'}
                filterOption={false}
                >
                    <Option value="" key={-1}>全部</Option>
                    {
                        this.state.manageSelect.map((item,index) => {
                        return <Option key={index} value={item.value}>{item.text}</Option>
                        })
                    }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="使用科室"
            >
              {getFieldDecorator('useDeptGuid',{
                initialValue:""
              })(

                <Select
                onSearch={this.fetchUseSelect}
                showSearch
                placeholder={'请选择'}
                filterOption={false}
                >
                    <Option value="" key={-1}>全部</Option>
                    {
                        this.state.outDeptOptions.map((item,index) => {
                        return <Option key={index} value={item.value.toString()}>{item.text}</Option>
                        })
                    }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="供应商"
            >
              {getFieldDecorator('fOrgName',{
              })(
                <Input placeholder='请输入供应商'/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row style={{display: display}}>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="保管员"
            >
              {getFieldDecorator('custodian')(
                <Input placeholder='请输入保管员'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="购置日期"
            >
              {getFieldDecorator('buyDate')(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="购买金额"
            >
             <Col span={11}>
              <FormItem>
              {getFieldDecorator('buyPriceStart')(
                <Input type='number'/>
              )}
              </FormItem>
            </Col>
            <Col span={2}>
              <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                -
              </span>
            </Col>
            <Col span={11}>
              <FormItem>
              {getFieldDecorator('buyPriceEnd')(
                <Input type='number'/>
              )}
              </FormItem>
            </Col>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="物资类别"
            >
              {getFieldDecorator('typeId')(
                <TreeSelect
                  showSearch
                  filterTreeNode={false}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={treeData}
                  placeholder="请选择"
                  onSearch={this.onChange}
                />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="出厂编号"
            >
              {getFieldDecorator('eqProductNo')(
                <Input placeholder="请输入出厂编号"/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm); 

const importModalColumns =[
  {
    title:'校验结果',
    dataIndex:'remark',
    width:200
  },
  {
    title:'行数',
    dataIndex:'rn',
    width:100,
    render:(text,record,index)=>`第${record.rn}行`
  },
  {
    title:'资产编码',
    dataIndex:'assetsRecord',
    width:100
  },
  {
    title:'二维码',
    dataIndex:'qrcode',
    width:100
  },
  {
    title:'资产名称',
    dataIndex:'equipmentStandardName',
    width:100
  },
  {
    title:'注册证号',
    dataIndex:'registerNo',
    width:100
  },
  {
    title:'品牌',
    dataIndex:'brand',
    width:100
  },
  {
    title:'通用名称',
    dataIndex:'equipmentName',
    width:100
  },
  {
    title:'型号',
    dataIndex:'fmodel',
    width:100
  },
  {
    title:'规格',
    dataIndex:'spec',
    width:100
  },
  {
    title:'计量单位',
    dataIndex:'meteringUnit',
    width:100
  },
  {
    title:'购买金额',
    dataIndex:'buyPrice',
    width:100
  },
  {
    title:'使用科室',
    dataIndex:'useDeptName',
    width:100
  },
  {
    title:'保管员',
    dataIndex:'custodian',
    width:100
  },
  {
    title:'存放地址',
    dataIndex:'deposit',
    width:100
  },
  {
    title:'管理科室',
    dataIndex:'manageDeptName',
    width:100
  },
  {
    title:'生产商',
    dataIndex:'product',
    width:100
  },
  {
    title:'生产商国家',
    dataIndex:'productCountry',
    width:120
  },
  {
    title:'出厂日期',
    dataIndex:'productionDate',
    width:100
  },
  {
    title:'供应商',
    dataIndex:'fOrgName',
    width:100
  },
  {
    title:'购买日期',
    dataIndex:'buyDate',
    width:100
  },
  {
    title:'合同编号',
    dataIndex:'contractNo',
    width:100
  },
  {
    title:'保修截止日期',
    dataIndex:'inDate',
    width:120
  },
  {
    title:'折旧方式',
    dataIndex:'depreciationType',
    width:100
  },
  {
    title:'预计使用年限（年）',
    dataIndex:'useLimit',
    width:180
  },
  {
    title:'出厂编号',
    dataIndex:'eqProductNo',
    width:100
  },
  {
    title:'公用设备',
    dataIndex:'publicEquipment',
    width:100
  },
  {
    title:'自筹资金原值',
    dataIndex:'selfRaisedFunds',
    width:100
  },
  {
    title:'财政拨款原值',
    dataIndex:'fiscalAppropriation',
    width:100
  },  
  {
    title:'科研经费原值',
    dataIndex:'scientificResearchFunds',
    width:100
  },
  {
    title:'教学资金原值',
    dataIndex:'teachingFunds',
    width:100
  },
  {
    title:'科研经费原值',
    dataIndex:'receiveDonations',
    width:100
  },
  {
    title:'其他原值',
    dataIndex:'otherOriginalValue',
    width:100
  }
]
const accessoriesModalColumns = [
  {
    title:'校验结果',
    dataIndex:'remark',
    width:200
  },
  {
    title:'行数',
    dataIndex:'index',
    width:100,
    render:(text,record,index)=>`第${index+1}行`
  },
  {
    title:'资产编码',
    dataIndex:'assetsRecord',
    width:100
  },
  {
    title:'配件编码',
    dataIndex:'partsCode',
    width:100
  },
  {
    title:'证件号',
    dataIndex:'registerNo',
    width:100
  },
  {
    title:'品牌',
    dataIndex:'brand',
    width:100
  },
  {
    title:'配件名称',
    dataIndex:'partsName',
    width:100
  },
  {
    title:'型号',
    dataIndex:'fmodel',
    width:100
  },
  {
    title:'规格',
    dataIndex:'spec',
    width:100
  },
  {
    title:'单位',
    dataIndex:'meteringUnit',
    width:100
  },
  {
    title:'单价',
    dataIndex:'price',
    width:100,
    render:(text)=> text ? (text-0).toFixed(2) :''
  },
  
]
const codeColumns = [
  {
    title:'反馈信息',
    dataIndex:'result',
    width: 150,
    render:(text,record)=>{
      //"resultType" --反馈状态 01成功  02失败
      if(record.resultType==='02'){
        return (<span style={{color:'red'}}>{text}</span>)
      }else{
        return (<span>{text}</span>)
      }
    }
  },
  {
    title:'资产编号',
    width: 200,
    dataIndex:'assetsRecord'
  },
  {
    title:'资产名称',
    width: 150,
    dataIndex:'equipmentStandardName'
  },
  {
    title:'型号',
    width: 150,
    dataIndex:'fmodel'
  },
  {
    title:'规格',
    width: 150,
    dataIndex:'spec'
  },
  {
    title:'管理科室',
    width: 150,
    dataIndex:'bDeptName'
  },
  {
    title:'使用科室',
    width: 150,
    dataIndex:'useDeptName'
  }
]
class LedgerArchivesList extends Component {
  constructor(props) {
    super(props);
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    this.state = {
      loading: false,
      showProgress:false,//导入模态框的
      importModalType:"01",//导入模态框选择的导入类型
      progressPercent:0,
      importDataSource:[],//导入数据的table数据
      query:{...search[pathname],"deptType":"MANAGEMENT"},//"deptType":"MANAGEMENT"
      messageError:"",
      selectedRowKeys:[],
      tableRecords:0,
      codeModal:false,
      codeData:[],//生成编码-数据源
      countPrice:''
    }
  }
  /* 回显返回条件 */
  async componentDidMount () {
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    if (search[pathname]) {
      //找出表单的name 然后set
      let values = this.form.props.form.getFieldsValue();
      values = Object.getOwnPropertyNames(values);
      let value = {};
      values.map(keyItem => {
        value[keyItem] = search[pathname][keyItem];
        return keyItem;
      });
      this.form.props.form.setFieldsValue(value)
    }
    this.getCountPrice()
  }

  getCountPrice = (values) => {
     request(assets.selectAssetsBuyPriceSum,{
      body:queryString.stringify(values||{}),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({countPrice:data.result})           
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }

  /* 查询时向redux中插入查询参数 */
  query = (val) => {
    const { setSearch, history ,search } = this.props;
    const pathname = history.location.pathname;
    let values = Object.assign({...search[pathname]},{...val},{deptType:'MANAGEMENT'})
    setSearch(pathname, values);
    val.deptType = 'MANAGEMENT';
    this.refs.table.fetch(val)
    this.getCountPrice(val)
  }
  //打印所有
  printAll = () =>{
    if(this.state.tableRecords<=100){
      let v = this.form.props.form.getFieldsValue();
      window.open(assets.printEquipmentQrcode+"?"+queryString.stringify(v))
      this.setState({selectedRowKeys:[]})
    }else{
      message.warn('为了提高效率，打印数量请保持在100以内');
    }
  }
  //选择资产打印
  printSelect = ()=>{
    //查看选择内容
    const {selectedRowKeys} = this.state;
    if(selectedRowKeys.length>0){
      let json = {assetsGuids:selectedRowKeys}
      this.sendPrintAjax(json)
    }else{
      message.warn('请选择相关资产信息打印')
    }
  }
  sendPrintAjax = (json) => {
    Confirm({
      title:'您是否需要打印资产配件的标签?',
      content:'选择"是"，将打印配件标签，您还要继续吗?',
      onOk:()=>{
        json.extendBoolean='yes';
        window.open(assets.printEquipmentQrcode+"?"+queryString.stringify(json))
      },
      onCancel:()=>{
        window.open(assets.printEquipmentQrcode+"?"+queryString.stringify(json))
      }
    })
    this.setState({selectedRowKeys:[]})
  }
  //导出资产
  exportAssets = () => {
    const { history ,search } = this.props;
    const pathname = history.location.pathname;
    const { current, page, pageSize, sortField, sortOrder, ...json } = search[pathname] || {};
    console.log(assets.exportApplyList+'?'+queryString.stringify(json));
    window.open(assets.exportApplyList+'?'+queryString.stringify(json));
    // exportRequest(assets.exportApplyList+'?'+queryString.stringify(json))
    // fetch(assets.exportApplyList+'?'+queryString.stringify(json), {
    //   method:"get",
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    // })
    // .then(response => {
    //   const { url, filename } = response;
    //   let a = document.createElement('a');
    //   a.href = url;
    //   a.download = filename||'';
    //   a.click();
    // }).catch(e => {
    //   message.warn('导出失败')
    //   console.log('导出失败',e)
    // })
  }
  //保存
  onSubmitImport = () => {
    let arr = this.state.importDataSource;
    let filed =  this.state.importModalType ==="01" ?  "assetsRecordImportList":"partsDtoList";
    if(arr.length){
      request(assets.addAssets+'?'+queryString.stringify({importType:this.state.importModalType}),{
        body:JSON.stringify({[filed]:arr}),
        headers: {
            'Content-Type': 'application/json'
        },
        success: data => {
          if(data.status){
             message.success('保存成功')
             this.setState({visibleImportModal:false,importDataSource:[],importModalType:"01"})
             this.refs.table.fetch();
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      })
    }else{
      message.warn('请先导入模板！')
    }
  }

  /* 重置时清空redux */
  handleReset = ()=>{
    this.form.props.form.resetFields();
    const { clearSearch , history ,search} = this.props;
    const pathname = history.location.pathname;
    let setToggleSearch = {};
    if(search[pathname]){
      setToggleSearch = { toggle:search[pathname].toggle};
    }else{
      setToggleSearch = { toggle: false };
    }
    clearSearch(pathname,setToggleSearch);
  }
  /* 记录table过滤以及分页数据 */
  changeQueryTable = (values) =>{
    const { setSearch, history ,search} = this.props;
    values = Object.assign({...search[history.location.pathname]},{...values})
    debugger
    setSearch(history.location.pathname, values);
  }
  /* 记录展开状态 */
  changeQueryToggle = () =>{
    const { search , setSearch , history} = this.props;
    const pathname = history.location.pathname;
    let hasToggleSearch = {};
    if(search[pathname]){
        hasToggleSearch = {...search[pathname],toggle:!search[pathname].toggle};
    }else{
        hasToggleSearch = { toggle: true };
    }
    setSearch(pathname,hasToggleSearch)
  }
  //生成编码
  createCode = () => {
    request(assets.createAssetsRecord,{
      body:JSON.stringify({}),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:data=>{
        if(data.status){
          this.setState({codeModal:true,codeData:data.result.rows})
        }else{
          message.error(data.msg)
        }
      }
    })
  }
  //保存编码
  _saveCode=()=>{
    request(assets.insertCreateAssetsRecord,{
      body:JSON.stringify({list:this.state.codeData}),
      headers:{
        'Content-Type': 'application/json'
      },
      success:data=>{
        if(data.status){
          message.success('保存成功')
          this.setState({codeModal:false,codeData:[]})
        }else{
          message.error(data.msg)
        }
      }
    })
  }

  render() {
    const { selectedRowKeys , importDataSource , countPrice } = this.state;
    const { history, search } = this.props;
    const pathname = history.location.pathname;
    const isShow = search[pathname] ? search[pathname].toggle:false;
    if(search[pathname]&&search[pathname].useFstate){
      columns[2].filteredValue = search[pathname].useFstate;
    }
    return (
      <Content className='ysynet-content ysynet-common-bgColor ledgerArchives' style={{padding:24}}>
         <Alert message={messageInfo} type="warning" showIcon closeText="关闭" />
          <SearchFormWapper
            query={query=>{this.query(query)}} 
            handleReset={()=>this.handleReset()}
            changeQueryToggle={()=>this.changeQueryToggle()}
            isShow={isShow}
            // ref='form'
            wrappedComponentRef={(form) => this.form = form}
          />

          <Row style={{marginTop : 10}}>
            <Col span={12}></Col>
            <Col span={8} className={styles['text-align-right']}>
              <Button type='primary' style={{marginRight:8}} onClick={()=>this.setState({visibleImportModal:true})}>导入</Button>
              <Button type='primary' style={{marginRight:8}} onClick={()=>this.exportAssets()}>导出</Button>
              <Dropdown overlay={
                <Menu  onClick={()=>this.printAll()}>
                  <Menu.Item key="1"> 全部打印</Menu.Item>
                </Menu>
                }>
                <Button onClick={()=>this.printSelect()} style={{marginRight:8}} >
                  打印 <Icon type="ellipsis" />
                </Button>
              </Dropdown>
              <Button type='primary' style={{marginRight:8}} onClick={()=>this.createCode()}>生成编码</Button>
            </Col>
            <Col span={4} style={{textAlign:'right'}}>
              <Button type='primary' style={{ marginRight: 16 }}>
                <Link to={{pathname:`/ledger/ledgerArchives/add/id`}}>新增档案</Link>
              </Button>
            </Col>
          </Row>
          <RemoteTable
            onChange={this.changeQueryTable}
            loading={ this.state.loading}
            ref='table'
            query={this.state.query}
            url={assets.selectAssetsList}
            // isList={true}
            scroll={{x: '120%', y : document.body.clientHeight}}
            columns={columns}
            showHeader={true}
            rowKey={'assetsRecordGuid'}
            style={{marginTop: 10}}
            size="small"
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys})
              }
            }}
            callback={(data)=>{
              this.setState({tableRecords:data.result.records})
            }}
            footer={()=>(
              <span style={{color:'red'}}>当前合计金额（不含报废）：{countPrice?Number(countPrice).toFixed(2):'0.00'}</span>
            )}
          />
          <Modal
            title='导入数据'
            width={980}
            visible={this.state.visibleImportModal}
            onOk={()=>this.setState({visibleImportModal:false,importDataSource:[],importModalType:"01"})}
            onCancel={()=>this.setState({visibleImportModal:false,importDataSource:[],importModalType:"01"})}
            footer={null}
          >
            {
              this.state.messageError === "" ? null
              :
              <Alert style={{marginTop : 10}} message="错误提示"  type="error" description={<div dangerouslySetInnerHTML={{__html:this.state.messageError}}></div>} showIcon closeText="关闭" />
            }
            {
              this.state.showProgress ? <Progress percent={this.state.progressPercent} status="active" />
              : null
            }
            <Row style={{marginTop:10}}>
              <Col span={12}>
                <div className="ant-row ant-form-item">
                  <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-4">
                    <label>导入类型</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                    <div className="ant-form-item-control">
                      <Radio.Group value={this.state.importModalType} onChange={(e)=>this.setState({importModalType:e.target.value})}>
                        <Radio value="01">资产</Radio>
                        <Radio value="02">配件</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12} style={{textAlign:'right'}}>
                <span>导入模板：
                  {
                    this.state.importModalType==="01" ?
                    <a href={assets.importModalTemplate} style={{ marginRight: 8 }} target="_blank">资产模板.xls</a>
                    :<a href={assets.accessoriesModalTemplate} style={{ marginRight: 8 }} target="_blank"> 配件模板.xls</a>
                  }

                </span>
                <Upload
                  action={assets.importAssets}
                  data={{importType:this.state.importModalType}}
                  showUploadList={false}
                  withCredentials={true}
                  beforeUpload={()=>this.setState({loading: true,showProgress:true})}
                  onError={(error)=>{
                      this.setState({loading: false,showProgress:false})
                  }}
                  onChange={(file)=>{
                    if(file.event){
                      if(file.event.percent<100){
                        this.setState({
                          progressPercent:file.event.percent
                        })
                      }else{
                        this.setState({
                          progressPercent:99
                        })
                      }
                    }
                  }}
                  onSuccess={(result)=>{
                    this.setState({loading: false})
                    if(result.status){
                      this.setState({
                          importDataSource:result.result,
                          progressPercent:100,
                          showProgress:false,
                          messageError:"",
                      })
                      message.success("上传成功")
                    }else{
                      this.setState({
                          messageError:result.msg,showProgress:false
                      })
                    }
                  }}>
                  <Button style={{ marginRight: 8 }}>
                    <Icon type='export'/> 上传
                  </Button>
                </Upload>
                <Button type='primary' style={{marginRight:8}} onClick={()=>this.onSubmitImport()}>保存</Button>
              </Col>
            </Row>
            <Table
              rowKey={'rn'}
              scroll={{x:'520%'}}
              columns={this.state.importModalType==="01" ? importModalColumns : accessoriesModalColumns}
              dataSource={importDataSource}>
            </Table>

          </Modal>
          
          
          {/* 生成编码弹窗 */}
          <Modal visible={this.state.codeModal} width={980} onCancel={()=>this.setState({codeModal:false})} footer={null}>
            <Row>
              <Button type='primary' onClick={this._saveCode}>保存有效编码</Button>
            </Row>
            <Table
              rowKey={'assetsRecordGuid'}
              columns={codeColumns}
              scroll={{x: '100%', y : document.body.clientHeight}}
              dataSource={this.state.codeData}>
            </Table>
            
          </Modal>
        </Content>
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(LedgerArchivesList));