/**
 * @file 资产转科 - 转科管理
 * @author Vania
 * @since 2018-04-08
 */
import React, { PureComponent } from 'react';
import { Layout, Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import tableGrid from '../../../component/tableGrid';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import { Link } from 'react-router-dom';
import transfer from '../../../api/transfer';
import request from '../../../utils/request';
import querystring from 'querystring';
import moment from "moment";
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { RemoteTable } = tableGrid

// 表单布局样式
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
// 转出转入科室
let timeout;
let currentValueRollOut;
function fetchOutDeptname(deptName, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValueRollOut = deptName;
  
  let options = {
    body:querystring.stringify({'deptName': deptName, 'deptType': '00'}),
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
  request(transfer.getSelectUseDeptList, options);
}
function fetchIntoDeptname(deptName, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValueRollOut = deptName;
  let options = {
    body:querystring.stringify({'deptName': deptName}),
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
class SearchFormWrapper extends PureComponent {
  state = {
    display: this.props.isShow?'block':'none',expand:this.props.isShow,
    deptNameData: [],// 转出科室保存数据
    IntodeptNameData: [],// 转入科室保存数据
    deptName: '',// 转入转出科室
  }
  toggle = () => {
    const { display, expand } = this.state;
    this.props.changeQueryToggle()
    this.setState({
      display: display === 'none' ? 'block' : 'none',
      expand: !expand
    })
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const createDate = values.createDate === undefined ? '': values.createDate;
      if(createDate.length>0) {
        values.startCreateDate = createDate[0].format('YYYY-MM-DD');
        values.endCreateDate = createDate[1].format('YYYY-MM-DD');
      }
      this.props.query(values);
    });
 }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset();
  }
  // 转出科室
  handleChangeRollOut = (deptName) => {
    this.setState({ deptName });
    fetchOutDeptname(deptName, deptNameData => this.setState({ deptNameData }));
  }
  // 转入科室
  handleChangeInto = (deptName) => {
    this.setState({ deptName });
    fetchIntoDeptname(deptName, IntodeptNameData => this.setState({ IntodeptNameData }));
  }
  render() {
    const { display } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      // 转科记录查询部分
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={8}>
            <FormItem label={`资产编码`} {...formItemLayout}>
            {getFieldDecorator('assetsRecord', {})(
                <Input placeholder="请输入资产编码" style={{width: 200}} />
            )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`资产名称`} {...formItemLayout}>
              {getFieldDecorator('equipmentStandardName', {})(
                <Input placeholder="请输入资产名称" style={{width: 200}} />
              )}
            </FormItem>
          </Col>
         
          <Col span={8} style={{display: display}}>
            <FormItem label={`转出科室`} {...formItemLayout}>
              {getFieldDecorator('outDeptguid', {})(
              <Select
              showSearch
              onSearch={this.handleChangeRollOut}
              defaultActiveFirstOption={false}
              showArrow={false}
              allowClear={true}
              filterOption={false}
              style={{width: 200}}
              onSelect={(val,option)=>{this.setState({ outDeptguid:val, outDeptname: option.props.children })}}
              placeholder={`请搜索选择转出科室`}
            >
              {this.state.deptNameData.map(d => <Option value={d.value} key={d.value}>{d.text}</Option>)}
            </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`转入科室`} {...formItemLayout}>
              {getFieldDecorator('inDeptguid', {})(
              <Select
              showSearch
              onSearch={this.handleChangeInto}
              defaultActiveFirstOption={false}
              showArrow={false}
              allowClear={true}
              filterOption={false}
              style={{width: 200}}
              placeholder={`请搜索选择转入科室`}
              onSelect={(val, option) => this.setState({inDeptguid: val, inDeptName: option.props.children})}
              >
                {this.state.IntodeptNameData.map(d => <Option value={d.value} key={d.value}>{d.text}</Option>)}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`申请时间`} {...formItemLayout}>
              {getFieldDecorator('createDate', {})(
                <RangePicker style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ textAlign: 'center', marginTop: 4}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
              {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchForm = Form.create()(SearchFormWrapper);

class TransferManager extends PureComponent {
  constructor(props) {
    super(props);
    /* 设置redux前置搜索条件 */
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    this.state = {
      query:search[pathname]?{...search[pathname]}:''
    }
  }
  /* 回显返回条件 */
  async componentDidMount () {
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    console.log(search[pathname])
    if (search[pathname]) {
      //找出表单的name 然后set
      let value = {};
      let values = this.form.props.form.getFieldsValue();
      values = Object.getOwnPropertyNames(values);
      values.map(keyItem => {
        value[keyItem] = search[pathname][keyItem];
        return keyItem;
      });
      if(search[pathname].startCreateDate&&search[pathname].endCreateDate){
        value.createDate=[moment(search[pathname].startCreateDate,'YYYY-MM-DD'),moment(search[pathname].endCreateDate,'YYYY-MM-DD')]
      }
      this.form.props.form.setFieldsValue(value)
    }
  }
  /* 查询时向redux中插入查询参数 */
  queryHandle = (query) => {
    /* 存储搜索条件 */
    const { setSearch, history ,search } = this.props;
    const pathname = history.location.pathname;
    let values = Object.assign({...query},{...search[pathname]},)
    setSearch(pathname, values);
    this.refs.table.fetch(query);
    this.setState({query});
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
  sorterTransferNo = (a,b,key) =>{
    let reg = /[a-zA-Z]/g;
    let numberA = a[key].replace(reg,'');
    let numberB = b[key].replace(reg,'');
    if(a[key] && b[key]){
      return numberA - numberB
    }
  }
  render() {
    const { search , history } = this.props;
    const pathname = history.location.pathname;
    const columns = [
      {
        title: '操作',
        dataIndex: 'transferGuid',
        width: 80,
        render: (text, record, index) => {
          if (record.fstate === "00") {
            return (
              <span><Link to={{pathname:`/transfer/transferManager/edit/${record.transferGuid}`}}>转科</Link></span>
            )
          } else {
            return (
              <span><Link to={{pathname:`/transfer/transferManager/details/${record.transferGuid}`}}>详情</Link></span>
            )
          }
          
        }
      },
      {
        title: '转科单号',
        dataIndex: 'transferNo',
        width: 150,
        sorter: (a, b) => this.sorterTransferNo(a, b,'transferNo')
      },
      {
        // --状态 00待转科 03已转科 07已关闭 
        title: '单据状态',
        dataIndex: 'fstate',
        width: 80,
        render: (text, record, index) => {
          if (record.fstate === "00") {
            return <span>待转科</span>;
          } else if (record.fstate === "03") {
            return <span>已转科</span>;
          } else if (record.fstate === "07") {
            return <span>已关闭</span>;
          }
        }
      },
      {
        title: '申请时间',
        dataIndex: 'createDate',
        width: 150
      },
      {
        title: '申请人',
        dataIndex: 'createUserName',
        width: 100
      },
      {
        title: '转出科室',
        dataIndex: 'outDeptName',
        width: 140
      },
      {
        title: '转入科室',
        dataIndex: 'inDeptName',
        width: 230
      },
      {
        title: '转科日期',
        dataIndex: 'transferDate',
        width: 150
      },
      {
        title: '转科原因',
        dataIndex: 'transferCause',
        width: 200
      },
    ]
    const query = this.state.query;
    const isShow = search[pathname] ? search[pathname].toggle:false;

    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
        <SearchForm 
          query={this.queryHandle} 
          handleReset={()=>this.handleReset()}
          changeQueryToggle={()=>this.changeQueryToggle()}
          isShow={isShow}
          wrappedComponentRef={(form) => this.form = form}
        />
        <RemoteTable
        query={query}
        onChange={this.changeQueryTable}
        showHeader={true}
        ref='table'
        url={transfer.getSelectTransferList}
        scroll={{x: '140%', y : document.body.clientHeight - 110 }}
        columns={columns}
        size="small"
        rowKey={'transferGuid'}
        style={{marginTop: 10}}
        />
      </Content>
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(TransferManager));