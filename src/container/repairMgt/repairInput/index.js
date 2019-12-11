import React, { Component } from 'react';
import { Card, BackTop, Affix, Button,message,Steps } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import StepsInfo from '../cardInfo/stepsInfo'
import AssetsInfo from '../cardInfo/assetsInfo';   
import RepairInfo from '../cardInfo/repairInfo'; 
import ServiceInfo from '../cardInfo/serviceInfo';
import PartsInfo from '../cardInfo/partsInfo'; 
import assets from '../../../api/assets';
import { operation as operationService } from '../../../service';
const Step = Steps.Step;
/**
 * @file 资产运维-维修管理-维修录入
 */
class RepairInput extends Component {
  state = {
    current: 0,
    loading: false,
    assetsInfo: {},
    rrpairOrderGuid: '',
    isAssets:true, //判断有资产报修 还缺无资产报修的状态
    type: this.props.user.groupName, //glks管理科室 syks使用科室 this.props.user.groupName
    orderFstate: '50', //管理科室默认的状态是完成50   关闭90  使用科室提交10
  }
  handleButtonText =(orderFstate) => {
   if(this.state.type === "glks"){
    if(orderFstate === "50"){
      return "完成";
    }else if(orderFstate === "90"){
      return "关闭";
    }else if(orderFstate === "20"){
      return "指派";
    }
   }else{
     return "提交";
   }
  }
  
  onSubmit = () => {
    this.setState({ loading: true });
    const { insertOrRrpair } = this.props;
    let params = {};
    const type = this.state.type ; //用户类型
    if(type === "glks"){ //管理科室
      if(JSON.stringify(this.state.assetsInfo) === '{}'){
        return message.warning("请先搜索正确的资产信息,谢谢!")
      }
      //配件信息提交参数
      console.log(this.refs.partsInfo)
      const assetsExtendGuids = [];
      if(this.refs.partsInfo){
        const selectPartsData = this.refs.partsInfo.state.dataSource;  
        selectPartsData.map((item) => {
          return assetsExtendGuids.push({assetsExtendGuid : item.assetsExtendGuid,acceNum:item.extendSum})
        })
      }
      if(!this.assetsInfo.state.data){
        message.error('请填写正确的资产信息！')
        return false
      }
      params= {
        assetsRecordGuid:this.assetsInfo.state.data.assetsRecordGuid,
        equipmentCode:this.assetsInfo.state.data.equipmentCode,
        isRepairs:true,
        orderFstate:'90',
        assetsExtendGuids:assetsExtendGuids,
        ...this.repairInfo.postData(),    //报修信息提交数据
        ...this.refs.serviceInfo.postData() //使用科室没有维修信息  维修信息提交数据
      };
      console.log(params,"有资产报修...管理科室")
    }else if(type === "syks") { // 使用科室
      if(this.state.isAssets){
        if(JSON.stringify(this.state.assetsInfo) === '{}'){
          return message.warning("请先搜索正确的资产信息,谢谢!")
        }
        if(!this.assetsInfo.state.data){
          message.error('请填写正确的资产信息！')
          return false
        }
        params= {
          assetsRecordGuid:this.assetsInfo.state.data.assetsRecordGuid,
          equipmentCode:this.assetsInfo.state.data.equipmentCode,
          isRepairs:true,
          orderFstate:'90',
          ...this.repairInfo.postData(),
          ...this.refs.serviceInfo.postData()
        };
        console.log(params,"有资产报修...使用科室")
      }else{
        params= {
          isRepairs:true,
          orderFstate:'90',
          ...this.repairInfo.postData(),
          ...this.refs.serviceInfo.postData()
        };
        console.log(params,"无资产报修...使用科室")
      }
    }else{
      if(!this.assetsInfo.state.data){
        message.error('请填写正确的资产信息！')
        return false
      }
      params= {
        assetsRecordGuid:this.assetsInfo.state.data.assetsRecordGuid,
        equipmentCode:this.assetsInfo.state.data.equipmentCode,
        isRepairs:true,
        orderFstate:'90',
        ...this.repairInfo.postData(),
        ...this.refs.serviceInfo.postData()
      };
    }
    console.log("报修登记接口数据",params)
    insertOrRrpair(assets.insertOrUpdateRrpair,JSON.stringify(params),(data) => {
      this.setState({ loading: false })
      if(data.status){
        message.success("操作成功!");
        this.setState({ current: 1, rrpairOrderGuid: data.result.rrpairOrderGuid },() => window.scrollTo(0,0));
      }else{
        message.error(data.msg);
      }
    })
  }

