/*
 * @Author: yuwei - 新建设备发票 addEquipmentInvoice
 * @Date: 2018-07-04 16:05:33 
* @Last Modified time: 2018-07-04 16:05:33 
 */
import React , { Component } from 'react';
import { Row,Col,Layout,Input,Icon, Button,Form,Select,Table,Modal,Affix,message,DatePicker} from 'antd';
import TableGrid from '../../../component/tableGrid';
import { fetchData , moneyValid } from '../../../utils/tools';
import querystring from 'querystring';
import storage from '../../../api/storage';
import moment from 'moment';
import { deliveryStatus } from '../../../constants';
const { RemoteTable } = TableGrid;
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const Confirm = Modal.confirm;
// const Search = Input.Search;
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
  getNextSelect = (val) => {
    this.props.form.setFieldsValue({'bDeptId':''})
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
    const { orgSelect , managementDeptSelect } = this.state;
    const options = orgSelect.map(d => <Option value={d.value.toString()} key={d.value}>{d.test}</Option>);
    const managementDeptOptions = managementDeptSelect.map(d => <Option value={d.value.toString()} key={d.value}>{d.text}</Option>);
   
    return (
      <Form>
        <Row>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="二维码"
            >
              {getFieldDecorator('invoiceQrcode')(
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
                rules:[{required:true,message:"请输入发票金额!"},{validator: this.validMoney}]
              })(
                <Input  placeholder='请输入' />
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="发票代码"
            >
              {getFieldDecorator('invoiceCode',{
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
                rules:[{required:true,message:'请选择开票日期'}]
              })(
                <DatePicker  placeholder='请选择' style={{width:'100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={`供应商`} {...formItemLayout}>
              {getFieldDecorator(`fOrgId`,{
                initialValue:"",
                rules:[{required:true,message:'请选择供应商'}]
              })(
                <Select 
                showSearch
                placeholder={'请选择供应商'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                // onSelect={(val)=>this.getNextSelect(val)}
                >
                  <Option key="" value="">请选择</Option>
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={`管理部门`} {...formItemLayout}>
              {getFieldDecorator(`bDeptId`,{
                initialValue:"",
                rules:[{required:true,message:'请选择管理部门'}]
              })(
                <Select   
                showSearch
                placeholder={'请选择管理部门'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={(input,option)=>this.props.changeMainDataSource(input)}
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

class ModalSearchForm extends Component {
  state={
    display: 'none',
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
  render(){
    const { getFieldDecorator } = this.props.form;
    const { display } = this.state;
    return (
      <Form  onSubmit={this.handleSearch}>
        <Row>
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
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="产品名称"
            >
              {getFieldDecorator('assetName')(
                <Input  placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="型号"
            >
              {getFieldDecorator('fmodel')(
                <Input  placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={6} style={{textAlign:'right',paddingRight:15,paddingTop:5}}> 
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginLeft: 20,}} onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 20, fontSize: 14}} onClick={this.toggle}>
                {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
          </Col>
        </Row>
        <Row style={{display: display}}>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="规格"
            >
              {getFieldDecorator('spec')(
                <Input  placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
const ModalSearchFormWapper = Form.create()(ModalSearchForm);



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
    render:(text)=> text?(text-0).toFixed(2):''
  },
  {
    title:"数量",
    dataIndex:"amount"
  },
  {
    title:"金额",
    dataIndex:"totalPrice",
    render:(text)=> text?(text-0).toFixed(2):''
  }
]
class AddEquipmentInvoice extends Component{
  state={
    visible:false,
    selectedRowKeys:[],//弹窗 - 选中 
    selectedRows:[],//弹窗 - 选中的信息 
    modalQuery:{},//弹窗的query条件
    mainTableData:[],//mainTable的数据
    expandedRowKeys:[],//展开的Key
  }
  //弹窗 - 打开 + 获取当前必填数据进行请求
  openModal = () => {
    this.refs.form.validateFields(['fOrgId','bDeptId'],(err,values)=>{
      if(!err){
        this.setState({visible:true,modalQuery:values})
        if(this.refs.table){
          this.refs.table.fetch({...values});
        }
      }
    })
  }
  //弹窗 - 提交
  // getModalData = ()=>{
  //   this.refs.modalForm.resetFields();
  //   this.refs.table.fetch(this.state.modalQuery);    
  //   let newArr = [].concat(this.state.selectedRows);
  //   this.setState({visible:false,selectedRowKeys:[],mainTableData:newArr})
  // }
  //弹窗 - 取消
  // closeModal = () =>{
  //   this.refs.modalForm.resetFields();
  //   this.setState({visible:false,selectedRowKeys:[]})
  // }
  //弹窗内部 进行- 搜索table
  searchModalTable = (val) => {
    let a = Object.assign(this.state.modalQuery,val)
    this.refs.table.fetch(a);
  }
  //开票金额
  total = () => {
    const {selectedRows} = this.state;
    let ret = 0;
    if(selectedRows.length>0){
      selectedRows.map((item)=>{
        ret += item.currentPayed?item.currentPayed:(Number(item.totalPrice) - Number(item.alreadyAmount));
        return item;
      })
    }
    return (ret-0).toFixed(2)
  }
  //保存-设备发票
  submit = () => {

    const { selectedRows } = this.state;
    if(selectedRows.length===1){
      this.refs.form.validateFields((err,values)=>{
        if(!err){
          values.invoiceDate = moment(values.invoiceDate).format('YYYY-MM-DD');
          values.currentPayed = selectedRows[0].currentPayed;
          values.sendId = selectedRows[0].sendId;
            fetchData(storage.insertInvoiceZc,querystring.stringify(values),(data) => {
              if(data.status){
                  message.warn('新建设备发票完成！');
                  this.refs.form.resetFields();
                  this.setState({
                    selectedRowKeys:[],
                    selectedRows:[]
                  })
              }else{
                message.error(data.msg)
              }
            })
        }
      });
      
    }else{
      message.warn('只能一条送货单进行操作！')
    }
  }

  //删除 - 主table的数据
  deleteMainTable = (record,index) => {
    let  { selectedRows } = this.state;
    selectedRows.splice(index,1);
    this.setState({
      selectedRows
    })
  }
  //输入框- 主table的本次开票金额
  setRowInput = (val,index) => {
    let { selectedRows } = this.state;
    let validResult = moneyValid(val)
    if(validResult[0]){
      console.log(selectedRows[index])
      selectedRows[index].currentPayed = val;
      this.setState({selectedRows});
    }else{
      if(validResult[1] && validResult[1]!==""){
        message.warn(validResult[1]);
      }
    }
  }
  insertToMainTable = (record) =>{
    record.currentPayed = Number(record.totalPrice) - Number(record.alreadyAmount);
    if(this.state.selectedRows.length>0){
      Confirm({
        content:"是否需要更换送货单信息?",
        onCancel:()=>{},
        onOk:()=>{
          this.refs.modalForm.resetFields();
          this.refs.table.fetch(this.state.modalQuery);    
          this.setState({selectedRows:[record],visible:false,expandedRowKeys:[]})
        }
      })
    }else{
      this.refs.modalForm.resetFields();
      this.refs.table.fetch(this.state.modalQuery);  
      this.setState({selectedRows:[record],visible:false,expandedRowKeys:[]})
    }
  }

  cancelModal = () =>{
    this.refs.modalForm.resetFields();
    this.setState({visible:false,expandedRowKeys:[]}) 
  }

  showExpand =(expandedRows)=>{
    this.setState({expandedRowKeys:expandedRows})
  }

  //1-更换管理部门的时候 - 清空主表中的数据
  clearTable = (data) =>{
    console.log('更换管理部门后收集到的值，',data)
    const { selectedRows } = this.state;
    if(selectedRows.length>0){
      Confirm({
        content:"已有选择的送货单,确认后将会清空当前选择！",
        onOk:()=>{
          this.setState({selectedRows:[]})
        },
        onCancel:()=>{}
      })
    }
  }
  render(){
    const { visible ,selectedRows , expandedRowKeys} = this.state;
    const modalHeader = (
      <Row>
        <Col span={12}>添加送货单</Col>
        {/*
        <Col span={12} style={{textAlign:'right'}}>
          <Button type='primary' style={{marginRight:15}}  onClick={()=>this.getModalData()}>确定</Button>
          <Button type='primary' onClick={()=>this.closeModal()}>取消</Button>
        </Col>*/}
      </Row>
    )
    const mainColumns = [
      {
        title:"送货单号",
        dataIndex: 'sendNO',
      },
      {
        title:"本次开票金额",
        dataIndex: 'currentPayed',
        render:(text,record,index)=>(
          <Input defaultValue={(Number(record.totalPrice) - Number(record.alreadyAmount)) || '0.00'} style={{width:200}} onInput={(e)=>this.setRowInput(e.target.value,index)}/>
        )
      },
      {
        title:"已开票金额",
        dataIndex: 'alreadyAmount',
        render:(text)=> text?(text-0).toFixed(2):'0.00'
      },
      {
        title:"送货单金额",
        dataIndex: 'totalPrice',
        render:(text)=> text?(text-0).toFixed(2):'0.00'
      },
      {
        title:"状态",
        dataIndex: 'fstate',
        render:(text)=>deliveryStatus[text].text
      },
      {
        title:"操作",
        dataIndex:'actions',
        render:(text,record,index)=>(
          <a onClick={()=>this.deleteMainTable(record,index)}>删除</a>
        )
      }
    ]
    const columns = [
      {
        title:'操作',
        dataIndex:'index',
        width:100,
        render:(text,record)=>{
          return(
            <a onClick={()=>this.insertToMainTable(record)}>添加</a>
          )
        }
      },
      {
        title:"送货单号",
        dataIndex: 'sendNO',
        width:100
      },
      {
        title:"已开票金额",
        dataIndex: 'alreadyAmount',
        width:100,
        render:(text)=>(text-0).toFixed(2)
      },
      {
        title:"送货单金额",
        dataIndex: 'totalPrice',
        width:100,
        render:(text)=> text?(text-0).toFixed(2):''
      },
      {
        title:"状态",
        dataIndex: 'fstate',
        width:100,
        render:(text)=>deliveryStatus[text].text
      },
    ]
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        {/*填写设备发票表格*/}
        <SearchFormWapper ref='form' changeMainDataSource={(data)=>this.clearTable(data)}/>
        <Row>
          <Button type='primary' onClick={()=>this.openModal()}>选择送货单</Button>
        </Row>
        <Table 
          columns={mainColumns}
          rowKey={'sendId'}
          dataSource={selectedRows}//mainTableData
          expandedRowRender={(record)=>{
            if(record.DeliveryDetailZcList && record.DeliveryDetailZcList.length!==0){
              return(
                <Table
                  rowKey='sendDetailGuid'
                  columns={subColumnsData}
                  dataSource={record.DeliveryDetailZcList}
                ></Table>
              )
            }else{
              return(<p>暂无数据</p>)
            }
          }} 
          >
        </Table>

        {/*提交设备发票*/}
        <Affix offsetBottom={0} >
            <div style={{padding:10,background:'#fff',clear:'both',height:52}}>
              <span >开票金额： <i style={{color:'red'}}>{this.total()}</i></span>
              <Button type="primary" style={{float:'right'}} onClick={()=>this.submit()}>保存</Button>
            </div>
        </Affix>
        {/*选择送货单*/}
        <Modal
          width={980}
          visible={visible}
          title={modalHeader}
          onCancel={()=>this.cancelModal()}
          footer={null}>
          <ModalSearchFormWapper query={(val)=>this.searchModalTable(val)} ref='modalForm'></ModalSearchFormWapper>
          <RemoteTable
              query={this.state.modalQuery}
              ref='table'
              showHeader={true}
              rowKey={'sendId'}
              url={storage.selectZCDeliveryListInvoice}
              columns={columns}
              size='small' 
              scroll={{ x: '100%',y:"150%" }}
              // rowSelection={{
              //   selectedRowKeys:selectedRowKeys,
              //   onChange:(selectedRowKeys,selectedRows)=>{
              //     this.setState({selectedRowKeys,selectedRows})
              //   },
              //   onSelectAll:(selected, selectedRows, changeRows)=>{  
              //     this.setState({selectedRows})
              //   }
              // }}
              onExpandedRowsChange={(expandedRows)=>this.showExpand(expandedRows)}
              expandedRowKeys={expandedRowKeys}
              expandedRowRender={(record)=>{
                if(record.DeliveryDetailZcList && record.DeliveryDetailZcList.length!==0){
                  return(
                    <Table
                      rowKey='sendDetailGuid'
                      columns={subColumnsData}
                      dataSource={record.DeliveryDetailZcList}
                    ></Table>
                  )
                }else{
                  return(<p>暂无数据</p>)
                }
              }} 
            />
        </Modal>
      </Content>
    )
  }
}
export  default  AddEquipmentInvoice; 