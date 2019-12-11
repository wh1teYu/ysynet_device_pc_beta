/*
 * @Author: yuwei  - 编辑发票
 * @Date: 2018-07-04 16:08:52 
* @Last Modified time: 2018-07-04 16:08:52 
 */
import React , { Component } from 'react';
import { Row,Col,Input,Button,Form,Select,Table,Affix,DatePicker,Breadcrumb,message} from 'antd';//message,
import TableGrid from '../../../component/tableGrid';
import { fetchData  } from '../../../utils/tools';
import querystring from 'querystring';
import storage from '../../../api/storage';
import { Link } from 'react-router-dom';
import { deliveryStatus } from '../../../constants';
import moment from 'moment';
const { RemoteTable } = TableGrid;
const FormItem = Form.Item;
const Option = Select.Option;
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
    orgSelect:[],//医疗机构
    managementDeptSelect:[],//管理部门
  }
  componentDidMount = () => {
    this.setOrgSelect();
  }
  //获取医疗机构下拉框
  setOrgSelect = () => {
    fetchData(storage.ORG_TYPE_LIST,querystring.stringify({orgType:"01"}),(data) => {
      if(data){
      this.setState({
        orgSelect:data.result
      })
      }
    })
  }
  //获取管理部门下拉框
  getNextSelect = (val) => {
    console.log(val)
    fetchData(storage.selectUseDeptList,querystring.stringify({orgId:val,deptType:"01"}),(data) => {
      if(data){
      this.setState({
        managementDeptSelect:data.result
      })
      }
  })
  }

  validMoney = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const mentions = getFieldValue('accountPayed');
    let num = Number(mentions)
    if (!num || /^\d+$/.test(num) ||  /(^\d+\.\d{1}$)/.test(num) || /(^\d+\.\d{2}$)/.test(num)) {
      if (num > 99999999.99) {
        callback(new Error('输入数值过大, 不能超过100000000'));
      }else{
        callback();
      }
    } else {
        callback(new Error('请输入非0正数,最多保留两位小数！'));
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const baseInfo = this.props.data;
    const { orgSelect , managementDeptSelect } = this.state;
    const options = orgSelect.map(d => <Option value={d.value.toString()} key={d.value}>{d.text}</Option>);
    const managementDeptOptions = managementDeptSelect.map(d => <Option value={d.value.toString()} key={d.value}>{d.text}</Option>);

    return (
      <Form  onSubmit={this.handleSearch}>
        <Row>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="二维码"
            >
              {getFieldDecorator('invoiceQrcode',{
                initialValue:baseInfo.invoiceQrcode
              })(
                <Input placeholder='使用条码枪扫描'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="发票金额"
            >
              {getFieldDecorator('accountPayed',{
                initialValue:baseInfo.accountPayed,
                rules:[{required:true,message:"请输入发票金额!"},{validator: this.validMoney}]
              })(
                <Input  disabled={true} placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="发票代码"
            >
              {getFieldDecorator('invoiceCode',{
                initialValue:baseInfo.invoiceCode,
                rules:[{required:true,message:"请输入发票代码!"}]
              })(
                <Input  placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="发票号码"
            >
              {getFieldDecorator('invoiceNo',{
                initialValue:baseInfo.invoiceNo,
                rules:[{required:true,message:"请输入发票号码!"}]
              })(
                <Input  placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="开票日期"
            >
              {getFieldDecorator('invoiceDate',{
                initialValue:moment(baseInfo.invoiceDate,'YYYY-MM-DD'),
                rules:[{required:true,message:'请选择开票日期!'}]
              })(
                <DatePicker placeholder='请选择' style={{width:'100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="医疗机构"
            >
              {getFieldDecorator('rOrgId',{
                initialValue:baseInfo.rOrgName,
                rules:[{required:true,message:'请选择医疗机构'}]
              })(
                <Select 
                disabled={true}
                showSearch
                placeholder={'请选择管理部门'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onSelect={(val)=>this.getNextSelect(val)}>
                  <Option key="" value="">请选择</Option>
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="管理部门"
            >
              {getFieldDecorator('bDeptId',{
                initialValue:baseInfo.bDeptName,
                rules:[{
                  required:true,message:'请选择管理部门'
                }]
              })(
                <Select   
                disabled={true}
                showSearch
                placeholder={'请选择管理部门'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option key="" value="">请选择</Option>
                  {managementDeptOptions}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);

const columns = [
  {
    title:"送货单号",
    dataIndex: 'sendNo',
  },
  {
    title:"已开票金额",
    dataIndex: 'accountPayed',
    render:(text)=> text?(text-0).toFixed(2):''
  },
  {
    title:"送货单金额",
    dataIndex: 'totalPrice',
    render:(text)=> text?(text-0).toFixed(2):''
  },
  {
    title:"状态",
    dataIndex: 'fstate',
    render:(text)=>text ?deliveryStatus[text].text:""
  }
]
const subColumnsData = [
  {
    title:"产品",
    dataIndex:"materialName"
  },
  {
    title:"型号",
    dataIndex:"fmodel"
  },
  {
    title:"规格",
    dataIndex:"spec"
  },
  {
    title:"单位",
    dataIndex:"purchaseUnit"
  },
  {
    title:"单价",
    dataIndex:"purchasePrice",
    render:(text)=> text?Number(text).toFixed(2):''
  },
  {
    title:"数量",
    dataIndex:"amount"
  },
  {
    title:"金额",
    dataIndex:"totalPrice",
    render:(text)=> text?Number(text).toFixed(2):''
  }
]

class EditEquipmentInvoice extends Component{

  state={
    visible:false,
    totalPrice:0.00
  }

  //保存-设备发票
  submit = () => {
    const baseInfo = this.props.location.state;
    this.refs.form.validateFields((err,values)=>{
      if(!err){
        values.invoiceDate = moment(values.invoiceDate).format('YYYY-MM-DD');
        values.invoiceId = baseInfo.invoiceId;
        const {bDeptId,rOrgId,...postData} = values;
        console.log(bDeptId,rOrgId)
        fetchData(storage.updateInvoiceZc,querystring.stringify(postData),(data) => {
          if(data.status){
            message.warn('保存成功');
            this.props.router.goBack()
          }else{
            message.error(data.msg)
          }
        })
      }
    });
  }
  render(){
    const baseInfo = this.props.location.state || '';
    return (
      <div>
        <Row>
          <Col className="ant-col-6">
            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
              <Breadcrumb.Item><Link to='/storage/queryEquipmentInvoice'>设备发票查询</Link></Breadcrumb.Item>
              <Breadcrumb.Item>详情</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <SearchFormWapper data={baseInfo} ref='form'/>
        <RemoteTable
            query={{invoiceId:baseInfo.invoiceId}}
            rowKey={'invoiceId'}
            url={storage.selectInvoiceDetail}
            columns={columns}
            size='small' 
            scroll={{ x: '100%' }}
            expandedRowRender={(record)=>{
              if(record.subList && record.subList.length!==0){
                return(
                  <Table
                    rowKey={'sendDetailGuid'}
                    columns={subColumnsData}
                    dataSource={record.subList}
                  ></Table>
                )
              }else{
                return(<p>暂无数据</p>)
              }
            }} 
            callback={(data)=>{
              console.log(data)
              this.setState({
                totalPrice:data.result[0].accountPayed
              })
            }}
          />
        <Affix offsetBottom={0} >
            <div style={{padding:10,background:'#fff',clear:'both',height:52}}>
              <span >开票金额： <i style={{color:'red'}}>{this.state.totalPrice.toFixed(2)}</i></span>
              <Button type="primary" style={{float:'right'}} onClick={()=>this.submit()}>保存</Button>
            </div>
        </Affix>
      </div>
    )
  }
}
export default EditEquipmentInvoice;