  showContent = (current) =>{
    if(current === 0){
      return (
        <div>
          <Card title="资产信息" style={{marginTop: 16}} hoverable={false} key={2}>
          <AssetsInfo type={this.state.type} isRepair={true} repairInput={true} wrappedComponentRef={(inst) => this.assetsInfo = inst} callBack={(data,isAssets)=>this.setState({ assetsInfo : data,isAssets:isAssets})}/>
          </Card>
          <Card title="报修信息" style={{marginTop: 16}} hoverable={false} key={3}>
            <RepairInfo isEdit={true} assetsInfo={this.state.assetsInfo} wrappedComponentRef={(inst) => this.repairInfo = inst}/>
          </Card>
          <Card title="维修信息" style={{marginTop: 16}} hoverable={false} key={5}>
            <ServiceInfo isEdit={true} ref='serviceInfo' cb_rrpairType={(data)=>console.log('RepairInput',data)} repairInput={true} />
            {/* callBack={(orderFstate)=>this.setState({ orderFstate : orderFstate})} */}
          </Card>
          <div style={{ textAlign:'center',marginTop: 12 }}>
            <Button type='primary' onClick={this.onSubmit} loading={this.state.loading}>下一步</Button>
          </div>
        </div>
      )
    }else{
      return (
        <Card title="配件信息" style={{marginTop: 16}} hoverable={false} key={6}>
        {
          this.state.assetsInfo?
          <PartsInfo ref='partsInfo' data={{assetsRecordGuid:this.state.assetsInfo.assetsRecordGuid,rrpairOrderGuid: this.state.rrpairOrderGuid}} isAddParts={true}/>
          :
          <PartsInfo ref='partsInfo' data={{assetsRecordGuid:''}} isAddParts={false}/>
        }
        </Card>
      )
    }
  }

  render() {
    // const { type } = this.state;
    return (
      <div className='ysynet-repair ysynet-content '>
        <Card title="维修进度" extra={[
          <Affix key={1}>
            {/* <Button type='primary' onClick={this.onSubmit} >{ this.handleButtonText(this.state.orderFstate) }</Button> */}
          </Affix>
        ]} key={1}>
          {/* <StepsInfo current={0}/> */}
          <Steps current={this.state.current}>
            <Step title="维修信息" />
            <Step title="配件信息" />
          </Steps>
        </Card>
        <div>{this.showContent(this.state.current)}</div>
        {/* <Card title="资产信息" style={{marginTop: 16}} hoverable={false} key={2}>
          <AssetsInfo type={this.state.type} isRepair={true} repairInput={true} wrappedComponentRef={(inst) => this.assetsInfo = inst} callBack={(data,isAssets)=>this.setState({ assetsInfo : data,isAssets:isAssets})}/>
        </Card>
        <Card title="报修信息" style={{marginTop: 16}} hoverable={false} key={3}>
          <RepairInfo isEdit={true} assetsInfo={this.state.assetsInfo} wrappedComponentRef={(inst) => this.repairInfo = inst}/>
        </Card>
        <Card title="维修信息" style={{marginTop: 16}} hoverable={false} key={5}>
          <ServiceInfo isEdit={true} ref='serviceInfo' repairInput={true} callBack={(orderFstate)=>this.setState({ orderFstate : orderFstate})}/>
        </Card>
        <Card title="配件信息" style={{marginTop: 16}} hoverable={false} key={6}>
        {
          this.state.assetsInfo?
          <PartsInfo ref='partsInfo' data={{assetsRecordGuid:this.state.assetsInfo.assetsRecordGuid}} isAddParts={false}/>
          :
          <PartsInfo ref='partsInfo' data={{assetsRecordGuid:''}} isAddParts={false}/>
        }
        </Card> */}
        <BackTop />
      </div>  
    )
  }
}


export default withRouter(connect(state => state, dispatch => ({
  insertOrRrpair: (url,values,success,type) => operationService.getInfo(url,values,success,type),
}))(RepairInput));