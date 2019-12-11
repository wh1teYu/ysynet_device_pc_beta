/*
 * @Author: yuwei -库存查询 queryStorage
 * @Date: 2018-07-26 11:57:02 
* @Last Modified time: 2018-07-26 11:57:02 
 */
import React, { Component } from 'react';
import { Row,Col,Input,Icon, Layout,Button,message,Form,Select } from 'antd';
import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
import request from '../../../utils/request';
import queryString from 'querystring';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { RemoteTable } = TableGrid;
const columns = [
  {
    title: '产品名称',
    dataIndex: 'assetName',
    width:100
  },
  {
    title: '型号',
    dataIndex: 'fmodel',
    width:100
  },
  {
    title: '规格',
    dataIndex: 'spec',
    width:100
  },
  {
    title: '单位',
    dataIndex: 'meteringUnitName',
    width:100
  },
  {
    title: '库存数量',
    dataIndex: 'xcsl',
    width:100
  },
  {
    title: '采购价',
    dataIndex: 'buyPrice',
    width:100,
    render:(text)=>text?Number(text).toFixed(2):'0.00'
  },
  {
    title: '金额',
    dataIndex: 'totalBuyPrice',
    width:100,
    render:(text)=>text?Number(text).toFixed(2):'0.00'
  },
  {
    title: '供应商',
    dataIndex: 'fOrgName',
    width:100
  },
];
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

  state={
    display: 'none',
    manageSelect:[],
    outDeptOptions: []
  }
  componentDidMount = () => {
    this.getManageSelect();
    this.outDeptSelect();
  }

  getManageSelect = () => {
    request(storage.selectUseDeptList,{
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
  outDeptSelect = () => {
    request(storage.selectFOrgList,{
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

  toggle = () => {
    const { display, expand } = this.state;
    this.setState({
      display: display === 'none' ? 'block' : 'none',
      expand: !expand
    })
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
  }
  filterOption = (input, option) => {
    if(option.props.children){
      return option.props.children.indexOf(input) >= 0
    }
    return false
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { display } = this.state;
    return (
      <Form  onSubmit={this.handleSearch}>
        <Row>
          <Col span={8}> 
            <FormItem
              {...formItemLayout}
              label="管理部门"
            >
              {getFieldDecorator('manageDeptGuid',{//manageDeptGuid
                initialValue:""
              })(
                <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
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
          <Col span={8}> 
            <FormItem
              {...formItemLayout}
              label="产品名称"
            >
              {getFieldDecorator('assetName')(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="型号"
            >
              {getFieldDecorator('fmodel',{
                initialValue:""
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="规格"
            >
              {getFieldDecorator('spec',{
                initialValue:""
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="供应商"
            >
              {getFieldDecorator('fOrgId',{//useDeptGuid
                initialValue:""
              })(
                <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option)=>this.filterOption(input, option)}
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
          </Col>
          <Col span={8} style={{textAlign:'right',paddingRight:15,paddingTop:5}}> 
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginLeft: 8,}} onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);

class QueryStorage extends Component {
  
  state = {
    query:{}
  }
  searchTable = (val) => {
    this.refs.table.fetch(val)
  }
  render() {
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        <SearchFormWapper query={(val)=>this.searchTable(val)} ref='form'></SearchFormWapper>
        <RemoteTable
          loading={ this.state.loading}
          query={this.state.query}
          ref='table'
          url={storage.selectAssetsRepertoryList}
          scroll={{x: '100%', y : document.body.clientHeight - 311}}
          columns={columns}
          showHeader={true}
          rowKey={'RN'}
          style={{marginTop: 10}}
          size="small"
        />
      </Content>
    )
  }
}
export default QueryStorage;