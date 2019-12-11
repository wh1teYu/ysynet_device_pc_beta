/**保养登记--列表*/
import React from 'react';
import { Row,Col, Input,Layout , Button,message} from 'antd';
import basicdata from '../../../api/basicdata';
import TableGrid from '../../../component/tableGrid';
import request from '../../../utils/request';
const Search = Input.Search;
const { Content } = Layout;
const { RemoteTable } = TableGrid;
const url = basicdata.queryEquipmentTmp;

class MaintainTmpTransfer extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      query:'',
      selectedKeys:'',
      selectedRowKeys:[],
      disabled:false,
      tableLeftQuery:{
        'isChoose':false,
        'maintainTemplateId':this.props.selectedKeys
      },
      tableRightQuery:{
        'isChoose':true,
        'maintainTemplateId':this.props.selectedKeys
      }
    }
  }
  componentWillMount =()=>{
    this.setState({
      selectedKeys:this.props.selectedKeys,
    })
  }
  
  componentWillReceiveProps =(nextProps)=>{
    if(nextProps.selectedKeys&&nextProps.selectedKeys.length!==0){
      this.setState({
        disabled:false
      })
    }else{
      this.setState({
        disabled:true
      })
    }
    let Key ='';
    if(nextProps.editModalData && nextProps.editModalData.parentKey){
      Key=nextProps.editModalData.parentKey
      this.setState({
        selectedKeys:nextProps.editModalData.parentKey,
      })
    }else{
      Key=nextProps.selectedKeys
      this.setState({
        selectedKeys:nextProps.selectedKeys,
      })
    }
    
    this.queryHandlerLeft('',Key);
    this.queryHandlerRight('',Key);
  }
  refreshAll = ()=>{
    this.queryHandlerLeft('',this.state.selectedKeys);
    this.queryHandlerRight('',this.state.selectedKeys);
  }
  //查询左侧的内容
  queryHandlerLeft=(value,selectedKeys)=>{
    let queryInfo ={
      'isChoose':false,
      'maintainTemplateId':selectedKeys||'',
      'equipmentName':value
    }
    this.refs.tableLeft.fetch(queryInfo)
  }
  //查询右侧的内容
  queryHandlerRight=(value,selectedKeys)=>{
    let queryInfo ={
      'isChoose':true,
      'maintainTemplateId':selectedKeys||'',
      'equipmentName':value
    }
    this.refs.tableRight.fetch(queryInfo)
  }
  changeTmp =(status)=>{
    let json ={
      fstate:status,
      maintainTemplateId:this.state.selectedKeys[0],
      equipmentList:this.state.selectedRowKeys,//要移动的每个Cod数组
    }
    let options = {
      body:JSON.stringify(json),
      success: data => {
        if(data.status){
          setTimeout(() => {
            message.success('修改成功')
            this.refreshAll();
          }, 1000);
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    }
    request(basicdata.editEEquipmentTmp,options)
  }
  render(){
    const { disabled ,tableLeftQuery ,tableRightQuery}  = this.state;
    const columnsLeft=[
      {
        dataIndex: 'equipmentName', 
        key: 'equipmentName', 
        title:'设备名称',
        width:'40%'
      },
      {
        dataIndex: 'spec', 
        key: 'spec', 
        title:'设备规格',
        width:'20%'
      },
      {
        dataIndex: 'fmodel', 
        key: 'fmodel', 
        title:'设备型号',
        width:'20%'
      },
      {
        dataIndex: 'registerNo', 
        key: 'registerNo', 
        title:'注册证号',
        width:'20%'
      },

    ]
    const columnsRight=[
      {
        dataIndex: 'equipmentName', 
        key: 'equipmentName', 
        title:'设备名称',
        width:'40%'
      },
      {
        dataIndex: 'spec', 
        key: 'spec', 
        title:'设备规格',
        width:'20%'
      },
      {
        dataIndex: 'fmodel', 
        key: 'fmodel', 
        title:'设备型号',
        width:'20%'
      },
      {
        dataIndex: 'registerNo', 
        key: 'registerNo', 
        title:'注册证号',
        width:'20%'
      },
    ]
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys:selectedRowKeys 
        })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return(
        <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
          <Row>

            <Col span={11} style={{border:'1px solid #d9d9d9',padding:15,borderRadius:5}}>
              <Search
                  placeholder=""
                  onSearch={value =>  {this.queryHandlerLeft(value)}}
                  size="small"
              />
              {/*title="未选设备"*/}
              <RemoteTable
                title={() => '未选设备'}
                url={url}
                ref='tableLeft'
                rowSelection={rowSelection}
                query={tableLeftQuery}
                scroll={{x: '100%', y : document.body.clientHeight - 110 }}
                columns={columnsLeft}
                rowKey={'equipmentCode'}
                showHeader={true}
                style={{marginTop: 10}}
                size="small"
                onChange={this.handleChange}>
              </RemoteTable>
            </Col>
            <Col span={2} >
              <div style={{textAlign:'center',paddingTop:250}}>
                <Button type='primary'  disabled={disabled} style={{marginBottom:10}}  icon="left" onClick={(status)=>this.changeTmp('01')}></Button><br/>
                <Button type='primary' icon="right" disabled={disabled} onClick={(status)=>this.changeTmp('00')}></Button>
              </div>
            </Col>
            <Col span={11} style={{border:'1px solid #d9d9d9',padding:15,borderRadius:5}}>
              <Search
                  placeholder=""
                  onSearch={value =>  {this.queryHandlerRight(value)}}
                  size="small"
              />
              {/*title=""*/}
              <RemoteTable
                title={() => '已选设备'}
                url={url}
                ref='tableRight'
                rowSelection={rowSelection}
                query={tableRightQuery}
                scroll={{x: '100%', y : document.body.clientHeight - 110 }}
                columns={columnsRight}
                rowKey={'equipmentCode'}
                showHeader={true}
                style={{marginTop: 10}}
                size="small"
                onChange={this.handleChange}>
              </RemoteTable>
            </Col>
          </Row>

        </Content>
    )
  }
}

export default MaintainTmpTransfer;