/*
 * @Author: yuwei  - 招标详情/合同
 * @Date: 2018-07-11 15:42:36 
* @Last Modified time: 2018-07-11 15:42:36 
 */
import React, { Component } from 'react';
import { Row,Col,Input,Button,message,Form,Modal,Card} from 'antd';
import TableGrid from '../../../component/tableGrid';
import ledger from '../../../api/ledger';
import request from '../../../utils/request';
import queryString from 'querystring';
import { FTP} from '../../../api/local';
import PicWall from '../../../component/picWall';
import { contractStatus } from '../../../constants';
const FormItem = Form.Item;
const Search = Input.Search;
const { RemoteTable } = TableGrid;
const Confirm = Modal.confirm;
const style = {
  mb:{
    marginBottom:16
  },
  reference:{
    position:'relative'
  },
  affix:{
    textAlign:'right',
    position:'absolute',
    right:24,
    top:66
  }
}

class SearchForm extends Component {
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.query(values);
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form  onSubmit={this.handleSearch}>
          <Col span={6} style={{textAlign:'right',marginTop: '-3px'}}> 
              <FormItem>
                {getFieldDecorator('searchName',{
                  initialValue:""
                })(
                  <Input placeholder="请输入合同名称/编号" style={{width:180,marginRight:8,}}/>
                )}
              </FormItem>
          </Col>
          <Button type="primary" htmlType="submit">搜索</Button>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);


