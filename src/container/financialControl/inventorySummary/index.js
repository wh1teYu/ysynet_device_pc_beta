/*
 * @Author: yuwei - 库存汇总  inventorySummary
 * @acctDate: 2018-07-18 13:55:40 
* @Last Modified time: 2018-07-18 13:55:40 
 */
import React, { Component } from 'react';
import { Layout, Form, Row, Col, Select, TreeSelect,
  DatePicker, Button, Input, message, Modal,Icon} from 'antd';
import TableGrid from '../../../component/tableGrid';
import financialControl from '../../../api/financialControl';
import { fetchData } from '../../../utils/tools';
import querystring from 'querystring';
import moment from 'moment'
const { Content } = Layout;
const { RemoteTable } = TableGrid;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

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
const columns = [
  {
  title: '财务分类',
  dataIndex: 'styleName',
  key: 'styleName',
  width: 110,
  fixed: 'left',
  }, {
    title: '通用名称',
    dataIndex: 'geName',
    key: 'geName',
  }, {
    title: '产品名称',
    dataIndex: 'materialName',
    key: 'materialName',
  }, {
    title: '规格',
    dataIndex: 'spec',
    key: 'spec',
  }, {
    title: '型号',
    dataIndex: 'fmodel',
    key: 'fmodel',
  }, {
    title: '采购单位',
    dataIndex: 'purchaseUnit',
    key: 'purchaseUnit',
  }, {
    title: '库存数量',
    dataIndex: 'xcsl',
    key: 'xcsl',
  }, {
    title: '采购价',
    dataIndex: 'purchasePrice',
    key: 'purchasePrice',
    render: (text,record,index) => {
      return text === 'undefined'|| text===null ? '0':text.toFixed(2);
    }
  }, {
    title: '金额',
    dataIndex: 'zje',
    key: 'zje',
    render: (text,record,index) => {
      return text === 'undefined'|| text===null ? '0':text.toFixed(2);
    }
  }, {
    title: '供应商', 
    dataIndex: 'fOrgName',
    key: 'fOrgName',
  },
  {
    title: '结账状态',
    dataIndex: 'acctYh',
    render:(text)=>text? text==='0'? '未结账':'已结账':''
  }
];

class InventorySummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {},
      isDateTime: false,
      loading: false,
      treeData: [],
      storageOptions: [],
      supplierOptions:[],//供应商
      display:'none',
      expand:false,
      money:0.00,//全部合计
    }
  }
  componentWillMount() {
    fetchData(financialControl.selectUseDeptList, querystring.stringify({deptType:"01"}), data=>{
      if(data.result){
        this.setState({ 
          storageOptions: data.result,
          query:{
            bDeptId: data.result?data.result[0].value:'',
            acctType: '00'
          } 
        });
      }
    })
    fetchData(financialControl.selectFOrgList, querystring.stringify({}), data => {
      const supplierOptions = [];
      data.result.map(item => supplierOptions.push({value: item.orgId, text: item.orgName}))
      this.setState({ supplierOptions })
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
  onSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
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
        if(values.acctDate){
          values.acctDate = moment(values.acctDate).format('YYYYMM');
        }
        this.setState({ query: values });
        console.log('查询条件',values)
        this.refs.table.fetch({
          ...values
        })

        this.getInventoryCollectNum(values)
      }
    });
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
  
  toggle = () => {
    const { display, expand } = this.state;
    this.setState({
      display: display === 'none' ? 'block' : 'none',
      expand: !expand
    })
  }
  
  exportReport = () => {
    const values = this.props.form.getFieldsValue();
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
    if(values.acctDate){
      values.acctDate = moment(values.acctDate).format('YYYYMM');
    }
    return values;
  }

  resetFields = () =>{
    const { storageOptions } = this.state;
    this.props.form.resetFields();
    this.refs.table.fetch({bDeptId:storageOptions[0].value,acctType:'00'});
    this.setState({isDateTime:false})
  }

  //调用接口获取全部合计
  getInventoryCollectNum = (values) =>{
    fetchData(financialControl.selectInventoryCollectNum, querystring.stringify({...values}), data => {
      this.setState({money:data.result})
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let values = this.exportReport();
    const exportHref = financialControl.exportInventoryCollect+'?'+querystring.stringify(values);
    const loop = data => data.map((item) => {
      if (item.children.length>0) {
        return <TreeNode  title={item.styleName} key={item.guid} value={item.guid}  isLeaf={item.children.length === 0 ? false:true}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode title={item.styleName} key={item.guid} value={item.guid} isLeaf={item.children.length === 0 ? false:true}/>;
    });
    // const treeNodes = loop(this.state.treeData);
    const { storageOptions, query, isDateTime , supplierOptions , display , money } = this.state;
    const footer = () => {
      return <Row style={{fontWeight: 'bold'}}>
        <Col className="ant-col-4">全部合计：{/*this.refs.table&&this.refs.table.state ? this.refs.table.state.fieldName: '0'*/ }
          {money?Number(money).toFixed(2):'0.00'}
        </Col>
      </Row>
    };
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        <Form onSubmit={this.onSubmit}>
          <Row>
            <Col span={8}>
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
            <Col span={8}>
              <FormItem  {...formItemLayout} label='数据类型'>
                {getFieldDecorator(`acctType`,{
                  initialValue: '00'
                })(
                  <Select
                    onSelect={ val => this.setState({ isDateTime: val === '01' ?  true:false})}
                  >
                    <Option value={'00'}>当前待结账</Option>
                    <Option value={'01'}>历史数据</Option>
                    <Option value={'02'}>当前数据</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            {
              isDateTime
              &&
              <Col span={8}>
                <FormItem {...formItemLayout} label={`会计月`}>
                  {
                    getFieldDecorator(`acctDate`,{
                      rules: [{ required:isDateTime ? true : false, message: isDateTime ? '请选择日期': null }]
                    })(
                      <MonthPicker style={{width: 200}} format='YYYY-MM'/>
                    )
                  }
                </FormItem>
              </Col>
            }
              <Col style={{display: display}} span={8}>
                <FormItem label={`产品名称`} {...formItemLayout}>
                  {getFieldDecorator(`materialName`)(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
              <Col  style={{display: display}} span={8}>
                <FormItem  label="型号" {...formItemLayout} >
                  {getFieldDecorator(`fmodel`)(
                    <Input placeholder='请输入'/>
                  )}
                </FormItem>
              </Col>
              <Col style={{display: display}} span={8}>
                <FormItem  label="规格" {...formItemLayout} >
                  {getFieldDecorator(`spec`)(
                    <Input placeholder='请输入'/>
                  )}
                </FormItem>
              </Col>
              <Col  style={{display: display}} span={8}>
                <FormItem label='供应商' {...formItemLayout}>
                  {getFieldDecorator(`fOrgId`, {
                    initialValue: ''
                  })(
                    <Select 
                      showSearch
                      placeholder={'请选择'}
                      optionFilterProp="children"
                      filterOption={(input, option)=>this.filterOption(input, option)}
                      >
                      <Option value=''>全部</Option>
                      {
                        supplierOptions.map((item, index) => <Option key={index} value={item.value.toString()}>{ item.text }</Option>)
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8} style={{textAlign:'right', float: 'right'}}>
                <Button type="primary"  icon="search" htmlType="submit" style={{marginRight:8,verticalAlign: 'middle'}}>搜索</Button>
                <Button onClick={()=>this.resetFields()} style={{verticalAlign: 'middle'}}>重置</Button>
                <a style={{marginLeft: 30, fontSize: 14}} onClick={this.toggle}>
                  {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
                </a>
              </Col>
            </Row>
            <Row>
              <Button style={{marginLeft: 10}} icon="line-chart" onClick={this.genReport} loading={this.state.loading}> 生成报表 </Button>
              <a href={exportHref}><Button loading={this.state.isLoading} style={{marginLeft: 10}} icon="download" type="primary" ghost > 导出 </Button></a>
                  
            </Row>
        </Form>
        {
          query.bDeptId 
          &&
          <RemoteTable   
            style={{marginTop:20}}
            showHeader={true}
            query={query}
            ref='table'
            columns={columns}
            isList={true}
            scroll={{ x: '150%' ,y : document.body.clientHeight}}
            url={financialControl.selectInventoryCollect}
            rowKey={'guid'}
            footer={footer}
          />
        }
      </Content>
    )
  }
}

export default Form.create()(InventorySummary);
