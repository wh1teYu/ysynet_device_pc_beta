/*
 * @Author: yuwei -审批配置详情
 * @Date: 2018-07-11 15:07:56 
* @Last Modified time: 2018-07-11 15:07:56 
 */
import React, { Component } from 'react';
import { Layout , Button , message } from 'antd';
import { Link } from 'react-router-dom';
import basicdata from '../../../api/basicdata';
import request from '../../../utils/request';
import queryString from 'querystring';
import { approvalStatus } from '../../../constants';

const { Content } = Layout;
const style = {
  mb:{
    marginBottom:16
  },
}
class ApprovalSettingDetails extends Component {
  state={
    query:{},
    manageSelect:[],
    outDeptOptions: [],
    params:this.props.match.params.id,
    fillBackData:{}
  }
  componentWillMount(){
    console.log(this.props.match.params.id)
    request(basicdata.selectZCApprovalList,{
      body:queryString.stringify({approvalGuid:this.props.match.params.id}),
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
  }
  render() {
    const { params , fillBackData} = this.state;
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <h3 style={{padding:'24px'}}>审批步骤详情  
          <Button style={{float:'right'}}><Link to={{pathname:`/basicdata/approvalSetting/add/${params}`}}>编辑</Link></Button>
        </h3>
        <div style={{padding:'0 24px'}}>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">步骤名称 : {fillBackData.approvalName}</div>
            <div className="ant-col-12">管理科室 : {fillBackData.bDeptName}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">指定审批 : {approvalStatus[fillBackData.approvalP]}</div>
            <div className="ant-col-12">审批人 : {fillBackData.approvalUserName}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">备注 : {fillBackData.tfRemark}</div>
          </div>
        </div>
      </Content>
    )
  }
}
export default ApprovalSettingDetails;