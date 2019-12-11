/*
 * @Author: yuwei - 招标详情 
 * @Date: 2018-07-10 16:45:38 
* @Last Modified time: 2018-07-10 16:45:38 
 */
import React, { Component } from 'react';
import { Layout,Button,Tabs , message} from 'antd';
import { Link } from 'react-router-dom';
import { tenderStatus } from '../../../constants';
import ContractList from './contractList';
import ApplyList from './applyList';
import ledger from '../../../api/ledger';
import request from '../../../utils/request';
import queryString from 'querystring';
const { Content } = Layout;
const TabPane = Tabs.TabPane;
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
class TenderDetails extends Component {
  state={
    query:{},
    manageSelect:[],
    params:this.props.match.params.id
  }
  componentWillMount(){
    console.log(this.props.match.params.id)
  }
  //提交招标
  submitTender =  () => {
    request(ledger.updateZCTenderFstate,{
      body:queryString.stringify({tenderGuid:this.state.params,releaseFlag:"01"}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          message.warn('提交成功');
          const { history } = this.props;
          history.push({pathname:'/ledger/tender'});
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }

  render() {
    const { params } = this.state;
    const baseInfo = this.props.location.state;
    console.log(baseInfo)
    const tenderGuid = this.props.match.params.id;
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={style.reference}>
        <h3 style={{padding:'24px'}}>采购合同
          {
            baseInfo ? 
                baseInfo.releaseFlag==="00" ?
                (<span>
                    <Button style={{float:'right'}}><Link to={{pathname:`/ledger/tender/add/${params}`}}>编辑</Link></Button>
                    <Button type='primary' style={{float:'right',marginRight:8}} onClick={()=>this.submitTender()}>正式提交</Button>
                </span>)
              :null
           :''
          }
        </h3>
        <div style={style.affix}>
          <small>状态</small>
          <h3>{baseInfo ? tenderStatus[baseInfo.releaseFlag]: ""}</h3>
        </div>
        <div style={{padding:'0 24px'}}>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-8">管理科室 : {baseInfo ? baseInfo.bDeptName: ""}</div>
            <div className="ant-col-8">招标类型 : 资产设备类</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-8">供应商 : {baseInfo ?baseInfo.fOrgName: ""}</div>
            <div className="ant-col-8">供应商库房 : {baseInfo ? baseInfo.fStorageName ? baseInfo.fStorageName:'默认': ""}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-8">创建人 : {baseInfo ?baseInfo.createUserName: ""}</div>
            <div className="ant-col-8">创建时间 : {baseInfo ?baseInfo.createTime: ""}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-8">发布人 : {baseInfo ?baseInfo.modifyUserName: ""}</div>
            <div className="ant-col-8">发布时间 : {baseInfo ?baseInfo.modifiyTime: ""}</div>
          </div>
        </div>

        <Tabs defaultActiveKey="1" style={{padding:'0 24px'}}>
          <TabPane tab="合同" key="1">
            <ContractList tenderGuid={tenderGuid} mainFillBack={baseInfo}></ContractList>
          </TabPane>
          <TabPane tab="申请" key="2">
            <ApplyList tenderGuid={tenderGuid} mainFillBack={baseInfo}></ApplyList>
          </TabPane>
        </Tabs>
      </Content>
    )
  }
}
export default TenderDetails;