/*
 * @Author: yuwei - 入库管理- 退货
 * @Date: 2018-07-17 09:38:43 
* @Last Modified time: 2018-07-17 09:38:43 
 */

import React , { Component } from 'react';
import { Alert , Form, Row, Col ,Input ,  Icon , Layout  , Button,Select,message,Modal, Table} from 'antd';
import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
import request from '../../../utils/request';
import queryString from 'querystring';
import moment from 'moment';
import _ from 'lodash';
const { RemoteTable } = TableGrid;
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const Confirm = Modal.confirm;
const inline = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
};
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
      if(values.Time){
        values.startTime = moment(values.Time[0]).format('YYYY-MM-DD');
        values.endTime = moment(values.Time[1]).format('YYYY-MM-DD');
      }
      delete values['Time']
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
          <Col span={8}> 
            <FormItem
              {...formItemLayout}
              label="产品名称"
            >
              {getFieldDecorator('materialName')(
                <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={8}> 
            <FormItem
              {...formItemLayout}
              label="型号"
            >
              {getFieldDecorator('fmodel',{
                initialValue:""
              })(
                <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="规格"
            >
              {getFieldDecorator('spec')(
                <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="入库单号"
            >
              {getFieldDecorator('inNo')(
                <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="资产编号"
            >
              {getFieldDecorator('assetsRecord')(
                <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{textAlign:'right',paddingRight:15,paddingTop:5}}> 
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginLeft: 30,}} onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 30, fontSize: 14}} onClick={this.toggle}>
                {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);


class WareHouseRefund extends Component {
  state = {
    query:{bDeptId:this.props.form.getFieldsValue()},
    manageSelect:[],
    visible:false,//选择产品 - 弹窗
    actionKey:[],//主列表选择操作的数据
    modalSelectedRows:[],
    modalSelectedRowKeys:[],
    tableRows:[],
    modalDtSource:[]
  }
  constructor(props){
    super(props)
    this.setRow = _.debounce(this.setRow,300);
  }
  componentDidMount = () => {
    this.getManageSelect();
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
  queryHandler = (query) => {
      this.refs.table.fetch(query);
      this.setState({ query })
  }
  //弹窗 - 确定
  getModalData = ()=>{
    const { modalSelectedRows , modalSelectedRowKeys , tableRows , modalDtSource } = this.state;//modalDtSource 为包含编辑过后的数据源
    if(modalSelectedRows.length>0){
      let tableRowsPre =[];
      for(let i = 0;i<modalSelectedRowKeys.length;i++){
        modalDtSource.filter((item)=>{
          if(modalSelectedRowKeys[i] === item.importDetailGuid){
            tableRowsPre.push(item)
            return true
          }else{
            return false
          }
        })
      }
      console.log(tableRowsPre)
      let a = _.uniqBy(tableRowsPre.concat(tableRows),'importDetailGuid');
      this.setState({
        tableRows:a,
        visible:false,
        modalSelectedRowKeys:[]
      })
      this.refs.modalForm.resetFields();
    }else{
      message.warn('请最少选择一项产品！')
    }
  }
  //弹窗 - 关闭
  closeModal = () =>{
    this.setState({
      visible:false,
      modalSelectedRowKeys:[]
    })
    this.refs.modalForm.resetFields();
  }
  deleteRow = () =>{
    const { actionKey , tableRows} = this.state;
    if(actionKey.length>0){
      Confirm({
        content:"确定执行删除吗？",
        onOk:()=>{
          let tableRowAfter =[].concat(tableRows);
          for(let i = 0;i<actionKey.length;i++){
            tableRowAfter.filter((item,index)=>{
              if(actionKey[i] === item.importDetailGuid){
                tableRowAfter.splice(index,1)
                return true
              }else{
                return false
              }
            })
          }
          console.log(tableRowAfter)
          this.setState({tableRows:tableRowAfter})
        },
        onCancel:()=>{}
      })
    }else{
      message.warn('请至少选择一个进行操作！')
    }
  }

  //确定
  onSubmit = () =>{
    const {tableRows} = this.state;
    let values = this.props.form.getFieldsValue();
    let importDetailGuids =[];
    let tksl =[];
    tableRows.map((item)=>{
      tksl.push(item.tksl);
      importDetailGuids.push(item.importDetailGuid);
      return item
    })    
    let json ={
      ...values,
      importDetailGuids,
      tksl,
      totalPrice:this.getTotal(),
    }
    console.log('提交的退货信息',json)
    request(storage.insertOutImport,{
      body:queryString.stringify(json),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
          if(data.status){
            message.success('退货成功');
            const { history } = this.props;
            this._configPrint(json,data.result);
            history.push({pathname:'/storage/wareHouseMgt'})
          }else{
              message.error(data.msg)
          }
      },
      error: err => {console.log(err)}
    })
  }
  //自动打印配置
  _configPrint = (json,data) => {
    console.log(data)
    if(data&&data.storagePrintConfig==="01"){//调用自动打印
      //打印多个入库单
      data.InIdList&&data.InIdList.map((item)=>{
        window.open(`${storage.inputImport}?InId=${item}`)
        return item
      })
    }
  }
  //弹窗- 单行编辑
  setRow = (val,index) =>{
      const { modalDtSource } = this.state;
      console.log(val,index)
      let dtSource = [].concat(modalDtSource);
      dtSource[index].tksl = val ;
      this.setState({
        modalDtSource
      })
  }

  //搜索弹窗-
  searchTable = (val) =>{
    console.log(val)
    this.refs.modalTable.fetch(val)
  }
  //打开弹窗
  openModal=()=>{
    let val = this.props.form.getFieldsValue();
    console.log(val)
    if(this.refs.modalTable){
      this.refs.modalTable.fetch({...val})
    }
    this.setState({visible:true,query:val})
  }
  // 获取退货金额
  getTotal = () => {
    const { tableRows } = this.state;
    let ret = 0;
    tableRows.filter((item)=>{
      ret += item.tksl? item.tksl*item.purchasePrice :0;
      return item 
    })
    return  ret.toFixed(2)
  }
  //切换科室 - 清空 列表
  changeManage = () =>{
    const { tableRows } = this.state;
    if(tableRows.length>0){
      Confirm({
        content:'此操作将会清空已选择产品？',
        onOk:()=>{
          this.setState({tableRows:[]})
        },
        onCancel:()=>{}
      })
    }
  }
  
  render(){
      const columns = [
          {
            title : '退库数量',
            dataIndex : 'tksl',
            width: 80 ,
            // render : (text,record)=>1
          },{
            title : '入库单号',
            dataIndex : 'inNo',
            width: 120,
          },{
            title:'产品名称',
            dataIndex:'materialName',
            width: 120,
          },{
            title : '品牌',
            dataIndex : 'tfBrand',
            width: 120,
          },{
            title : '注册证号',
            dataIndex : 'registerNo',
            width: 120,
          },{
              title : '规格',
              dataIndex : 'spec',
              width: 120,
          },{
            title : '型号',
            dataIndex : 'fmodel',
            width: 120,
          },{
              title : '单位',
              dataIndex : 'purchaseUnit',
              width: 120,
          },
          {
            title : '采购价',
            dataIndex : 'purchasePrice',
            width: 150,
            render:(text,record,)=>text?Number(text).toFixed(2):''
          },	{
            title : '采购金额',
            dataIndex : 'bDeptName',
            width: 150,
            render:(text,record,)=>Number(record.tksl*record.purchasePrice).toFixed(2)
          },{
            title : '供应商',
            dataIndex : 'fOrgName',
            width: 200
          }
      ];
      const modalColumns = [
        {
          title : '退货数量',
          dataIndex : 'tksl',
          width: 120 ,
          render : (text,record,index)=><Input type='number' onInput={(e)=>this.setRow(e.target.value,index)}/>
        },{
          title : '库存数量',
          dataIndex : 'xcsl',
          width: 120 ,
        },{
          title : '入库数量',
          dataIndex : 'rksl',
          width: 120 ,
        },{
          title : '入库单号',
          dataIndex : 'inNo',
          width: 150,
        },{
          title : '资产编号',
          dataIndex : 'assetsRecord',
          width: 120,
        },{
          title:'产品名称',
          dataIndex:'materialName',
          width: 150,
        },{
          title : '品牌',
          dataIndex : 'tfBrand',
          width: 120,
        },{
          title : '注册证号',
          dataIndex : 'registerNo',
          width: 120,
        },{
            title : '规格',
            dataIndex : 'spec',
            width: 120,
        },{
          title : '型号',
          dataIndex : 'fmodel',
          width: 120,
        },{
            title : '单位',
            dataIndex : 'purchaseUnit',
            width: 120,
        },
        {
          title : '采购价',
          dataIndex: 'purchasePrice',
          width:120,
          render:text=>text?text.toFixed(2):""
        },{
          title : '供应商',
          dataIndex : 'fOrgName',
          width: 200
        }
      ]
      const { getFieldDecorator } = this.props.form;
      const { manageSelect , visible , tableRows , modalSelectedRowKeys , actionKey} = this.state;
      return(
        <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
          <Form>
            <FormItem {...inline} label={'管理部门'}>
                {getFieldDecorator('bDeptId',{
                    initialValue: ""
                })(
                    <Select
                        showSearch
                        placeholder={'请选择'}
                        optionFilterProp="children"
                        onChange={()=>this.changeManage()}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option value="" key={-1}>全部</Option>
                        {
                            manageSelect.map((item,index) => {
                            return <Option key={index} value={item.value}>{item.text}</Option>
                            })
                        }
                    </Select>
                )}
            </FormItem>
          </Form>
          <Row>
              <Button type="primary" style={{marginLeft:16,marginRight:16}} onClick={()=>this.openModal()}>选择产品</Button>
              <Button onClick={this.deleteRow}>删除</Button>
          </Row>
          <Table rowKey="importDetailGuid" columns={columns} dataSource={tableRows}  scroll={{x: '150%'}} style={{marginTop:24}}
          rowSelection={{
            selectedRowKeys:actionKey,
            onChange:(actionKey)=>{
              this.setState({actionKey})
            }
          }}></Table>
          <Row>
              <Col span={4}>退货数量：{tableRows.length? tableRows.length:'0'}</Col>
              <Col span={4}>退货金额：{this.getTotal()}</Col>
          </Row>
          <Row style={{textAlign:'center'}}>
              <Button type="primary" onClick={()=>this.onSubmit()}>确定</Button>
          </Row>
          <Modal
            closable={false}
            width={980}
            visible={visible}
            destroyOnClose={true}
            title='添加产品'
            onOk={()=>this.getModalData()}
            onCancel={()=>this.closeModal()}
            >
              <SearchFormWapper ref='modalForm' query={(val)=>this.searchTable(val)}></SearchFormWapper>
              <Alert
                description="发票已审核产品不可退货"
                type="error"
                closable
              />
              <RemoteTable
                  url={storage.selectOutImportDetail}
                  ref='modalTable'
                  query={this.state.query}
                  scroll={{x: '180%', y : document.body.clientHeight - 110 }}
                  columns={modalColumns}
                  rowKey={'importDetailGuid'}
                  showHeader={true}
                  style={{marginTop: 10}}
                  size="small"
                  rowSelection={{
                    selectedRowKeys:modalSelectedRowKeys,
                    onChange:(modalSelectedRowKeys,modalSelectedRows)=>{
                      this.setState({modalSelectedRowKeys,modalSelectedRows})
                    }
                  }}
                  callback={(data)=>{
                    this.setState({
                      modalDtSource:data.result.rows
                    })
                  }}
                >
              </RemoteTable>
          </Modal>
        </Content>
      )
  }
}

export default Form.create()(WareHouseRefund);