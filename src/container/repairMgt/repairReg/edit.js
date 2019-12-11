import React, { Component } from 'react';
import { Card, BackTop, Affix, Button,message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import StepsInfo from '../cardInfo/stepsInfo'
import AssetsInfo from '../cardInfo/assetsInfo';   
import RepairInfo from '../cardInfo/repairInfo'; 
//import ServiceInfo from '../cardInfo/serviceInfo';
//import PartsInfo from '../cardInfo/partsInfo'; 
import assets from '../../../api/assets';
import { operation as operationService } from '../../../service';
import querystring from 'querystring';
/**
 * @file 报修记录-编辑
 */
class RepairReg extends Component {
    constructor(props) {
      super(props);
      this.state = {
        type: this.props.user.groupName, //this.props.user.groupName
        orderFstate: '10', //管理科室默认的状态是完成50   关闭90  使用科室提交10
        selectRrpairDetailIsOrder: {},
        selectRrpairDetailIsAssets:{},
        selectRrpairDetailIsRrpair:{},
        selectRrpairDetailIsAcce:{},
        selectRrpairDetailIsCall:{}
      }
    }
    handleButtonText =(orderFstate) => {
      if(this.state.type === "glks"){
       if(orderFstate === "50"){
         return "完成";
       }else if(orderFstate === "90"){
         return "关闭";
       }else if(orderFstate === "20"){
         return "指派";
       }else {
        return "保存";
       }
      }else{
        return "提交";
      }
     }

   //获取id 根据id号查详情
   componentWillMount = () =>{
    const rrpairOrderGuid = this.props.match.params.id ;
    const { getSelectRrpairDetailList } = this.props;
    const params = { rrpairOrderGuid: rrpairOrderGuid };
    getSelectRrpairDetailList(assets.selectRrpairDetailList,querystring.stringify(params),(data) => {
      this.setState({ 
          selectRrpairDetailIsOrder: data.result.selectRrpairDetailIsOrder,
          selectRrpairDetailIsAssets: data.result.selectRrpairDetailIsAssets,
          selectRrpairDetailIsRrpair: data.result.selectRrpairDetailIsRrpair,
          selectRrpairDetailIsAcce: data.result.selectRrpairDetailIsAcce,
          selectRrpairDetailIsCall: data.result.selectRrpairDetailIsCall
        })
    },{
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    })
  }

  onSubmit = () => {
    const { insertOrRrpair,history } = this.props;
    const rrpairOrderGuid = this.props.match.params.id ;
    let params = {};
    const type = this.state.type ; //用户类型
    if(type === "glks"){ //管理科室
      params= {
        rrpairOrderGuid:rrpairOrderGuid,
        assetsRecordGuid:this.state.selectRrpairDetailIsAssets.assetsRecordGuid,
        equipmentCode:this.state.selectRrpairDetailIsAssets.equipmentCode,
        isRepairs:true,
        orderFstate:this.state.orderFstate,
        ...this.repairInfo.postData(),
        //...this.refs.serviceInfo.postData() //使用科室没有维修信息
      };
      console.log(params,"编辑有资产报修...管理科室")
    }else if(type === "syks") { // 使用科室
        params= {
          rrpairOrderGuid:rrpairOrderGuid,
          assetsRecordGuid:this.state.selectRrpairDetailIsAssets.assetsRecordGuid,
          equipmentCode:this.state.selectRrpairDetailIsAssets.equipmentCode,
          isRepairs:true,
          orderFstate:'10',
          ...this.repairInfo.postData()
        };
        console.log(params,"编辑有资产报修...使用科室")
   
    }
    console.log("报修登记编辑接口数据",params)
    insertOrRrpair(assets.insertOrUpdateRrpair,JSON.stringify(params),(data) => {
      if(data.status){
        history.push("/repairMgt/repairRegList");
        message.success("操作成功!")
      }else{
        message.error(data.msg);
      }
    })

  }

  render() {
    const { type } = this.state;
    console.log(type,'1111')
    return (
      <div className='ysynet-repair ysynet-content '>
        <Card title="报修进度" extra={[
          <Affix key={1}>
            <Button type='primary' onClick={this.onSubmit}>{this.handleButtonText(this.state.orderFstate)}</Button>
          </Affix>
        ]} key={1}>
          <StepsInfo current={0}/>
        </Card>
        <Card title="资产信息" style={{marginTop: 16}} hoverable={false} key={2}>
          {
            JSON.stringify(this.state.selectRrpairDetailIsAssets) === '{}' ? null 
            :
            <AssetsInfo isEdit={true} wrappedComponentRef={(inst) => this.assetsInfo = inst}  data={this.state.selectRrpairDetailIsAssets}/>
          } 
        </Card>
        <Card title="报修信息" style={{marginTop: 16}} hoverable={false} key={3}>
          {
            JSON.stringify(this.state.selectRrpairDetailIsOrder) === '{}' ? null 
            :
            <RepairInfo isEdit={true} partEdit={true} wrappedComponentRef={(inst) => this.repairInfo = inst} data={this.state.selectRrpairDetailIsOrder}/>
          } 
        
        </Card>
        {/* {
          type === "glks" ? 
            <div>
              <Card title="维修信息" style={{marginTop: 16}} hoverable={false} key={5}>
                {
                  JSON.stringify(this.state.selectRrpairDetailIsRrpair) === '{}' ? null 
                  :
                  <ServiceInfo isEdit={true}  ref='serviceInfo' data={this.state.selectRrpairDetailIsRrpair} callBack={(data)=>this.setState({ orderFstate : data})}/>
                } 
              </Card>
              {
                this.state.selectRrpairDetailIsAssets.assetsRecordGuid ?
                <Card title="配件信息" style={{marginTop: 16}} hoverable={false} key={6}>
                  <PartsInfo data={{assetsRecordGuid:this.state.selectRrpairDetailIsAssets.assetsRecordGuid,rrpairOrderGuid:this.props.match.params.id}} />
                </Card>
                :
                null
              }
            
            </div>
          :
          null
        } */}
        <BackTop />
      </div>  
    )
  }
}



export default withRouter(connect(state => state, dispatch => ({
  getSelectRrpairDetailList: (url,values,success,type) => operationService.getInfo(url,values,success,type),
  insertOrRrpair: (url,values,success,type) => operationService.getInfo(url,values,success,type),
}))(RepairReg));