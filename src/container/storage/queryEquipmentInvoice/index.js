/*
 * @Author: yuwei 查询设备发票 queryEquipmentInvoice
 * @Date: 2018-07-04 16:08:12 
* @Last Modified time: 2018-07-04 16:08:12 
 */
import React , { Component } from 'react';
import { Row,Col,Input,Layout,Icon,Button,Form,Select,DatePicker,Modal,message} from 'antd';
import { fetchData } from '../../../utils/tools';
import { Link } from 'react-router-dom';
import querystring from 'querystring';
import storage from '../../../api/storage';
import { equipmentInvoiceStatus , equipmentInvoiceSelect} from '../../../constants';
import moment from 'moment';
import TableGrid from '../../../component/tableGrid';
const { Content } = Layout;
const { RemoteTable } = TableGrid;
const FormItem = Form.Item;
const Option = Select.Option;
const Confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
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
    display: 'none',
    orgSelect:[],//医疗机构
    managementDeptSelect:[],//管理部门
  }
  componentDidMount = () => {
    this.setOrgSelect();
  }

  //获取医疗机构下拉框
  setOrgSelect = () => {
    fetchData(storage.selectDeliveryForgList,querystring.stringify({orgType:"01"}),(data) => {
      if(data){
       this.setState({
        orgSelect:data.result
       })
      }
    })
    fetchData(storage.selectUseDeptList,querystring.stringify({deptType:"01"}),(data) => {
      if(data){
       this.setState({
        managementDeptSelect:data.result
       })
      }
   })
  }
  //获取管理部门下拉框
  // getNextSelect = (val) => {
  //   console.log(val)
  //   this.props.form.setFieldsValue({'bDeptId':''})
   
  // }

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
      console.log(values)
      if(values.createTime){
        values.createStartTime = moment(values.createTime[0]).format('YYYY-MM-DD');
        values.createEndTime = moment(values.createTime[1]).format('YYYY-MM-DD')
        delete values['createTime']
      }
      if(values.invoiceTime){
        values.invoiceStartTime = moment(values.invoiceTime[0]).format('YYYY-MM-DD');
        values.invoiceEndTime = moment(values.invoiceTime[1]).format('YYYY-MM-DD');
        delete values['invoiceTime']
      }
      this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { display , orgSelect , managementDeptSelect } = this.state;
    const options = orgSelect.map(d => <Option value={d.value.toString()} key={d.value}>{d.test}</Option>);
    const managementDeptOptions = managementDeptSelect.map(d => <Option value={d.value.toString()} key={d.value}>{d.text}</Option>);
   
    return (
      <Form  onSubmit={this.handleSearch}>
        <Row>
          <Col span={6}>
            <FormItem label={`管理部门`} {...formItemLayout}>
              {getFieldDecorator(`bDeptId`,{
                initialValue:""
              })(
                <Select   
                showSearch
                placeholder={'请选择管理部门'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option key="" value="">全部</Option>
                  {managementDeptOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={`供应商`} {...formItemLayout}>
              {getFieldDecorator(`fOrgId`,{
                initialValue:""
              })(
                <Select 
                showSearch
                placeholder={'请选择供应商'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                // onSelect={(val)=>this.getNextSelect(val)}
                >
                  <Option key="" value="">全部</Option>
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="状态"
            >
              {getFieldDecorator('fstate',{
                initialValue:""
              })(
                <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="" key={-1}>全部</Option>
                  {
                    equipmentInvoiceSelect.map((item)=>(<Option value={item.value} key={item.value}>{item.text}</Option>))
                  }
                </Select>
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
              label="发票代码"
            >
              {getFieldDecorator('invoiceCode')(
                <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="发票号码"
            >
              {getFieldDecorator('invoiceNo')(
                <Input  placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="开票日期"
            >
              {getFieldDecorator('invoiceTime')(
                <RangePicker></RangePicker>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="制单日期"
            >
              {getFieldDecorator('createTime')(
                <RangePicker></RangePicker>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="送货单号"
            >
              {getFieldDecorator('sendNo')(
                <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);

class QueryEquipmentInvoice extends Component{

  state={
    query:{}
  }

  serachTable = (val) => {
    console.log(val)
    this.refs.table.fetch(val)
  }
  //单行删除
  deleteRow = (record) => {
    Confirm({
      title: '删除',
      content: '确认要删除该发票吗？',
      okText: '确认',
      cancelText: '取消',
      onOk:()=>{
        //此处执行删除的操作
        fetchData(storage.deleteInvoiceZc,querystring.stringify({invoiceId :record.invoiceId}),(data) => {
          if(data.status){
            message.warn('删除成功')
            this.refs.table.fetch({})
          }else{
            message.warn(data.msg)
          }
        })
      },
      onCancel:()=>{}
    })
  }
  //过滤每条信息的操作显示
  filterButton = (record)=>{
    if(record.fstate==="00"){//00
      return (<a onClick={()=>this.deleteRow(record)}> 删除 </a>)
    }else if (record.fstate==="09") {//09
      return (<Link to={{pathname:'/storage/queryEquipmentInvoice/edit',state:{...record} }}> 编辑 </Link>)
    }else{
      return null
    }
  }
  render(){
    const columns = [
      {
        title:"状态",
        dataIndex: 'fstate',
        render:(text)=>equipmentInvoiceStatus[text].text
      },
      {
        title:"发票代码",
        dataIndex: 'invoiceCode',
      },
      {
        title:"发票号码",
        dataIndex: 'invoiceNo',
      },
      {
        title:"发票金额",
        dataIndex: 'accountPayed',
        render:(text)=>(text-0).toFixed(2)
      },
      {
        title:"开票日期",
        dataIndex: 'invoiceDate',
        render:(text)=>text.substr(0,11)
      },
      {
        title:"供应商",
        dataIndex: 'fOrgName',
      },
      {
        title:"医疗机构 ",
        dataIndex: 'rOrgName',
      },
      {
        title:"制单人",
        dataIndex: 'createUserName',
      },
      
      {
        title:"制单时间",
        dataIndex: 'createTime',
        render:(text)=>text.substr(0,11)
      },
      {
        title:"操作",
        dataIndex:"actions",
        render:(text,record,index) => {
          return record.isROrgUser===""||record.isROrgUser===null ? null: (
            <span>
            <Link to={{pathname:'/storage/queryEquipmentInvoice/details',state:{...record} }}> 查看 </Link>
            {
              this.filterButton(record)
            }
            </span>
            
          )
        }
      },
    ]
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        <SearchFormWapper query={(val)=>this.serachTable(val)}/>
        <RemoteTable
            showHeader={true}
            query={this.state.query}
            ref='table'
            rowKey={'invoiceId'}
            url={storage.selectZCInvoiceList}
            columns={columns}
            size='small' 
            scroll={{ x: '150%' }}
        />
      </Content>
    )
  }
}
export  default  QueryEquipmentInvoice;