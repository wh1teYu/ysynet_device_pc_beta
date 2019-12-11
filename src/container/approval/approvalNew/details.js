/*
 * @Author: yuwei 新品审批详情  
 * @Date: 2018-07-11 14:40:29 
* @Last Modified time: 2018-07-11 14:40:29 
 */
import React, { Component } from 'react';
import { Layout , Button , Tag , Row ,Affix , Input , message, Modal , Form , Select} from 'antd';
import styleCss  from './styles.css';
import approval from '../../../api/approval';
import request from '../../../utils/request';
import queryString from 'querystring';
import { fundsSourceStatus , approvalOpinionStatus  } from '../../../constants';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const style = {
  mb:{
    marginBottom:16
  },
}
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
class EquipProcurementDetails extends Component {
  state={
    query:{},
    userList:[],//当前机构所有用户 - 审批人
    visible:false,
    params:this.props.match.params.id,
    fillBackData:{},
    idea:'',//审批意见字段
    userName:'',//指定审批人姓名
    validInfo:""
  }
  componentWillMount(){
    console.log(this.props.match.params.id)
    request(approval.queryApprovalList,{
      body:queryString.stringify({approvalRecordDetailGuid:this.props.match.params.id}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({
            fillBackData:data.result.rows[0]
          })
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
    request(approval.queryUserListByOrgId,{
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
  }
  //审批通过 - 验证
  onValid = () => {
    const { idea } = this.state;
    console.log(idea)
    request(approval.checkNextApproval,{
      body:queryString.stringify({approvalRecordDetailGuid:this.props.match.params.id}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          if(data.result.trim()!==""){//需要审批
            this.setState({
              visible:data.result.trim()!=="",
              validInfo:data.result
            })
          }else{//不需要审批
            this.onSubmit(true);
          }
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  //审批不通过
  onInvalid = () =>{
    const { idea } = this.state;
    console.log(idea)
    let json = {
      approvalRecordDetailGuid:this.props.match.params.id,
      approvalFstate:"02",
      reason:idea
    }
    request(approval.updateApproval,{
      body:queryString.stringify(json),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          message.warn('提交成功！')
          const {history} = this.props;
          history.push('/approval/approvalNew')
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  //最终提交
  onSubmit = (bool) => {
    const { idea } = this.state;
    let json = {
      approvalRecordDetailGuid:this.props.match.params.id,
      approvalFstate:"01",
      reason:idea
    };
    if(bool){
      this.sendEndAjax(json)
    }else{
      this.props.form.validateFieldsAndScroll((err,values)=>{
        if(!err){
          json = Object.assign(json,values);
          json.userName = this.state.userName;
          this.sendEndAjax(json)
        }
      })
    }
  }

  sendEndAjax = (json) => {
    console.log('最终提交的结果数据',JSON.stringify(json))
    request(approval.updateApproval,{
      body:queryString.stringify(json),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          message.warn('提交成功！');
          const {history} = this.props;
          history.push('/approval/approvalNew')
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { fillBackData , visible , userList , validInfo} = this.state;
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
        <h3 style={{ fontWeight: 'bold' }}>审批详情</h3>
        <div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">申请单号 : {fillBackData?fillBackData.applyNo:''}</div>
            <div className="ant-col-12">申请时间 : {fillBackData?fillBackData.createTime:''}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">申请科室 : {fillBackData?fillBackData.deptName:''}</div>
            <div className="ant-col-12">申请人 : {fillBackData?fillBackData.applyUserId:''}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">管理科室 : {fillBackData?fillBackData.bDeptName:''}</div>
            <div className="ant-col-12">经费来源 : {fillBackData?fillBackData.fundsSource?fundsSourceStatus[fillBackData.fundsSource]:'':""}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            {/* <div className="ant-col-12">产品名称 :  {fillBackData?fillBackData.materialName:''}</div> */}
            <div className="ant-col-12">单位 : {fillBackData?fillBackData.purchaseName:''}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">申购数量 : {fillBackData?fillBackData.amount:''}</div>
            <div className="ant-col-12">预算金额 : {fillBackData?fillBackData.totalBudgetPrice?Number(fillBackData.totalBudgetPrice).toFixed(2):'':""}</div>
          </div>

          {
            fillBackData && fillBackData.detaliList ?
            fillBackData.detaliList.map((item,index)=>(
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

       
          {/* <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">推荐型号 :  {fillBackData?fillBackData.recommendFmodel:''}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">推荐厂商 : {fillBackData?fillBackData.recommendProduct:''}</div>
          </div> */}
        </div>
        <Row>
          <hr className={styleCss.hr}/>
          <h3 style={{ fontWeight: 'bold' }}>审批意见</h3>
          <ul>
            {
              fillBackData ? fillBackData.commentList?
              fillBackData.commentList.map((item,index)=>(
                <li className={styleCss.li} key={index}>
                    <h4>
                      {item.userName} <Tag color={item.fstate==="01"?"#52C41A":"#F5222D"}>{approvalOpinionStatus[item.fstate]}</Tag>
                      <small  className={styleCss.colorFont+ ' '+styleCss.fr}>{item.approvalTime}</small>
                    </h4>
                    <p className={styleCss.colorFont}>{item.reason}</p>
                </li>
              ))
              :''
              :""
            }
          </ul>
        </Row>
        {
          fillBackData &&  fillBackData.approvalFstate ==="00" ?
          <Affix>
            <div style={{background: '#fff', padding: '10px 20px', marginBottom: 4, display: 'flex', alignContent: 'center', justifyContent: 'flex-end'}}>
              <Input placeholder='请输入审批意见' onInput={ (e)=>this.setState({idea:e.target.value}) }/>  
              <Button type="primary" onClick={()=>this.onValid()} style={{marginLeft:8,marginRight:8}}>通过</Button>
              <Button type="danger" ghost onClick={()=>this.onInvalid()}>不通过</Button>
            </div>
          </Affix>
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
      </Content>
    )
  }
}
export default Form.create()(EquipProcurementDetails);