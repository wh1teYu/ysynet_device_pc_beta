/*
 * @Author: yuwei - 领用 (出库)-receive 
 * @Date: 2018-06-12 18:34:31 
* @Last Modified time: 2018-06-12 18:34:31 
 */

import React , { Component } from 'react';
import { Layout , Form, Row, Col, Input, Button,Select ,Table ,Modal,message} from 'antd';
import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
import request from '../../../utils/request';
import { Link } from 'react-router-dom';
import queryString from 'querystring';
import _ from 'lodash';
const { Content } = Layout;
const { RemoteTable } = TableGrid;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const modalformItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const styles = {
  textRight:{
    textAlign:'right'
  },
  fillRight:{
    marginRight:8
  },
  top:{
    marginTop:3
  }
}
class SearchForm extends Component {
  state={
    manageSelect:[],
    outDeptOptions: [],
    adressOptions:[]
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
    request(storage.selectUseDeptList,{
      body:queryString.stringify({deptType:"00"}),
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
  //根据科室id获取
  getAdress = (val) => {
    
    this.props.form.resetFields('addressGuid')
    request(storage.getAdress,{
      body:queryString.stringify({deptId:val}),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.props.setAdressOptions(data.result);
          this.setState({adressOptions:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  fetchSelect=(input)=>{
    request(storage.selectUseDeptList,{
      body:queryString.stringify({deptType:"01",deptName:input}),
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

  fetchUseSelect=(input)=>{
    request(storage.selectUseDeptList,{
      body:queryString.stringify({deptType:"00",deptName:input}),
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
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form  onSubmit={this.handleSearch}>
        <Row>
          <Col span={6} key={1}>
              <FormItem {...formItemLayout} label={'管理部门'}>
                  {getFieldDecorator('manageDeptGuid',{
                      initialValue: ""
                  })(
                    <Select  
                    onSearch={this.fetchSelect}
                    showSearch
                    placeholder={'请选择'}
                    filterOption={false}
                        // showSearch
                        // placeholder={'请选择'}
                        // optionFilterProp="children"
                        // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
          <Col span={6} key={2}>
              <FormItem {...formItemLayout} label={'出库科室'}>
                  {getFieldDecorator('outDeptGuid',{
                      initialValue: ""
                  })(
                    <Select 
                        onSearch={this.fetchUseSelect}
                        showSearch
                        placeholder={'请选择'}
                        filterOption={false}
                        // showSearch
                        // placeholder={'请选择'}
                        // optionFilterProp="children"
                        // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onSelect={(val)=>this.getAdress(val)}
                      >
                      <Option value="" key={-1}>全部</Option>
                      {
                          this.state.outDeptOptions.map((item,index) => {
                          return <Option key={index} value={item.value}>{item.text}</Option>
                          })
                      }
                  </Select>
                  )}
              </FormItem>
          </Col>
          <Col span={6} key={3}>
              <FormItem {...formItemLayout} label={'出库地址'}>
                {getFieldDecorator('addressGuid',{
                    initialValue: ""
                })(
                    <Select placeholder={'请选择出库地址'}>
                        {
                          this.state.adressOptions.map((item,index) => {
                          return <Option key={index} value={item.addrGuid}>{item.address}</Option>
                          })
                      }
                    </Select>
                )}
              </FormItem>
          </Col>
          <Col span={6} key={5} style={{textAlign:'right'}}>
            <Button type='primary'  style={styles.fillRight}  onClick={()=>this.props.submit()}>确认出库</Button>
            <Button type='primary' ><Link to={{pathname:`/storage/wareHouseMgt`}}>取消</Link></Button>
          </Col>
        </Row>
        <Row>
          <Col span={6} key={4}>
              <FormItem {...formItemLayout} label={'领用人'}>
                  {getFieldDecorator('receiver')(
                      <Input placeholder="请输入领用人" />
                  )}
              </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchBox = Form.create()(SearchForm);


const columns=[{
      title:'产品名称',
      dataIndex: 'materialName',
  },{
    title:'品牌',
    dataIndex: 'brand',
  },{
      title : '证件号',
      dataIndex : 'registerNo',
  },{
      title : '规格',
      dataIndex : 'spec',
  },{
    title : '型号',
    dataIndex : 'fmodel',
  },{
      title : '单位',
      dataIndex : 'purchaseUnit',
  },{
    title : '采购价格',
    dataIndex : 'purchasePrice',
  },{
      title : '生产商',
      dataIndex : 'produceName',
  },
]
const modalColumns = [
  {
      title:'产品名称',
      dataIndex: 'materialName',
      width:120
  },{
    title : '型号',
    dataIndex : 'fmodel',
    width:120
  },{
    title : '规格',
    dataIndex : 'spec',
    width:120
  },{
      title : '库存数量',
      dataIndex : 'repertory',
      width:120
  },{
    title : '单价',
    dataIndex : 'purchasePrice',
    width:120
  },{
    title : '单位',
    dataIndex : 'purchaseUnit',
    width:120
},{
    title:'品牌',
    dataIndex: 'brand',
    width:120
  },{
      title : '证件号',
      dataIndex : 'registerNo',
      width:120
  },
]
class Receive extends Component {

  state = {
    visible:false,//弹出层显示
    adressOptions:[],//地址存储的数据
    dataSource:[],
    currentRow:[],//主表格中当前勾选的内容
    selectedRowKeys: [],//主表格中前勾选的key
    selectedRows:[],//主表格中前勾选的内容
    modalQuery:{},//弹窗搜索条件
    modalSelectedRows:[],//弹窗选中的keyRow
    modalSelectedRowKeys:[],//弹窗选中的key
    modalSelectedRowsCaChe:[],//弹窗选中的keyRow
    modalSelectedRowKeysCaChe:[],//弹窗选中的key
  }

 
  //删除产品
  deleteRow = () => {
    console.log(this.state.currentRow)
    if(this.state.currentRow.length>0){
      confirm({
        title:'您确定要删除该产品吗？',
        onOk:()=>{
          let dataSource  = this.state.dataSource;
          let currentRow = this.state.currentRow;
          for(let i = 0; i<currentRow.length;i++){
            dataSource = dataSource.filter(item=>{
              if (currentRow[i].importDetailGuid !==item.importDetailGuid){
                return item
              }else{
                return ''
              }
            })
          }
          this.setState({
            dataSource,
            currentRow:[],
            selectedRowKeys: [],//主表格中前勾选的key
            selectedRows:[],//主表格中前勾选的内容
            modalSelectedRowKeys:dataSource.map((item)=>{return item.importDetailGuid}),
            modalSelectedRowsCaChe:dataSource,
            modalSelectedRowKeysCaChe:dataSource.map((item)=>{return item.importDetailGuid})
          })
        }
      })
    }else{
      message.warning('请先选择要删除的产品')
    }
    
  }
  //提交
  submit = () => {
    let values = this.refs.searchBox.getFieldsValue();
    console.log(values)
    console.log(this.state.dataSource)
    let adressItem  = this.state.adressOptions.filter((item)=>{
      return item.deptGuid===values.addressGuid
    })
    let assetsRecordGuids = this.state.dataSource.map((item)=> {return item.assetsRecordGuid})
    let json = {...values,assetsRecordGuids,tfAddress: adressItem.length>0 ? adressItem[0].address:''};
    console.log('出库数据内容',JSON.stringify(json))
    request(storage.addOutportAsset,{
      body:queryString.stringify(json),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
            message.success('出库成功')
            this.refs.searchBox.resetFields();
            this.setState({
              visible:false,//弹出层显示
              adressOptions:[],//地址存储的数据
              dataSource:[],
              currentRow:[],//主表格中当前勾选的内容
              selectedRowKeys: [],//主表格中前勾选的key
              selectedRows:[],//主表格中前勾选的内容
              modalQuery:{},//弹窗搜索条件
              modalSelectedRows:[],//弹窗选中的keyRow
              modalSelectedRowKeys:[],//弹窗选中的key
              modalSelectedRowsCaChe:[],//弹窗选中的keyRow
              modalSelectedRowKeysCaChe:[],//弹窗选中的key
            })
            this._configPrint(json,data.result)
        }else{
            message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  //自动配置打印
  _configPrint = (json,data) => {
    console.log(data)
    if(data&&data.storagePrintConfig==="01"){//调用自动打印
      window.open(`${storage.outputImport}?outId=${data.outId}`)
    }
  }
  //弹窗handleOk
  handleOk = () => {
    let dataSource = (this.state.modalSelectedRowsCaChe).concat(this.state.modalSelectedRows);
    dataSource = _.unionBy(dataSource,'importDetailGuid');
    let dataSourceKeys = (this.state.modalSelectedRowKeys).concat(this.state.modalSelectedRowKeysCaChe)
    dataSourceKeys = _.uniq(dataSourceKeys)
    this.setState({
      dataSource,
      modalSelectedRowsCaChe:dataSource,
      modalSelectedRowKeysCaChe:dataSourceKeys
    })
  }

  handleCancel = () => {
    let keys = [].concat(this.state.modalSelectedRowKeysCaChe)
    let rows = [].concat(this.state.modalSelectedRowsCaChe)
    this.setState({
      modalSelectedRows:rows,
      modalSelectedRowKeys:keys,
    })
    this.setState({visible:false})
  }

  //弹窗搜索条件
  doSearch = (val) => {
    this.setState({modalQuery:val})
    this.refs.modalTable.fetch(val)
  }

  openModal = () => {
    let modalSelectedRowKeys =[];
    let a = this.state.dataSource.map((item)=>{
        modalSelectedRowKeys.push(item.importDetailGuid)
        return null
    })
    console.log(a);
    this.setState({visible:true})
  }

  render(){
    const { dataSource , visible ,selectedRowKeys, modalSelectedRowKeys} = this.state;

    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}} >
        <Row>出库信息</Row>
        <SearchBox 
        ref='searchBox'
        setAdressOptions={(options)=>this.setState({adressOptions:options})}
        submit={()=>this.submit()}/>
        <Button type='primary' onClick={()=>this.openModal()} style={{marginRight:15}}>添加产品</Button>
        <Button type='primary' onClick={()=>this.deleteRow()}>删除产品</Button>
        <Table 
          style={{marginTop:10}}
          dataSource={dataSource}
          columns={columns}
          rowKey={'importDetailGuid'}
          rowSelection={{
            selectedRowKeys:selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selectedRowKeys,selectedRows,currentRow:selectedRows})
            },
            onSelect: (record, selected, selectedRows) => {
              this.setState({currentRow:selectedRows})
            },
            onSelectAll:(selected, selectedRows, changeRows)=>{
              this.setState({currentRow:selectedRows})
            }
          }}
        />
        <Modal
          width={980}
          title="添加产品"
          visible={visible}
          onCancel={()=>this.handleCancel()}
          destroyOnClose={true}
          footer={null}>
            <ModalFormWapper 
              handleOk={()=>this.handleOk()}
              handleCancel={()=>this.handleCancel()}
              query={(val)=>this.doSearch(val)} 
              ref='modalForm'
            />
            <RemoteTable
              url={storage.queryAssetListByImport}
              ref='modalTable'
              query={this.state.modalQuery}
              scroll={{x: '150%', y : document.body.clientHeight - 110 }}
              columns={modalColumns}
              rowKey={'importDetailGuid'}
              showHeader={true}
              style={{marginTop: 10}}
              size="small"
              rowSelection={{
                selectedRowKeys:modalSelectedRowKeys,
                onChange: (modalSelectedRowKeys, modalSelectedRows) => {
                  console.log(`selectedRowKeys: ${modalSelectedRowKeys}`, 'selectedRows: ', modalSelectedRows);
                  this.setState({modalSelectedRowKeys,modalSelectedRows})
                }
              }}
            >
            </RemoteTable>
        </Modal>
      </Content>
    )
  }
}

export default Receive;

class ModalForm extends Component {

  search = () => {
    let values = this.props.form.getFieldsValue();
    console.log(values);
    this.props.query(values);
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem {...modalformItemLayout} label={'产品名称'}>
                {getFieldDecorator('materialName')(
                    <Input />
                )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...modalformItemLayout} label={'型号'}>
                {getFieldDecorator('fmodel')(
                    <Input />
                )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...modalformItemLayout} label={'规格'}>
                {getFieldDecorator('spec')(
                    <Input />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={styles.textRight}>
            <Button type='primary' onClick={()=>this.search()} style={styles.fillRight}>搜索</Button>
            <Button type='primary' onClick={()=>this.props.handleOk()} style={styles.fillRight}>添加</Button>
          </Col>
        </Row>
      </Form>  
    )
    
  }
}
const ModalFormWapper = Form.create()(ModalForm)