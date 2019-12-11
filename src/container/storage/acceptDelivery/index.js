/*
 * @Author: yuwei - 到货验收
 * @Date: 2018-06-12 14:36:37 
* @Last Modified time: 2018-06-12 14:36:37 
 */

import React , { Component } from 'react'
import { Layout , Form, Row, Col, Input, Button ,message,Table } from 'antd';
// import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
import request from '../../../utils/request';
import queryString from 'querystring';
// const { RemoteTable } = TableGrid;
const { Content } = Layout;
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
const styles = {
  fillRight:{
    marginRight:8
  },
  top:{
    marginTop:3
  }
}

class SearchForm extends React.Component {

  //搜索表单
  searchFrom = () => {
    let values = this.props.form.getFieldsValue();
    console.log(values)
    this.props.query(values)
  }

  render(){
    const { getFieldDecorator } = this.props.form;
 
    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem label={`送货单号`} {...formItemLayout} style={styles.fillRight}>
              {getFieldDecorator(`sendNo`)(
                <Input placeholder="请输入送货单号或扫描二维码"/>
              )}
            </FormItem>
           </Col>
           <Col span={3}>
            <Button type='primary'  style={styles.top}  onClick={()=>this.searchFrom()}>搜索</Button>
           </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);


const columns = [
  {
    title:"产品名称",
    dataIndex: 'materialName',
  },
  {
    title:"品牌",
    dataIndex: 'tfBrand',
  },
  {
    title:"证件号",
    dataIndex: 'registerNo',
  },
  {
    title:"规格",
    dataIndex: 'spec',
  },
  {
    title:"型号 ",
    dataIndex: 'fmodel',
  },
  {
    title:"单位 ",
    dataIndex: 'purchaseUnit',
  },
  {
    title:"采购单价",
    dataIndex: 'purchasePrice',
  },
  {
    title:"送货数量",
    dataIndex: 'amount',
  },
  {
    title:"生产商",
    dataIndex: 'produceName',
  }
]

class AcceptDelivery extends Component {

  state = {
    query:"",
    dataInfo:{},
    dataSource:[]
  }

  query = (val) => {
    console.log(val)
    request(storage.selectZCDeliveryAndDetail,{
      body:queryString.stringify(val),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
          if(data.status){
              this.setState({dataInfo:data.result,dataSource:data.result.deliveryDetailZcList})
          }else{
              message.error(data.msg)
          }
      },
      error: err => {console.log(err)}
    })
  }

  submit = () => {
    request(storage.updateDeliveryZc,{
      body:queryString.stringify({sendNo:this.state.dataInfo.sendNo}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
          if(data.status){
              message.success('验收通过!');
              this.refs.searchForm.resetFields();
              this.setState({dataSource:[],dataInfo:{}})
          }else{
              message.error(data.msg)
          }
      },
      error: err => {console.log(err)}
    })
  }

  render () {
    const { dataSource , dataInfo } = this.state; 
   
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        <SearchFormWapper ref='searchForm' query={values=>this.query(values)}/>
        <Row>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>送货单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                  {dataInfo.sendNo}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>供应商</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                {dataInfo.fOrgName}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>管理部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                {dataInfo.manageDeptName}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>收货科室</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                {dataInfo.tDeptName}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>收货地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                  {dataInfo.tfAddress}
                </div>
              </div>
            </div>
          </div>
        </Row>
        <Table 
          rowKey={'sendDetailGuid'}
          dataSource={dataSource}
          columns={columns}
          />
        <Row style={{textAlign:'center',marginTop:15}}>
          <Button type='primary' onClick={()=>this.submit()}>验收通过</Button>
        </Row>
      </Content>
    )
  }
}

export default AcceptDelivery;