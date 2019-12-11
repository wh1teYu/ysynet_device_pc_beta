/*
 * @Author: yuwei  - warehouseSummary - 入库汇总
 * @Date: 2018-07-18 13:54:21 
* @Last Modified time: 2018-07-18 13:54:21 
 */
import React, { Component } from 'react';
import { Layout, Form, Row, Col, Select, message,
  DatePicker, Button, Modal } from 'antd';
import TableGrid from '../../../component/tableGrid';
import financialControl from '../../../api/financialControl';
import { fetchData } from '../../../utils/tools';
import moment from 'moment'
import querystring from 'querystring';
const { Content } = Layout;
const { RemoteTable } = TableGrid;
const Option = Select.Option;
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
  title: '供应商名称',
  dataIndex: 'orgName',
  width: 300,
  key: 'orgName',
  }, {
    title: '财务分类',
    dataIndex: 'styleName',
    key: 'styleName',
    width: '20%',
  }, {
    title: '金额',
    dataIndex: 'zje',
    width: '20%',
    key: 'zje',
    render: (text,record,index) => {
      return text === 'undefined'|| text===null ? '0':text.toFixed(2);
    }
  }, {
    title: '供应商区域',
    dataIndex: 'province',
    width: '30%',
    key: 'province',
  }
];


class WarehouseSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {},
      storageOptions: [],
      showDate: false,
      storageName: null,
      supplierOptions: [],
      isLoading: false
    }
  }
  componentWillMount() {
    fetchData(financialControl.queryManagerDeptListByUserId, {}, data => {
      const result = data.result;
      const options = [];
      if (result.length) {
        result.map((item) => options.push({value: item.value, text: item.text}));
        this.setState({storageOptions: options, 
          storageName: result[0].text,
          query: {
            bDeptId: result[0].value,//'64E868F27234463AE050FC0AEC592505'
            acctType:'00',
          }
        });
        this.setSupplierOptions(result[0].value)
      }
    })
  }

  filterOption = (input, option) => {
    if(option.props.children){
      return option.props.children.indexOf(input) >= 0
    }
    return false
  }

  setSupplierOptions = (bDeptId) => {
    //{bDeptId: bDeptId}
    fetchData(financialControl.selectFOrgList, querystring.stringify({}), data => {
      const supplierOptions = [];
      data.result.map(item => supplierOptions.push({value: item.orgId, text: item.orgName}))
      this.setState({ supplierOptions })
    })
  }
  onSubmit = e => {
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
        console.log(JSON.stringify(values))
        this.refs.table.fetch({
          ...values
        })
      }
    });
  }
  //处理错误信息
  handleError = (data) =>{
    Modal.error({
      title: '错误提示',
      content: data,
      okText: '确定'
    });
  }
  genReport = () => {
    this.setState({isLoading: true})
    const bDeptId = this.props.form.getFieldValue('bDeptId');
    fetchData(financialControl.createForms, querystring.stringify({bDeptId: bDeptId}), data => {
      if (data.status) {
        message.success('报表生成成功!')
      } else {
        this.handleError(data.msg);
      }
      this.setState({isLoading: false})
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
  handleReset = () => {
    const { storageOptions } = this.state;
    this.props.form.resetFields();
    this.refs.table.fetch({bDeptId:storageOptions[0].value,acctType:'00'});
    this.setState({showDate:false})
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { query, storageOptions, showDate, supplierOptions, isLoading } = this.state;
    let values = this.exportReport();
    const exportHref = financialControl.exportImportCollect+'?'+querystring.stringify(values);
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
        <Form onSubmit={this.onSubmit}>
          <Row>
            <Col span={8}>
              <FormItem label={`管理部门`} {...formItemLayout}>
                {getFieldDecorator(`bDeptId`, {
                  initialValue: storageOptions.length ? storageOptions[0].value : null
                })(
                  <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option)=>this.filterOption(input, option)}
                  onSelect={(val,option) => {
                    this.setSupplierOptions(val);
                    this.setState({ storageName: option.props.children })
                    this.props.form.setFieldsValue({fOrgId: ''})
                  }}>
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
              <FormItem label='供应商' {...formItemLayout}>
                {getFieldDecorator(`fOrgId`, {
                  initialValue: null
                })(
                  <Select 
                    showSearch
                    placeholder={'请选择'}
                    optionFilterProp="children"
                    filterOption={(input, option)=>this.filterOption(input, option)}
                    >
                    <Option value={null}>全部</Option>
                    {
                      supplierOptions.map((item, index) => <Option key={index} value={item.value.toString()}>{ item.text }</Option>)
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='入库方式' {...formItemLayout}>
                {getFieldDecorator(`intype`, {
                  initialValue: []
                })(
                  <Select 
                    placeholder='全部'
                    className={'repot_trend_holder'}
                    mode="multiple">
                    <Option value="01" key={'1'}>采购入库</Option>
                    <Option value="06" key={'2'}>退货</Option>
                    {/*
                    <Option value="04" key={'3'}>盘盈</Option>
                    <Option value="05" key={'4'}>初始化</Option>
                    <Option value="06" key={'5'}>退货</Option>
                    <Option value="07" key={'6'}>调拨</Option>*/}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem  {...formItemLayout} label='状态'>
                {getFieldDecorator(`acctType`, {
                  initialValue: '00'
                })(
                  <Select 
                    onChange={ val => 
                    val === "01" ? this.setState({showDate: true}) : this.setState({showDate: false})
                  }>
                    <Option value={'00'}>待结账</Option>
                    <Option value={'01'}>已结账</Option>
                  </Select>
                )}
              </FormItem>
              
            </Col>
            {
              showDate ? 
                <Col span={8} >
                  <FormItem {...formItemLayout} label={`会计月`}>
                    {getFieldDecorator(`acctDate`,{
                      initialValue:null,
                      rules: [{required: true, message: '请选择日期'}]
                    })(
                      <MonthPicker format={'YYYY-MM'} style={{ width: '100%' }}/>
                    )}
                  </FormItem> 
              </Col> : null
            }
            <Col span={8} style={{textAlign: 'right'}}>
              <Button type="primary" icon="search" htmlType="submit" style={{marginTop: 3,marginRight:8,verticalAlign: 'baseline'}}>搜索</Button>
              <Button style={{marginLeft:8,verticalAlign: 'baseline'}} onClick={()=>this.handleReset()}>重置</Button>
            </Col>
          </Row>
          <Row>
            <Button loading={isLoading} style={{marginLeft: 10}} icon="line-chart" onClick={this.genReport}> 生成报表 </Button>
            <a href={exportHref}><Button loading={isLoading} style={{marginLeft: 10}} icon="download" type="primary" ghost > 导出 </Button></a>
          </Row>
        </Form>
        {
          query.bDeptId ?
          <RemoteTable   
            style={{marginTop:20}}
            showHeader={true}
            query={query}
            ref='table'
            columns={columns}
            isList={true}
            scroll={{x: '100%', y : document.body.clientHeight}}
            url={financialControl.selectImportCollect}
            rowKey={'ROWNUM'}
          /> : null
        }
      </Content>
    )
  }
}

export default Form.create()(WarehouseSummary);
