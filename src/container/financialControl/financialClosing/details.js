/*
 * @Author: yuwei 财务管理-财务结账-详情
 * @Date: 2018-07-18 15:58:37 
* @Last Modified time: 2018-07-18 15:58:37 
 */
import React , { Component } from 'react';
import { Layout,Input, Form, Row, Col, DatePicker, Button } from 'antd';
import TableGrid from '../../../component/tableGrid';
import financialControl from '../../../api/financialControl';
import moment from 'moment';
// import { fetchData } from '../../../utils/tools';
// import querystring from 'querystring';
const { RemoteTable } = TableGrid;
const { Content } = Layout;
const { RangePicker } =DatePicker;
const FormItem = Form.Item;
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

class SearchForm extends Component {

  handleSearch = () => {
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if(!err){
        if(values.Time){
          values.invoiceStartTime = moment(values.Time[0]).format('YYYY-MM-DD')
          values.invoiceEndTime = moment(values.Time[1]).format('YYYY-MM-DD')
          delete values['Time'];
        }
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
        this.props.query(values)
      }
    })
  }

  resetFields = () =>{
    this.props.form.resetFields();
    this.props.query({})
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={8}>
            <FormItem label={`发票代码`} {...formItemLayout}>
              {getFieldDecorator(`invoiceCode`,{
                initialValue:''
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`发票号码`} {...formItemLayout}>
              {getFieldDecorator(`invoiceNo`,{
                initialValue:''
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col  span={8}>
            <FormItem label={`开票日期`} {...formItemLayout}>
              {getFieldDecorator(`Time`)(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row style={{textAlign:'right'}}>
            <Button type='primary'  htmlType='submit' style={{marginRight:8}}>搜索</Button>
            <Button onClick={()=>this.resetFields()}>重置</Button>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);


const columns=[
  {
    title:"发票代码",
    dataIndex:"invoiceCode",
  },
  {
    title:"发票号码",
    dataIndex:"invoiceNo",
  },
  {
    title:"发票金额",
    dataIndex:"money",
    render:(text)=>text?Number(text).toFixed(2):''
  },
  {
    title:"开票日期",
    dataIndex:"invoiceDate",
  },{
    title:"供应商",
    dataIndex:"fOrgName",
  },
  {
    title:"送货单号",
    dataIndex:"sendNo",
  },
  {
    title:"会计月",
    dataIndex:"acctYh",
  }
]
class FinancialClosingDetails extends Component {
  state={
    query:{
      acctYh:this.props.location.state?this.props.location.state.acctYh:'',
      bDeptId:this.props.location.state?this.props.location.state.bDeptId:''
    }
  }
  query = (val) => {
    let values = Object.assign(val,this.state.query)
    console.log(values);
    this.refs.table.fetch(values)
  }
  render(){
    console.log(this.props.location)
    const { query } = this.state;
    return(
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        <SearchFormWapper query={(val)=>this.query(val)}></SearchFormWapper>
        <RemoteTable 
          style={{marginTop:20}}
          showHeader={true}
          query={query}
          ref='table'
          columns={columns}
          url={financialControl.selectInvoiceDetailByMonth}
          rowKey='invoiceId'
          scroll={{ x: '100%' }}
        />
      </Content>
    )
  }

}
export default FinancialClosingDetails;