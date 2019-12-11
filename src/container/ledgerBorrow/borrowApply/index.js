/*
 * @Author: yuwei 借用申请
 * @Date: 2018-09-25 20:57:17 
* @Last Modified time: 2018-09-25 20:57:17 
 */

import React , { PureComponent } from 'react';
import {Button,Col,Select, Row, Layout, Form, Icon , DatePicker, Input, } from 'antd';//Modal, message
import TableGrid from '../../../component/tableGrid';
import ledgerBorrow from '../../../api/ledgerBorrow';
import request from '../../../utils/request';
import { borrowFstate } from '../../../constants';
import queryString from 'querystring';
import {Link} from 'react-router-dom';
const { RemoteTable } = TableGrid;
const {Content} = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
      xs: {span: 24},
      sm: {span: 5}
  },
  wrapperCol: {
      xs: {span: 24},
      sm: {span: 19}
  }
}

class BorrowApply extends PureComponent {

  state={
    query:{borrowType:'02',menuFstate:'borrowApply'}
  }

  fetchTable = (data)=>{

    console.log(JSON.stringify({query:{...data,borrowType:"02",menuFstate:'borrowApply'}}))
    this.refs.table.fetch({...data,borrowType:"02",menuFstate:'borrowApply'})
  }

  render(){
    const columns = [
      {
          title: '借用单号',
          dataIndex: 'borrowNo',
          width:160,
      },
      {
          title: '资产编号',
          width:160,
          dataIndex: 'assetsRecord'
      },{
          title: '资产名称',
          width:160,
          dataIndex: 'equipmentStandardName'
      },{
          title: '借用人',
          width:120,
          dataIndex: 'borrowUserName'
      },{
          title: '借用科室',
          width:120,
          dataIndex: 'deptName'
      },{
          title: '借用时间',
          width:200,
          dataIndex: 'createTime',
          sorter: true,
      },{
          title: '预计归还时间',
          width:200,
          dataIndex: 'estimateBack',
          sorter: true,
      },{
          title: '实际归还时间',
          width:200,
          dataIndex: 'actualBack',
          sorter: true,
      },{
          title: '借用原因',
          width:200,
          dataIndex: 'borrowCause'
      },{
          title: '费用',
          width:150,
          dataIndex: 'cost',
          render:(text)=>text?Number(text).toFixed(2):text
      },{
          title: '备注',
          width:200,
          dataIndex: 'remark'
      },{
          title: '操作员',
          width:200,
          dataIndex: 'createUserId'
      },{
        title: '申请时间',
        width:200,
        dataIndex: 'applyTime',
      },{
          title: '单据状态',
          width:120,
          dataIndex: 'borrowFstate',
          render: (text) => text?borrowFstate[text]:text
      },{
        title:'操作',
        dataIndex:'action',
        render:(text,record)=>{
          //待审核 驳回借出 则显示以下
          if(record.borrowFstate==='03' || record.borrowFstate==='09'){
            return (<Link to={{pathname:`/ledgerBorrow/borrowApply/details/${record.borrowGuid}`}}>编辑</Link>)
          }else{
            return null
          }
        }
      }
    ];
    const { query } = this.state;
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
        
        <SearchFormWapper setQuery={(data)=>this.fetchTable(data)}></SearchFormWapper>
        <Row style={{ marginBottom: 25 }}>
          <Button onClick={this.showModal} style={{ marginLeft: 8 }} type="primary" >
          <Link to={{pathname:'/ledgerBorrow/borrowApply/add'}}>新增</Link>
          </Button>
        </Row>  
        <RemoteTable
          ref="table"
          query={query?query:{borrowType:"02",menuFstate:'borrowApply'}}
          url={ledgerBorrow.BorrowRecordList}
          scroll={{x: '150%'}}
          showHeader={true}
          columns={columns}
          size="small"
          rowKey={'RN'}
        />
      </Content>
    )
  }
 }
 export default BorrowApply;