class ContractList extends Component {
  state={
    query:{tenderGuid:this.props.tenderGuid},
    detailVisible:false,//合同详情的弹出层
    visible:false,//选择合同的弹出层
    modalInput:"",//弹窗的搜索条件
    modalQuery:{
      bDeptId:this.props.mainFillBack.bDeptId
    },//弹窗搜索条件
    modalSelectedRowKeys:[],//选择申请-弹窗 选中内容
  }
  searchTable = (val) => {
    let query = Object.assign(val,{tenderGuid:this.props.tenderGuid})
    this.refs.table.fetch(query)
  }
  //删除合同
  deleteRow = (record) =>{
    Confirm({
      content:'确定要删除该合同吗？',
      onOk:()=>{
        request(ledger.deleteZCTenderDetail,{
          body:queryString.stringify({tenderDetailGuid:record.tenderDetailGuid}),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: data => {
            if(data.status){
              let query = Object.assign(this.refs.form.getFieldsValue(),{tenderGuid:this.props.tenderGuid})
              this.refs.table.fetch(query)
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      },
      onCancel:()=>{
        
      }
    })
  }
  //详情弹窗
  openDetailModal = (record) =>{
    this.setState({
      detailVisible:true,
      baseInfo:record
    })
  }
  //弹窗 - 确定
  getModalData = ()=>{
    console.log('添加申请明细',JSON.stringify({tenderGuid:this.props.tenderGuid,contractId:this.state.modalSelectedRowKeys}))
    request(ledger.insertZCTenderDetail,{
      body:queryString.stringify({
        tenderGuid:this.props.tenderGuid,
        contractId:this.state.modalSelectedRowKeys}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.refs.table.fetch({tenderGuid:this.props.tenderGuid});
          this.setState({visible:false,modalInput:"",modalSelectedRowKeys:[]})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  //弹窗 - 关闭
  closeModal = () =>{
    this.setState({modalSelectedRowKeys:[],visible:false,selectedRowKeys:[],modalInput:""})
  }
  //弹窗-搜索
  searchModalTable = (val) =>{
    console.log(val)
    this.refs.modalTable.fetch({
      searchName:val,
      bDeptId:this.props.mainFillBack.bDeptId,
      fOrgId:this.props.mainFillBack.fOrgId,
      fstate:"01",
      module:"tender"
    })
  }

  getFileList = () => {
    const data = this.state.baseInfo;
    const fileList = [];
    if (data && data.tfAccessory) {
      data.tfAccessory.split(';').map((item, index) => fileList.push({
        uid: index + 1,
        url: `${FTP}${item}`
      }))
      fileList.pop();
    }
    return fileList;
  }

  render() {
    const modalColums = [
      {
        title:"状态",
        dataIndex:"fstate",
        width:100,
        render:(text)=>text?contractStatus[text]:""
      },
      {
        title:"合同名称",
        dataIndex:"contractName",
        width:100,
        render:(text,record)=>(
          <a onClick={()=>this.openDetailModal(record)}>{text}</a>
        )
      },
      {
        title:"合同编号",
        dataIndex:"contractNo",
        width:100
      },
      {
        title:"供应商名称",
        dataIndex:"fOrgName",
        width:100
      },
      {
        title:"管理科室",
        dataIndex:"bDeptName",
        width:100
      },
      {
        title:"最后编辑时间",
        dataIndex:"modifiyTime",
        width:100,
        render:(text)=>text?text.substr(0,11):""
      }
    ]
    const columns = [
      {
        title:'状态',
        dataIndex:'fstate',
        width:80,
        render:(text)=>contractStatus[text]
      },
      {
        title: '合同名称',
        dataIndex: 'contractName',
        width:120,
        render:(text,record)=>(
          <a onClick={()=>this.openDetailModal(record)}>{text}</a>
        )
      },
      {
        title: '合同编号',
        dataIndex: 'contractNo',
        width:100
      },
      {
        title: '供应商名称',
        dataIndex: 'fOrgName',
        width:100,
      },
      {
        title: '管理科室',
        dataIndex: 'bDeptName',
        width:150
      },
      {
        title: '最后编辑时间',
        dataIndex: 'modifiyTime',
        width:100,
        render:(text)=>text?text.substr(0,11):""
      },
      {
        title: '操作',
        dataIndex: 'actions',
        width:50,
        render:(text,record)=>(
          <a onClick={()=>this.deleteRow(record)}>删除</a>
        )
      },
    ];
    const { visible , detailVisible , baseInfo , modalSelectedRowKeys} = this.state;
    const modalHeader = (
      <Row>
        <Col span={12}>选择采购合同</Col>
        <Col span={12} style={{textAlign:'right'}}>
          <Button type='primary' style={{marginRight:15}}  onClick={()=>this.getModalData()}>确定</Button>
          <Button type='primary' onClick={()=>this.closeModal()}>取消</Button>
        </Col>
      </Row>
    )
    return (
      <Card title="采购合同">
        <Row>
            <Col span={16}>
            {
              this.props.mainFillBack.releaseFlag!=="01"?
              <Button type='primary' onClick={()=>this.setState({visible:true})}>选择合同</Button>
              :null
            }
            </Col>
            <SearchFormWapper query={(val)=>this.searchTable(val)} ref='form'></SearchFormWapper>
        </Row>
        <RemoteTable
            ref='table'
            query={this.state.query}
            url={ledger.selectZCTenderContractList}
            scroll={{x: '100%', y : document.body.clientHeight - 311}}
            columns={columns}
            showHeader={true}
            rowKey={'tenderDetailGuid'}
            style={{paddingTop:12}}
            size="small"
          /> 
          <Modal
           visible={visible}
           width={980}
           closable={false}
           title={modalHeader}
           footer={null}>
            <Search placeholder='请输入合同名称/编号/供应商' onInput={(e)=>this.setState({modalInput:e.target.values})}  onSearch={(val)=>{this.searchModalTable(val)}} style={{width:250}}/>
              <RemoteTable
                ref='modalTable'
                query={{bDeptId:this.props.mainFillBack.bDeptId,fOrgId:this.props.mainFillBack.fOrgId,fstate:"01",module:"tender"}}
                url={ledger.queryContractList}
                scroll={{x: '100%', y : document.body.clientHeight - 311}}
                columns={modalColums}
                showHeader={true}
                rowKey={'contractId'}
                style={{paddingTop:12}}
                size="small"
                rowSelection={{
                  modalSelectedRowKeys,
                  onChange:(modalSelectedRowKeys)=>{
                    this.setState({modalSelectedRowKeys})
                  }
                }}
              /> 
          </Modal>

          <Modal
           visible={detailVisible}
           width={980}
           title={`合同名称`}
           onCancel={()=>this.setState({detailVisible:false})}
           footer={null}>
            <div style={{padding:'0 24px'}}>
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-8">甲方名称 : {baseInfo ? baseInfo.rOrgName: ""}</div>
                <div className="ant-col-8">乙方名称 : {baseInfo ? baseInfo.fOrgName:""}</div>
              </div>
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-8">合同编号 : {baseInfo ?baseInfo.contractNo: ""}</div>
                <div className="ant-col-8">创建时间 : {baseInfo ?baseInfo.createTime: ""}</div>
              </div>
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-8">管理科室 : {baseInfo ?baseInfo.bDeptName: ""}</div>
                <div className="ant-col-8">合同类型 : {"设备"}</div>
              </div>
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-8">状态 : {baseInfo ?contractStatus[baseInfo.fstate]: ""}</div>
               {/* <div className="ant-col-8">总金额 : {baseInfo ?baseInfo.totalPrice?baseInfo.totalPrice.toFixed(2): "":""}</div>*/}
              </div>
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-8">附件 : 
                  <PicWall isAdd={false} fileList={this.getFileList()}/>
                </div>
              </div>
            </div>
          </Modal>
      </Card>
    )
  }
}
export default ContractList;