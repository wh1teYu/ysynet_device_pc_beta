/*
 * @Author: yuwei  设备采购申请详情
 * @Date: 2018-07-11 11:35:38 
* @Last Modified time: 2018-07-11 11:35:38 
 */
import React, { Component } from 'react';
import { Layout,Button , Tag , Row , message , Modal , Form , Select } from 'antd';
import { Link } from 'react-router-dom';
import styleCss  from './styles.css';
import request from '../../../utils/request';
import queryString from 'querystring';
import deptwork from '../../../api/deptwork';
import { fundsSourceStatus , approvalOpinionStatus } from '../../../constants';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const style = {
  mb:{
    marginBottom:16
  },
}
class EquipProcurementDetails extends Component {
  state={
    query:{},
    baseInfo:{},
    manageSelect:[],
    outDeptOptions: [],
    userList:[],//当前机构所有用户 - 审批人
    params:this.props.match.params.id,
    visible:false,
    userName:"",//指定人姓名
    validInfo:"",
    showPrintSelect:false,//打印选择下拉框
    printList:[],
    printId:null
  }
  componentDidMount(){
    console.log(this.props.match.params.id)
    request(deptwork.queryApplyZc,{
      body:JSON.stringify({applyId:this.props.match.params.id}),
      headers: {
        'Content-Type': 'application/json'
      },
      success: data => {
        if(data.status){
          this.setState({baseInfo:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
    request(deptwork.queryUserListByOrgId,{
      body:queryString.stringify({}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({
            userList:data.result
          })
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })

    request(deptwork.selectApplyDetailComboBox,{
      body:queryString.stringify({ applyId:this.props.match.params.id}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({
            printList:data.result
          })
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  filterButtonOption = () =>{
    const { baseInfo , params } = this.state;
    const {fstate} = baseInfo;
    if(fstate==="20"||fstate==="10"||fstate==="90"){//审批通过d
      return (
        <span style={{float:'right'}}>
          <Button type='primary' onClick={()=>this.setState({showPrintSelect:true})}>选择打印</Button>
        </span>
      )
    }else if(fstate==="80"){//审批不通过
      return (
        <span>
          <Tag color="#F5222D">审批不通过</Tag>
          <Button style={{float:'right'}} onClick={()=>this.onInvalid()} >作废</Button>
          <Button style={{float:'right'}}>
            <Link to={{pathname:`/deptWork/equipProcurement/add/${params}`}}>编辑</Link>
          </Button>
          <Button type='primary' style={{float:'right',marginRight:8}} onClick={()=>this.validNext()}>提交</Button>
        </span>
      )
    }else{
      return (
        <span>
          <Button style={{float:'right'}}><Link to={{pathname:`/deptWork/equipProcurement/add/${params}`}}>编辑</Link></Button>
          <Button type='primary' style={{float:'right',marginRight:8}}  onClick={()=>this.validNext()}>提交</Button>
        </span>
      )
    }
  }
  //审批不通过 - 作废
  onInvalid = () =>{
    let values = this.state.baseInfo;
    values.fstate='90';
    confirm({
      content:"确定执行作废操作吗？",
      onOk:()=>{
        request(deptwork.updateApplyZc,{
          body:JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json'
          },
          success: data => {
            if(data.status){
              message.warn('提交成功！');
              const {history} = this.props;
              history.push('/deptWork/equipProcurement')
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
  validNext = () =>{
    console.log(this.state.baseInfo)
    request(deptwork.checkApproval,{
      body:queryString.stringify({bDeptId:this.state.baseInfo.bDeptGuid}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.result.trim()!==""){
          this.setState({
            visible:data.result.trim()!=="",
            validInfo:data.result
          })
        }else{
          this.onSubmit(true)
        }
      },
      error: err => {console.log(err)}
    })
  }
  //提交
  onSubmit = (bool) => {
    if(bool){
      let values = this.state.baseInfo;
      console.log(JSON.stringify(values))
      delete values.detaliList;//删除产品数据
      values.fstate="10";
      this.sendAjax(values);
    }else{
      this.props.form.validateFieldsAndScroll((err,value)=>{
        if(!err){
          let values = Object.assign(this.state.baseInfo,value);
          console.log(JSON.stringify(values))
          delete values.detaliList;//删除产品数据
          values.fstate="10";
          values.userName=this.state.userName;
          this.sendAjax(values)
        }
      })
    }
  }
  sendAjax = (json)=>{
    request(deptwork.updateApplyZc,{
      body:JSON.stringify(json),
      headers: {
        'Content-Type': 'application/json'
      },
      success: data => {
        if(data.status){
          message.success('提交成功！');
          const {history} = this.props;
          history.push('/deptWork/equipProcurement')
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  //打印详情页面
  printDetail = ()=>{
    console.log('print')
    const { printId } = this.state;
    window.open(`${deptwork.printApplyZc}?applyDetailId=${printId}`)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { baseInfo , userList , visible , validInfo } = this.state;
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <h3 style={{padding:'24px'}}>新设备采购申请单  
          {
            this.filterButtonOption()
          }
        </h3>
        <div style={{padding:'0 24px'}}>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">申请单号 : {baseInfo?baseInfo.applyNo:""}</div>
            <div className="ant-col-12">申请时间 : {baseInfo.createTime?baseInfo.createTime.substr(0,11):""}</div>
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
            {/* <div className="ant-col-12">产品名称 :  {baseInfo?baseInfo.materialName:""}</div> */}
            <div className="ant-col-12">单位 : {baseInfo?baseInfo.purchaseName || baseInfo.purchaseUnit:""}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">申购数量 : {baseInfo?baseInfo.amount:""}</div>
            <div className="ant-col-12">预算金额 :  {baseInfo?Number(baseInfo.totalBudgetPrice).toFixed(2):""}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">预算单价 : {baseInfo?Number(baseInfo.budgetPrice).toFixed(2):""}</div>
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
        </div>
          {//fstate  只有通过状态或不通过状态显示一下内容 (baseInfo.fstate==="20" ||  baseInfo.fstate==="80") 
            baseInfo.commentList?
              <Row>
                <hr className={styleCss.hr}/>
                <h3 style={{padding:'0 24px'}}>审批意见</h3>
                <ul>
                {
                  baseInfo.commentList?
                  baseInfo.commentList.map((item,index)=>(
                    <li className={styleCss.li} key={index}>
                        <h4>
                          {item.userName} <Tag color={item.fstate==="01"?"#52C41A":"#F5222D"}>{approvalOpinionStatus[item.fstate]}</Tag>
                          <small  className={styleCss.colorFont+ ' '+styleCss.fr}>{item.approvalTime}</small>
                        </h4>
                        <p className={styleCss.colorFont}>{item.reason}</p>
                    </li>
                  )):''
                }
                </ul>
              </Row>
            :null
          }
          <Modal
          visible={visible}
          title='选择审批人'
          maskClosable={false}
          onOk={()=>this.onSubmit()}
          onCancel={()=>this.setState({visible:false})}>
            <Form>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                  <label>审批步骤</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14" style={{marginTop:9}}>
                  {validInfo}
                </div>
              </div>
              <FormItem
                {...formItemLayout}
                label="指定审批人"
              >
                {getFieldDecorator('userId', {
                  rules: [{
                    required: true, message: '请选择指定审批人',
                  }],
                })(
                  <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  onSelect={(input,option)=>this.setState({userName:option.props.children})}
                  >
                    <Option value="" key={-1}>全部</Option>
                    {
                        userList.map((item,index) => {
                        return <Option key={index} value={item.userId}>{item.userName}</Option>
                        })
                    }
                  </Select>
                )}
              </FormItem>
            </Form>
        </Modal>
      
          <Modal title='选择打印' visible={this.state.showPrintSelect} onCancel={()=>this.setState({showPrintSelect:false})}
          onOk={this.printDetail}>
            {
              this.state.showPrintSelect &&
              <FormItem label='打印申请单' {...formItemLayout}>
                <Select onSelect={(value)=>this.setState({printId:value})} style={{width:200}}>
                  {
                    this.state.printList&& 
                    this.state.printList.map((item,index)=>(
                      <Option key={index} value={item.applyDetailId}>{item.materialName}{item.recommendFmodel?`-${item.recommendFmodel}`:null}</Option>
                    ))
                  }
                </Select>
              </FormItem>
            }
          </Modal>
      </Content>
    )
  }
}
export default Form.create()(EquipProcurementDetails);