class BorrowApplyForm extends PureComponent {
  state = {
    display: 'none',
    useSelect: [],  //管理科室保存数据
    outSelect: [],     //借出科室数据
  }
  componentDidMount() {
    request(ledgerBorrow.selectUseDeptList, {     //借出科室
        body: queryString.stringify({ deptType: "00" }),
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: (data) => {
            let outSelect = [{text: "全部", value: ""}, ...data.result];
            this.setState({ outSelect });
        },
        error: (err) => console.log(err)
    });
    request(ledgerBorrow.queryUserDeptListByUserId, {     //借用
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: (data) => {
            let useSelect = [...data.result];
            this.setState({ useSelect });
        },
        error: (err) => console.log(err)
    });
  }
  toggle = () => {
      this.setState({
          display: this.state.display === 'none'? 'block' : 'none'
      })
  }
  handleSearch = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
          let loanDate = this.startEndDate(values.loanDate);
          let returnDate = this.startEndDate(values.returnDate)
          values.loanStartTime = loanDate[0];
          values.loanEndTime = loanDate[1];
          values.startTime = returnDate[0];
          values.endTime = returnDate[1];
          delete values.loanDate;
          delete values.returnDate;
          for (const key in values) {
              values[key] = values[key] === undefined? '' : values[key]
          };
          this.props.setQuery(values)
      })
  }
  startEndDate = (date) => {      //格式化开始结束时间
      let startTime = '';
      let endTime = '';
      date = date === undefined? [] : date;
      if(date.length !== 0) {
          startTime = date[0].format('YYYY-MM-DD');
          endTime = date[1].format('YYYY-MM-DD');
      };
      return [startTime, endTime];
  }
  render() {
      let {getFieldDecorator} = this.props.form;
      let { display, outSelect , useSelect } = this.state;
      return (
          <Form onSubmit={this.handleSearch}>
              <Row gutter={30}>
                  <Col span={8}>
                      <FormItem label={`资产名称`} {...formItemLayout}>
                          {getFieldDecorator(`assetName`)(
                              <Input placeholder="请输入资产名称" />
                          )}
                      </FormItem>
                  </Col>
                  <Col span={8}>
                      <FormItem label={`资产编号`} {...formItemLayout}>
                          {getFieldDecorator(`assetsRecord`)(
                              <Input placeholder="请输入资产编号" />
                          )}
                      </FormItem>
                  </Col>
                  <Col span={8} style={{ display }} >
                      <FormItem label={`借用科室`} {...formItemLayout}>
                          {getFieldDecorator(`deptGuid`)(
                              <Select
                                  placeholder="请选择借用科室"
                                  defaultActiveFirstOption = {false}
                                  allowClear={true}  
                                  filterOption={false}
                              >
                                  {useSelect.map( d => <Option value={d.value} key={d.text} >{d.text}</Option> )}
                              </Select>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={8} style={{ display }} >
                      <FormItem label={`借出科室`} {...formItemLayout}>
                          {getFieldDecorator(`lendDeptGuid`)(
                              <Select 
                                  placeholder="请选择借出科室" 
                                  defaultActiveFirstOption = {false}
                                  allowClear={true}  
                                  filterOption={false}
                              >
                                  {outSelect.map( d => <Option value={d.value} key={d.text} >{d.text}</Option> )}
                              </Select>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={8} style={{ display }} >
                      <FormItem label={`借出日期`} {...formItemLayout}>
                          {getFieldDecorator(`loanDate`)(
                              <RangePicker />
                          )}
                      </FormItem>
                  </Col>
                  <Col span={8} style={{ display }} >
                      <FormItem label={`实际归还时间`} {...formItemLayout}>
                          {getFieldDecorator(`returnDate`)(
                              <RangePicker />
                          )}
                      </FormItem>
                  </Col>
                  <Col span={8} style={{ display }} >
                      <FormItem label={`单据状态`} {...formItemLayout}>
                          {getFieldDecorator(`borrowFstate`)(     //00已借出  01已归还
                              <Select 
                                  placeholder="请选择单据状态" 
                                  defaultActiveFirstOption = {false}
                                  allowClear={true}  
                                  filterOption={false}
                              >  
                                  <Option value="" key="03" >全部</Option>
                                  <Option value="00" key="00" >已借出</Option>
                                  <Option value="01" key="01" >已归还</Option>
                              </Select>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={8} style={{ display }} >
                      <FormItem label={`借用编号`} {...formItemLayout}>
                          {getFieldDecorator(`borrowNo`)(
                              <Input placeholder="请输入" />
                          )}
                      </FormItem>
                  </Col>
                  <Col span={8} style={{ textAlign: 'right' }} >
                      <Button type="primary" htmlType="submit" >查询</Button>
                      <Button style={{ margin: '0 8px' }} onClick={() => { this.props.form.resetFields(); }}>重置</Button>
                      <a onClick={this.toggle}>{ display === 'none'? '展开' : '收起' }<Icon type={ display === 'none'? 'down' : 'up' } /></a>
                  </Col>
              </Row>
          </Form>
      )
  }
}

const SearchFormWapper = Form.create()(BorrowApplyForm);