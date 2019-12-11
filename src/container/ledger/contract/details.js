/*
 * @Author: yuwei - 新建合同
 * @Date: 2018-07-10 16:45:38 
* @Last Modified time: 2018-07-10 16:45:38 
 */
import React, { Component } from 'react';
import { Layout,Button,message} from 'antd';
import { Link } from 'react-router-dom';
import ledger from '../../../api/ledger';
import request from '../../../utils/request';
import queryString from 'querystring';
import PicWall from '../../../component/picWall';
import { FTP} from '../../../api/local';
import { contractTypeStatus , contractStatus  } from '../../../constants';
const { Content } = Layout;
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
class ContractDetails extends Component {
  state={
    query:{},
    manageSelect:[],
    outDeptOptions: [],
    postFile:[],
    params:this.props.match.params.id,
    baseInfo:{}
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
  componentWillMount(){
    console.log(this.props.match.params.id)
    request(ledger.queryContractList,{
      body:queryString.stringify({contractId:this.props.match.params.id}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({baseInfo:data.result.rows[0]})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  handleSubmit = () =>{
      let values = this.state.baseInfo;
      values.fstate="01";
      const { baseInfo : { contractId } } = this.state;
      console.log(JSON.stringify({contractId,fstate:"01"}))
      request(ledger.updateContractFstate,{
        body:queryString.stringify({contractId,fstate:"01"}),//values
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            message.warn('提交成功！')      
            const {history} = this.props;
            history.push('/ledger/contract')
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      })
  }
  render() {
    const { params , baseInfo } = this.state;
    console.log(params)
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={style.reference}>
        <h3 style={{padding:'24px'}}>采购合同
          {
            baseInfo.fstate==="01"?
            null:
            <span>
              <Button style={{float:'right'}}><Link to={{pathname:`/ledger/contract/add/${params}`}}>编辑</Link></Button>
              <Button type='primary' style={{float:'right',marginRight:8}} onClick={()=>this.handleSubmit()}>正式提交</Button>
            </span>
          }
         </h3>
        <div style={style.affix}>
          <small>状态</small>
          <h3>{baseInfo?contractStatus[baseInfo.fstate]:''}</h3>
        </div>
        <div style={{padding:'0 24px'}}>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">甲方名称 : {baseInfo?baseInfo.rOrgName:""}</div>
            <div className="ant-col-12">乙方名称 : {baseInfo?baseInfo.fOrgName:""}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">合同编号 : {baseInfo?baseInfo.contractNo:""}</div>
            <div className="ant-col-12">创建时间 : {baseInfo?baseInfo.createTime:""}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">管理科室 : {baseInfo?baseInfo.bDeptName:""}</div>
            <div className="ant-col-12">申请科室 : {baseInfo && baseInfo.deptName?baseInfo.deptName:""}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">合同类型 : {baseInfo?(contractTypeStatus[baseInfo.contractFlag]|| '设备' ):""}</div>
            <div className="ant-col-12">合同金额 : {baseInfo&&baseInfo.totalPrice?Number(baseInfo.totalPrice):"0.00"}</div>
          </div>
          <div className="ant-row" style={style.mb}>
            <div className="ant-col-12">上传附件 : 
              <PicWall isAdd={false} fileList={this.getFileList()}/>
            </div>
          </div>
        </div>
      </Content>
    )
  }
}
export default ContractDetails;