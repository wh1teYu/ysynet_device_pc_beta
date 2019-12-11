/*
 * @Author: yuwei - 我的送货单
 * @Date: 2018-06-12 14:18:00 
* @Last Modified time: 2018-06-12 14:18:00 
 */

import React from 'react';
import { Layout , Form, Row, Col, Input, Select, Button ,message ,DatePicker } from 'antd';
import request from '../../../utils/request';
import { Link } from 'react-router-dom';
import queryString from 'querystring';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import moment  from 'moment';
import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
const { RemoteTable } = TableGrid;
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

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
const styles = {
  textRight:{
    textAlign:'right'
  },
  fillRight:{
    marginRight:8
  },

}
const fstateStatus = {
  "00":'待验收',
  "05":'验收通过',
  "09":'交易完成'
}
const fStateSel = [
  { text: '待验收', value: '00' },
  { text: '验收通过', value: '05' },
  { text: '交易完成', value: '09' },
] 

class SearchForm extends React.Component {

  state = {
    orgSelect:[],//医疗机构
    managementDeptSelect:[],//管理部门
  }
  
  componentWillMount(){
    this.setOrgSelect();
    // this.setManagementDeptSelect();
  }

  //获取医疗机构下拉框
  setOrgSelect = () => {
    request(storage.selectUseDeptList,{
      body:{},
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({orgSelect:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  setManagementDeptSelect = (val) => {
    request(storage.selectDeliveryForgList,{
      body:queryString.stringify({orgId:val,deptType:"01"}),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({managementDeptSelect:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  //搜索表单
  searchFrom = () => {
    let values = this.props.form.getFieldsValue();
    console.log(values)
    if(values.SendDate && values.SendDate.length){
      values.startSendDate=moment(values.SendDate[0]).format('YYYY-MM-DD');
      values.endSendDate=moment(values.SendDate[1]).format('YYYY-MM-DD');
      delete values['SendDate'];
    }else{
      delete values['SendDate'];
    }
    this.props.query(values)
  }

  changeRangePicker = (dates,dateStrings)=>{
    console.log(dateStrings)
    this.props.form.setFieldsValue({
      SendDate:dates
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { orgSelect , managementDeptSelect , } =this.state ;//deptSelect
    const options = orgSelect.map(d => <Option value={d.value.toString()} key={d.value}>{d.text}</Option>);
    const managementDeptOptions = managementDeptSelect.map(d => <Option value={d.value.toString()} key={d.value}>{d.test}</Option>);
   
    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem label={`管理部门`} {...formItemLayout}>
              {getFieldDecorator(`bDeptId`,{
                initialValue:""
              })(
                <Select 
                  showSearch
                  placeholder={'请选择管理部门'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onSelect={(val)=>this.setManagementDeptSelect(val)}
                  >
                  <Option key="" value="">全部</Option>
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`供应商`} {...formItemLayout}>
              {getFieldDecorator(`fOrgId`,{
                initialValue:""
              })(
                <Select
                  showSearch
                  placeholder={'请选择供应商'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option key="" value="">全部</Option>
                  {managementDeptOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`制单时间`} {...formItemLayout}>
              {getFieldDecorator(`SendDate`)(
                <RangePicker onChange={this.changeRangePicker}></RangePicker>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label={`送货单号`} {...formItemLayout}>
              {getFieldDecorator(`sendNo`)(
                <Input placeholder="请输入送货单号"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`合同号`} {...formItemLayout}>
              {getFieldDecorator(`contractNo`)(
                <Input placeholder="请输入合同编号"/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={styles.textRight}>
            <Button type='primary' style={styles.fillRight} onClick={()=>this.searchFrom()}>搜索</Button>
           </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);

class EquipmentDelivery extends React.Component {

  constructor(props) {
    super(props);
    /* 设置redux前置搜索条件 */
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    this.state = {
      dataSource:[],
      query:search[pathname]?{...search[pathname]}:{}
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
    if(search[pathname].startSendDate&&search[pathname].endSendDate){
      value.SendDate=[moment(search[pathname].startSendDate,'YYYY-MM-DD'),moment(search[pathname].endSendDate,'YYYY-MM-DD')]
    }
    this.form.props.form.setFieldsValue(value)
  }
}
  //搜索表单
  query = (value) => {
    console.log('搜索操作发出的',value)
    const { setSearch, history ,search } = this.props;
    const pathname = history.location.pathname;
    let values = Object.assign({...search[pathname]},{...value})
    setSearch(pathname, values);
    this.refs.table.fetch(value);
    this.setState({query:value})
  }
  /* 记录table过滤以及分页数据 */
  changeQueryTable = (values) =>{
    const { setSearch, history ,search} = this.props;
    values = Object.assign({...search[history.location.pathname]},{...values})
    setSearch(history.location.pathname, values);
  }
  render(){
    const { search , history } = this.props;
    const pathname = history.location.pathname;
    let columns = [
      {
        title:"操作",
        dataIndex:"actions",
        width:80,
        render:(text,record,index) => {
          return (
            <Link to={{pathname:`/storage/myDelivery/details/${record.sendId}`,state:record}}> 查看 </Link>
          )
        }
      },
      {
        title:"状态",
        dataIndex: 'fstate',
        width:120,
        filters: fStateSel,
        onFilter: (value, record) => record.fstate.indexOf(value) === 0,//(record && record.fstate===value),
        render: (text,record,index) => {
          return(
            <span>{text ? fstateStatus[text] :''}</span>
          )
        } 
      },
      {
        title:"送货单类型",
        dataIndex: 'sendType',
        width:120,
        render: (text,record,index) => {
          return(
            <span>{text==="01" ? '设备送货单':''}</span>
          )
        }
      },
      {
        title:"送货单号",
        dataIndex: 'sendNo',
        width:120,
      },
      {
        title:"合同号",
        dataIndex: 'contractNo',
        width:120,
      },
      {
        title:"库房",//管理部门
        dataIndex: 'deptName',
        width:120,
      },
      {
        title:"收货地址 ",
        dataIndex: 'tfAddress',
        width:120,
      },
      {
        title:"供应商 ",
        dataIndex: 'fOrgName',
        width:120,
      },
      {
        title:"制单人",
        dataIndex: 'sendUserName',
        width:120,
      },
      {
        title:"制单时间",
        dataIndex: 'sendDate',
        width:120,
        render:(text)=>text?text.substr(0,10):""
      },
      {
        title:"验收人",
        dataIndex: 'ysr',
        width:120,
      },
      {
        title:"验收时间",
        dataIndex: 'yssj',
        width:120,
        render:(text)=>text?text.substr(0,10):""
      }
    ]
    if(search[pathname]&&search[pathname].fstate&&search[pathname].fstate.length){
      columns[1].filteredValue = search[pathname].fstate;
    }else{
      columns[1].filteredValue = [];
    }
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        <SearchFormWapper 
          query={values=>this.query(values)}
          wrappedComponentRef={(form) => this.form = form}
          />
        <RemoteTable
          url={storage.selectZCDeliveryList}
          ref='table'
          onChange={this.changeQueryTable}
          query={this.state.query}
          scroll={{x: '150%', y : document.body.clientHeight - 110 }}
          columns={columns}
          rowKey={'sendId'}
          showHeader={true}
          style={{marginTop: 10}}
          size="small">
        </RemoteTable>

      </Content>
    )
  }
}

export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(EquipmentDelivery));