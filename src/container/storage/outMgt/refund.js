/*
 * @Author: yuwei  - 退库 refund
 * @Date: 2018-06-12 18:35:26 
* @Last Modified time: 2018-06-12 18:35:26 
 */
import React , { Component } from 'react';//DatePicker , 
import { Layout , Form, Row, Col, Input,Button,Select ,Table ,message,Modal } from 'antd';
// import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
import { Link } from 'react-router-dom';
import request from '../../../utils/request';
import queryString from 'querystring';
const confirm = Modal.confirm;
const { Content } = Layout;
// const { RemoteTable } = TableGrid;
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 4 },
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
    manageSelect:[]
  }
  searchData = (val) =>{
    //在此处发出请求，将回显数据传到父组件中。
    request(storage.queryOutportAssetByAssetsRecordGuid,{
      body:queryString.stringify({manageDeptGuid:this.props.form.getFieldValue('manageDeptGuid'),assetsRecord:val}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.props.setDateSource(data.result)
        }else{
            message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })

   
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
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form  onSubmit={this.handleSearch}>
        <Row>
          <Col span={8} key={1}>
              <FormItem {...formItemLayout} label={'管理部门'}>
                  {getFieldDecorator('manageDeptGuid',{
                      initialValue: this.state.manageSelect[0] ? this.state.manageSelect[0].value :''
                  })(
                    <Select  
                        disabled={this.props.disabled}
                        showSearch
                        placeholder={'请选择'}
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {
                            this.state.manageSelect.map((item,index) => {
                            return <Option key={index} value={item.value}>{item.text}</Option>
                            })
                        }
                    </Select>
                  )}
              </FormItem>
          </Col>
          <Col span={8} key={2}>
              <FormItem {...formItemLayout} label={'资产编码'}>
                  {getFieldDecorator('searchName')(
                      <Input placeholder="请扫描或输入资产编码或扫描位码" onPressEnter={(e)=>this.searchData(e.target.value)}/>
                  )}
              </FormItem>
          </Col>
          <Col span={8} key={3} style={{textAlign:'right'}}>
            <Button type='primary'  style={styles.fillRight}  onClick={()=>this.props.submit()}>确认退库</Button>
            <Button type='primary' ><Link to={{pathname:`/storage/outMgt`}}>取消</Link></Button>
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
      title : '单位',
      dataIndex : 'purchaseUnit',
  },{
    title : '采购价格',
    dataIndex : 'purchasePrice',
    render:text=>{return text.toFixed(2) }
  },{
      title : '退库数量',
      dataIndex : 'tksl',
      width: 120,
  },{
      title : '生产商',
      dataIndex : 'produceName',
  },
]
class Refund extends Component {

  state = {
    dataSource:[],
    selectedRowKeys: [],
    selectedRows:[],
  }

  //设置新增的datasource
  setDateSource = (arr) =>{
    //arr是由资产编码获取返回的数据。
    let dataSource = this.state.dataSource;
    for(let i = 0;i<dataSource.length;i++){
      if(dataSource[i].assetsRecord === arr.assetsRecord){
        message.warn('当前资产已添加')
        return 
      }
    }
    let newArr = dataSource.concat(arr);
    this.setState({dataSource:newArr})
  }
  //删除产品
  deleteRow = () => {
    console.log(this.state.selectedRowKeys)
    if(this.state.selectedRowKeys.length>0){
      confirm({
        title:'您确定要删除该产品吗？',
        onOk:()=>{
          let dataSource  = this.state.dataSource;
          let currentRow = this.state.selectedRows;
          for(let i = 0; i<currentRow.length;i++){
            dataSource = dataSource.filter(item=>{
              if (currentRow[i].assetsRecord !==item.assetsRecord){
                return item
              }else{
                return ''
              }
            })
          }
          this.setState({
            dataSource,
            selectedRowKeys: [],//主表格中前勾选的key
            selectedRows:[],//主表格中前勾选的内容
          })
        }
      })
    }else{
      message.warning('请先选择要删除的产品')
    }
  }
  //提交
  submit = () => {
    let manageDeptGuid = this.refs.form.getFieldValue('manageDeptGuid');
    let assetsRecords = this.state.dataSource.map(item => item.assetsRecord);
    request(storage.addOutportAssetOut,{
      body:queryString.stringify({manageDeptGuid,assetsRecords}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
            message.success('退库成功')
            this.refs.form.resetFields()
            this.setState({
              dataSource:[],
              selectedRowKeys: [],
              selectedRows:[],
            })
            this._configPrint({manageDeptGuid,assetsRecords},data.result)
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
      data.outIdList&&data.outIdList.map((item)=>{
        window.open(`${storage.outputImport}?outId=${item}`)
        return item
      })

    }
  }
  render(){
    const { dataSource } = this.state;
    const rowSelection = {
      selectedRowKeys:this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
         this.setState({selectedRowKeys,selectedRows})
      },
      onSelect: (record, selected, selectedRows) => {
         this.setState({selectedRows})
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.setState({selectedRows})
      },
    };

    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}} >
        <Row>
          退库信息
        </Row>
        <SearchBox setDateSource={(arr)=>this.setDateSource(arr) }
          ref='form'
          submit={()=>this.submit()}
          disabled={dataSource.length ? true:false}/>
        <Button type='primary' onClick={()=>this.deleteRow()}>删除产品</Button>
        <Table 
          style={{marginTop:10}}
          dataSource={dataSource}
          columns={columns}
          rowKey={'assetsRecord'}
          rowSelection={rowSelection}
        />
      </Content>
    )
  }
}

export default Refund;