/*
 * @Author: yuwei - balanceSummary - 结存汇总
 * @Date: 2018-07-18 13:55:16 
* @Last Modified time: 2018-07-18 13:55:16 
 */
import React, { Component } from 'react';
import { Layout, Form, Row, Col, Select, DatePicker, Button, Table, Modal, message } from 'antd';
import financialControl from '../../../api/financialControl';
import { fetchData } from '../../../utils/tools';
import querystring from 'querystring';
import moment from 'moment'
import uuid from 'uuid';
const { Content } = Layout;
const Option = Select.Option;
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

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
const columns = [{
  title: '财务分类',
  dataIndex: 'styleName',
  render: (text,record)=>{
    return !text ? '未分类': text
  }
}, {
  title: '期初金额',
  dataIndex: 'initialTotal',
  width: '20%',
  render: (text,record)=>{
    return text ? text.toFixed(2): '0.00';
  }
}, {
  title: '本期入库',
  children: [{
    title: '入库汇总',
    dataIndex: 'importTotal',
    render: (text,record)=>{
      return text ? text.toFixed(2): '0.00';
    }
  }, {
    title: '其他入库',
    dataIndex: 'elseImportTotal',
    render: (text,record)=>{
      return text ? text.toFixed(2): '0.00';
    }
  }],
}, {
  title: '本期出库',
  children: [{
    title: '出库汇总',
    dataIndex: 'outportTotal',
    render: (text,record)=>{
      return text ? text.toFixed(2): '0.00';
    }
  }, {
    title: '其他出库',
    dataIndex: 'elseOutportTotal',
    render: (text,record)=>{
      return text ? text.toFixed(2): '0.00';
    }
  }],
}, {
  title: '期末金额汇总',
  dataIndex: 'endTotal',
  width: '20%',
  render: (text,record)=>{
    return text ? text.toFixed(2): '0.00';
  }
}];
class BalanceSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storageOptions: [],
      dataSource: [],
      loading: false,
      isDateTime: false,
      total: 0
    }
  }
  componentWillMount() {
    let query = {};
    fetchData(financialControl.selectUseDeptList, querystring.stringify({deptType:"01"}), data => {
      if(data.result){
        query =  {
          bDeptId: data.result[0]?data.result[0].value:'',
          invoicing: 'NO_INVOICING',
        } 
        this.setState({ storageOptions: data.result,loading: true});
        this.genData(query);
      }
    });
  }
  genData = (values) =>{
    fetchData(financialControl.selectBalanceCollect,querystring.stringify(values),data=>{
      this.setState({ loading: false });
      if(data.status){
        let totalData = {
          styleName: '合计',
          initialTotal: data.result.total,
          styleId: uuid(),
          importTotal: data.result.inTotal,
          elseImportTotal: data.result.elseInTotal,
          outportTotal: data.result.outTotal,
          elseOutportTotal: data.result.elseOutTotal,
          endTotal: data.result.endTotal
        }
        let tableData = data.result.balanceSumTreeSet.concat(totalData);
        this.setState({ dataSource: tableData});
      }else{
        this.handleError(data.msg);
      }
    })
  }
  //处理错误信息
  handleError = (data) =>{
    Modal.error({
      title: '错误提示',
      content: data,
      okText: '确定'
    });
  }
  handSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields( (err,values ) =>{
      if(!err){

        for (let item in values){
          if(Array.isArray(values[item])){
            if(values[item].length===0){
              delete values[item]
            }
          }else{
            switch(values[item]){
              case "":
                delete values[item]
                break 
              case null:
                delete values[item]
                break
              case undefined:
                delete values[item]
                break
              default:
                break 
            }
          }
        }
        if(values.dateTime){
          values.dateTime = moment(values.dateTime).format('YYYYMM');
        }
        console.log(values,'values');
        this.setState({ loading: true });
        this.genData(values)
      }
    })
  }
  genReport = () =>{
    this.setState({loading: true})
    const bDeptId = this.props.form.getFieldValue('bDeptId');
    fetchData(financialControl.createForms, querystring.stringify({bDeptId}), data => {
      this.setState({loading: false})
      if (data.status) {
        message.success('报表生成成功!')
      } else {
        this.handleError(data.msg);
      }
    })
  }
  filterOption = (input, option) => {
    if(option.props.children){
      return option.props.children.indexOf(input) >= 0
    }
    return false
  }
  handleReset = () => {
    this.props.form.resetFields();
    const { storageOptions } = this.state;
    this.genData({bDeptId:storageOptions[0].value,invoicing:'NO_INVOICING'})
    this.setState({isDateTime:false})
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { storageOptions, isDateTime, dataSource } = this.state;
    const values = this.props.form.getFieldsValue();
    const exportHref = financialControl.exportBalanceSumList+'?'+querystring.stringify(values);
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        <Form onSubmit={this.handSubmit}>
          <Row>
            <Col span={6}>
              <FormItem label={`管理部门`} {...formItemLayout}>
                {getFieldDecorator(`bDeptId`,{
                  initialValue: storageOptions.length ? storageOptions[0].value : null
                })(
                  <Select
                    showSearch
                    placeholder={'请选择'}
                    optionFilterProp="children"
                    filterOption={(input, option)=>this.filterOption(input, option)}
                    >
                    {
                      storageOptions.map((item, index) => (
                        <Option key={index} value={item.value}>{ item.text }</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem  {...formItemLayout} label='状态'>
                {getFieldDecorator(`invoicing`,{
                  initialValue: 'NO_INVOICING'
                })(
                  <Select
                    onSelect={ val => this.setState({ isDateTime: val === 'NO_INVOICING' ? false: true  })}
                  >
                    <Option value={'NO_INVOICING'}>待结账</Option>
                    <Option value={null}>已结账</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            {
              isDateTime 
              &&
              <Col span={6}>
                <FormItem {...formItemLayout} label={`会计月`}>
                  {getFieldDecorator(`dateTime`,{
                    rules: [{ required:isDateTime ? true : false, message: isDateTime ? '请选择时间': null }]
                  })(
                    <MonthPicker style={{width: '100%'}} format='YYYYMM'/>
                  )}
                </FormItem>
              </Col>
            }
            <Col style={{textAlign: 'right'}} span={6}>
              <Button type="primary" htmlType="submit" style={{marginTop: 3, verticalAlign: 'baseline'}}>搜索</Button>
              <Button style={{marginLeft: 8,verticalAlign: 'baseline'}} onClick={()=>this.handleReset()}>重置</Button>
            </Col>
          </Row>
          <Row>
            <Button icon="line-chart" onClick={this.genReport}> 生成报表 </Button>
            <a href={exportHref}><Button style={{marginLeft: 8}} icon="download" type="primary" ghost> 导出 </Button></a>
          </Row>
        </Form>
        <Table 
          ref='table'
          style={{marginTop:20}}
          border={true}
          loading={this.state.loading}
          dataSource={dataSource}
          pagination={false}
          size={'small'}
          columns={columns}
          rowKey={'styleId'}
        />  
      </Content>
    )
  }
}

export default Form.create()(BalanceSummary);
