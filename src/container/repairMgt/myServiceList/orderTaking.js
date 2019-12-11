/**
 * 接单维修
 */
import React, { PureComponent } from 'react';
import { Layout, Card, Affix, Button, BackTop,message } from 'antd';
import { withRouter } from 'react-router-dom';
import StepsInfo from '../cardInfo/stepsInfo';
import AssetsInfo from '../cardInfo/assetsInfo';   
import RepairInfo from '../cardInfo/repairInfo'; 
import AssignInfo from '../cardInfo/assignInfo';
import RefuseRepair from './refuseRepair';
import { connect } from 'react-redux';
import { operation as acceptRepairSerivce } from '../../../service';
import assets from '../../../api/assets';
import querystring from 'querystring';
const { Content } = Layout;
class OrderTaking extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rrpairType: '00',
      BaseInfoInfoData: {},
      visible: false,
      type:this.props.user.groupName  //glks 管理科室 syks使用科室  

    }
  }
  componentWillMount = ()=>{
    const { acceptRepairSerivce } = this.props;
    let params = {};
    params.rrpairOrderGuid = this.props.location.state.rrpairOrderGuid;
    params.rrpairOrderNo = this.props.location.state.rrpairOrderNo;
    acceptRepairSerivce(assets.selectRrpairDetailList,querystring.stringify(params),(data)=>{
      if(data.status){
        console.log(data.result,'result')
        this.setState({ BaseInfoInfoData : data.result });
      }else{
        message.error(data.msg);
      }
    },{
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    })
  }
  accept = () => {
    let baseData = this.props.location.state;
    const { acceptRepairSerivce, history } = this.props;
    let params = {};
    params.rrpairOrderGuid = baseData.rrpairOrderGuid;
    params.orderFstate = '30' //接修
    console.log(params,'params')
    acceptRepairSerivce(assets.updateRrpairOrderFstate,querystring.stringify(params),(data)=>{
      if(data.status){
          message.success('接修成功');
          history.push({ pathname:`/repairMgt/myServiceList`});
      }else{
         message.error(data.msg);
      }
    },{
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    })
   
  }
  refuse = ()=>{
    this.setState({ visible: true })
  }
  render() {
    const { type } = this.state;
    const baseData = this.props.location.state;
    console.log(baseData,'baseData')
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <Card title="报修进度" extra={[
          <Affix key={1}>
            <Button type='primary' onClick={this.accept} style={{marginRight: 5}}>接单维修</Button>
            {
              type === 'glks'// 服务商拒绝
              &&
              <Button type="danger" ghost onClick={this.refuse}>拒绝</Button>
            }
          </Affix>
        ]} key={1}>
          <StepsInfo current={1} />
        </Card>
        <Card title="资产信息" style={{marginTop: 16}} hoverable={false} key={2}>
          {
            JSON.stringify(this.state.BaseInfoInfoData) === '{}' ? null 
            :
            <AssetsInfo wrappedComponentRef={(inst) => this.assetsInfo = inst} data={this.state.BaseInfoInfoData.selectRrpairDetailIsAssets} isEdit={true}/>
          }
        </Card>
        <Card title="报修信息" style={{marginTop: 16}} hoverable={false} key={3}>
          {
            JSON.stringify(this.state.BaseInfoInfoData) === '{}' ? null
            :
            <RepairInfo wrappedComponentRef={(inst) => this.repairInfo = inst} data={this.state.BaseInfoInfoData.selectRrpairDetailIsOrder}/>
          }
        </Card>
        {
          type === 'glks'//服务商 指派信息
          &&
          <Card title="指派信息" style={{marginTop: 16}} hoverable={false} key={5}>
            {
              JSON.stringify(this.state.BaseInfoInfoData) === '{}' ? null
              :
              <AssignInfo ref='assignInfo' isEdit={true} rrpairType={ baseData.rrpairType } 
                callBack={(Rrtype => this.setState({ rrpairType : Rrtype==='20'?'01':'00' }))}
                data={this.state.BaseInfoInfoData.selectRrpairDetailIsCall}/>
            }
          </Card>
        }
        {
          <RefuseRepair visible={this.state.visible} setVisible={(val)=>this.setState({ visible: val})}/>
        }
        <BackTop />
      </Content>
    )
  }
}
//export default OrderTaking;
export default withRouter(connect(state => state, dispatch => ({
  acceptRepairSerivce: (url,values,success,type) => acceptRepairSerivce.getInfo(url,values,success,type),
}))(OrderTaking));
