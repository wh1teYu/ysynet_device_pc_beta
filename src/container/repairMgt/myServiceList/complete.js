/**
 * 完成维修
 */
import React, { PureComponent } from 'react';
import { Layout, Card, Affix, Button, BackTop, message } from 'antd';
import StepsInfo from '../cardInfo/stepsInfo';
import AssetsInfo from '../cardInfo/assetsInfo';   
import RepairInfo from '../cardInfo/repairInfo'; 
import AssignInfo from '../cardInfo/assignInfo';
import ServiceInfo from '../cardInfo/serviceInfo'; 
import PartsInfo from '../cardInfo/partsInfo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { operation as operationService } from '../../../service';
import assets from '../../../api/assets';
import querystring from 'querystring';
const { Content } = Layout;

class MyServiceComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectRrpairDetailIsOrder: {},
      selectRrpairDetailIsAssets: {},
      selectRrpairDetailIsRrpair: {},
      selectRrpairDetailIsAcce: {},
      selectRrpairDetailIsCall: {},
      selectRrpairDetail: {},
      rrpairType: this.props.location.state === undefined ? '00' : this.props.location.state.rrpairType,//维修方式 00 内修 01 外修
      repairFlag: '50' // 50 完成  90 关闭
      //UserType: this.props.user.groupName  // glks管理科室内修 syks使用科室  02 维修商 外修
    }
  }
  // 完成维修, 关闭, 保存  交互
  repairStatusUpdata = (postData)=>{
    const { closeOrfinishRepairService, history } = this.props;
    postData.quotedPrice = this.refs.partsInfo.postData().quoredPrice + "";
    console.log(postData,'postData')
    closeOrfinishRepairService(assets.insertOrUpdateRrpair,JSON.stringify(postData),(data)=>{
      if(data.status){
        message.success('操作成功');
        history.push({ pathname:`/repairMgt/myServiceList`});
      }else{
        message.error(data.msg);
      }
    })
  }

  complete = () => {
    const { rrpairType } = this.state;
    const baseData = this.props.location.state;
    let params = {};
    params.rrpairOrderGuid = baseData.rrpairOrderGuid;
    if( rrpairType === '00' ){
      //内修 完成
      params.isRepairs = false;
      if(this.state.repairFlag === '50'){
          params.orderFstate = '50';
          let postData = Object.assign( {}, params, this.refs.serviceInfo.postData());
          console.log(JSON.stringify(postData),'内修完成维修原因');
          this.repairStatusUpdata(postData);
      }else{
        // 内修 关闭
        params.orderFstate = '90';
        let postData = Object.assign( {}, params, this.refs.serviceInfo.postData() );
        console.log(JSON.stringify(postData),'内修关闭原因');
        this.repairStatusUpdata(postData);
      }
    }else{
      //指派  外修
      this.saveOrdesignOperation(baseData,"1");
    }
  }
  //保存
  save = () => {
    let params = {};
    const baseData = this.props.location.state;
    params.isRepairs = false;
    params.rrpairOrderGuid = baseData.rrpairOrderGuid;
    let postData = Object.assign( {}, params, this.refs.serviceInfo.postData() );
    console.log(postData,'postData')
    this.repairStatusUpdata(postData);
  }
  saveOrdesignOperation = (baseData,key)=>{
    const { finishRepairSerivce, history } = this.props;
    let params = this.refs.serviceInfo.postData();
    if(key){
      params.orderFstate = '20';
    }
    params.rrpairOrderGuid = baseData.rrpairOrderGuid;
    console.log(params,'params参数')
    finishRepairSerivce(assets.designateInOrOut,querystring.stringify(params),(data)=>{
      if(data.status){
        message.success('操作成功');
        history.push({ pathname:`/repairMgt/myServiceList`});
      }else{
        message.error(data.msg);
      }
    },{
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    })
  }
  componentWillMount = ()=>{
    const { finishRepairSerivce } = this.props;
    let params = {};
    params.rrpairOrderGuid = this.props.match.params.id;
    finishRepairSerivce(assets.selectRrpairDetailList,querystring.stringify(params),(data)=>{
      if(data.status){
        this.setState({ 
          selectRrpairDetailIsOrder: data.result.selectRrpairDetailIsOrder,
          selectRrpairDetailIsAssets: data.result.selectRrpairDetailIsAssets,
          selectRrpairDetailIsRrpair: data.result.selectRrpairDetailIsRrpair,
          selectRrpairDetailIsAcce: data.result.selectRrpairDetailIsAcce,
          selectRrpairDetailIsCall: data.result.selectRrpairDetailIsCall,
          selectRrpairDetail : data.result.selectRrpairDetail });
      }else{
        message.error(data.msg);
      }
    },{
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    })
  }
  render() {
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <Card title="报修进度" extra={[
          <Affix key={1}>
            <Button type='primary' onClick={this.complete} style={{marginRight: 5}}>{this.state.rrpairType==='00'? this.state.repairFlag==='50'? '完成':'关闭':'指派'}</Button>
            <Button onClick={this.save}>保存</Button>
          </Affix>
        ]} key={1}>
          <StepsInfo current={1} />
        </Card>
        <Card title="资产信息" style={{marginTop: 16}} hoverable={false} key={2}>
          {
            JSON.stringify(this.state.selectRrpairDetailIsAssets) === '{}' ? null 
            :
           <AssetsInfo  data={this.state.selectRrpairDetailIsAssets} isEdit={true}/>
          }
        </Card>
        <Card title="报修信息" style={{marginTop: 16}} hoverable={false} key={3}>
          {
            JSON.stringify(this.state.selectRrpairDetailIsOrder) === '{}' ? null 
            :
            <RepairInfo  data={this.state.selectRrpairDetailIsOrder} isEdit={false}/>
          }
        </Card>
        <Card title="指派信息" style={{marginTop: 16}} hoverable={false} key={5}>
          {
            JSON.stringify(this.state.selectRrpairDetailIsCall) === '{}' ? null 
            :
           <AssignInfo ref='assignInfo' 
            rrpairType={this.state.selectRrpairDetailIsCall.rrpairType} 
            data={this.state.selectRrpairDetailIsCall} isEdit={true}/>
          }
        </Card>
        <Card title="维修信息" style={{marginTop: 16}} hoverable={false} key={4}>
          {
            JSON.stringify(this.state.selectRrpairDetailIsRrpair) === '{}' ? null 
            :
            <ServiceInfo ref='serviceInfo'
              repairInput={true}
              callBack={(val)=> this.setState({ repairFlag: val })}
              cb_rrpairType={(Rrtype => this.setState({ rrpairType : Rrtype==='20'?'01':'00' }))}             
              rrpairType={this.state.selectRrpairDetailIsRrpair.rrpairType}
              data={this.state.selectRrpairDetailIsRrpair} isEdit={true}/>
          }
        </Card>
        {<Card title="维修配件" style={{marginTop: 16}} hoverable={false} key={6}>
          {
            JSON.stringify(this.state.selectRrpairDetailIsAssets) === '{}' ? null 
            :
            <PartsInfo ref='partsInfo'
              data={{
                rrpairOrderGuid:  this.props.match.params.id,
                assetsRecordGuid:this.state.selectRrpairDetailIsAssets.assetsRecordGuid,
              }} isAddParts={true}/>
          }
        </Card>}
        <BackTop />
      </Content>
    )
  }
}

export default withRouter(connect(state => state, dispatch => ({
  closeOrfinishRepairService: (url,values,success,type) => operationService.getInfo(url,values,success,type),
  pointRepaireService: (url,values,success,type) => operationService.getInfo(url,values,success,type),
  finishRepairSerivce: (url,values,success,type) => operationService.getInfo(url,values,success,type),
}))(MyServiceComplete));