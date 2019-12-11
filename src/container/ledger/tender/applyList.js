/*
 * @Author: yuwei - 招标详情/申请
 * @Date: 2018-07-12 10:21:08 
* @Last Modified time: 2018-07-12 10:21:08 
 */
import React, { Component } from 'react';
import { Row,Col,Input,Button,message,Form,Modal,Card} from 'antd';
import TableGrid from '../../../component/tableGrid';
import ledger from '../../../api/ledger';
import request from '../../../utils/request';
import queryString from 'querystring';
import { equipProcurementStatus , fundsSourceStatus} from '../../../constants';
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
  state={
    manageSelect:[],
  }
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
                  <Input placeholder="申请单号/产品名称/申请科室" style={{width:220,marginRight:8,}}/>
                )}
              </FormItem>
          </Col>
          <Button type="primary" htmlType="submit">搜索</Button>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);


class ApplyList extends Component {
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
      content:'确定要删除该申请吗？',
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
      onCancel:()=>{}
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
    console.log('添加申请明细',JSON.stringify({tenderGuid:this.props.tenderGuid,applyId:this.state.modalSelectedRowKeys}))
    request(ledger.insertZCTenderDetail,{
      body:queryString.stringify({
        tenderGuid:this.props.tenderGuid,
        applyId:this.state.modalSelectedRowKeys}),
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
    this.setState({selectedRowKeys:[],modalInput:"",modalSelectedRowKeys:[],visible:false})
  }
  //弹窗-搜索
  searchModalTable = (val) =>{
    console.log(val)
    this.refs.modalTable.fetch({searchName:val,bDeptId:this.props.mainFillBack.bDeptId,fstate:"20",module:"tender"})
  }
  render() {
    const modalColums = [
      {
        title:"状态",
        dataIndex:"fstate",
        width:100,
        render:(text)=>text?equipProcurementStatus[text]:""
      },
      {
        title:"申请单号",
        dataIndex:"applyNo",
        width:100,
        render:(text,record)=>(
          <a onClick={()=>this.openDetailModal(record)}>{text}</a>
        )
      },
      {
        title:"管理科室",
        dataIndex:"bDeptName",
        width:100
      },
      {
        title:"申请科室",
        dataIndex:"deptName",
        width:100
      },
      {
        title:"申请时间",
        dataIndex:"createTime",
        width:100,
        render:(text)=>text?text.substr(0,11):''
      }
    ]
    const columns = [
      {
        title:"状态",
        dataIndex:"fstate",
        width:100,
        render:(text)=>text?equipProcurementStatus[text]:""
      },
      {
        title:"申请单号",
        dataIndex:"applyNo",
        width:100,
        render:(text,record)=>(
          <a onClick={()=>this.openDetailModal(record)}>{text}</a>
        )
      },
      {
        title:"管理科室",
        dataIndex:"bDeptName",
        width:100
      },
      {
        title:"申请科室",
        dataIndex:"deptName",
        width:100
      },
      {
        title:"申请时间",
        dataIndex:"createTime",
        width:100,
        render:(text)=>text?text.substr(0,11):''
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
    // const { mainFillBack } = this.props;
    const modalHeader = (
      <Row>
        <Col span={12}>选择新品申请</Col>
        <Col span={12} style={{textAlign:'right'}}>
          <Button type='primary' style={{marginRight:15}}  onClick={()=>this.getModalData()}>确定</Button>
          <Button type='primary' onClick={()=>this.closeModal()}>取消</Button>
        </Col>
      </Row>
    )
    return (
      <Card title="新品申请">
        <Row>
            <Col span={16}>
              {
                this.props.mainFillBack.releaseFlag!=="01"?
                <Button type='primary' onClick={()=>this.setState({visible:true})}>选择申请</Button>
                :null
              }
            </Col>
            <SearchFormWapper query={(val)=>this.searchTable(val)} ref='form'></SearchFormWapper>
        </Row>
        <RemoteTable
            ref='table'
            query={this.state.query}
            url={ledger.selectZCTenderApplyList}
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
            <Search placeholder='请输入产品名称/申请单号' onInput={(e)=>this.setState({modalInput:e.target.values})}  onSearch={(val)=>{this.searchModalTable(val)}} style={{width:250}}/>
            <RemoteTable
                ref='modalTable'
                query={{bDeptId:this.props.mainFillBack.bDeptId,fstate:"20",module:"tender"}}
                url={ledger.queryApplyZcList}
                scroll={{x: '100%', y : document.body.clientHeight - 311}}
                columns={modalColums}
                showHeader={true}
                rowKey={'applyId'}
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
           title={`申请详情`}
           onCancel={()=>this.setState({detailVisible:false})}
           footer={null}>
           <div style={{padding:'0 24px'}}>
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-12">申请单号 : {baseInfo?baseInfo.applyNo:""}</div>
                <div className="ant-col-12">申请时间 : {baseInfo?baseInfo.createTime?baseInfo.createTime.substr(0,11):"":""}</div>
              </div>
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-12">申请科室 : {baseInfo?baseInfo.deptName:""}</div>
                <div className="ant-col-12">申请人 : {baseInfo?baseInfo.applyUserId:""}</div>
              </div>
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-12">管理科室 : {baseInfo?baseInfo.bDeptName:""}</div>
                <div className="ant-col-12">经费来源 : {baseInfo?fundsSourceStatus[baseInfo.fundsSource]:""}</div>
              </div>
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-12">单位 : {baseInfo?baseInfo.purchaseName:""}</div>
              </div>
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-12">申购数量 : {baseInfo?baseInfo.amount:""}</div>
                <div className="ant-col-12">预算金额 :  {baseInfo?baseInfo.totalBudgetPrice?Number(baseInfo.totalBudgetPrice).toFixed(2):"":""}</div>
              </div>
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-12">预算单价 : {baseInfo?baseInfo.budgetPrice?Number(baseInfo.budgetPrice).toFixed(2):"":""}</div>
              </div>
              {
                baseInfo && baseInfo.detaliList ?
                baseInfo.detaliList.map((item,index)=>(
                  <div key={index} style={{padding:'10px 0'}}>
                    <div className="ant-row" style={style.mb}>
                      <div className="ant-col-12">推荐产品 : {item.materialName}</div>
                    </div>
                    <div className="ant-row" style={style.mb}>
                      <div className="ant-col-12">推荐型号 : {item.recommendFmodel}</div>
                    </div>
                    <div className="ant-row" style={style.mb}>
                      <div className="ant-col-12">预算单价 : {Number(item.budgetPrice)?Number(item.budgetPrice).toFixed(2):''}</div>
                    </div>
                    <div className="ant-row" style={style.mb}>
                      <div className="ant-col-12">推荐厂商 : {item.recommendProduct}</div>
                    </div>
                  </div>
                ))
                :null
              }
              <div className="ant-row" style={style.mb}>
                <div className="ant-col-12">推荐厂商 : {baseInfo?baseInfo.recommendProduct:""}</div>
              </div>
            </div>
          </Modal>
      </Card>
    )
  }
}
export default ApplyList;