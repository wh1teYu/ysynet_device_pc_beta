/**
 * @file 资产运维 - 维修管理 - 我的指派 - 指派
 */
import React, { PureComponent } from 'react';
import { Layout, Card, Affix, Button, BackTop,message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import StepsInfo from '../cardInfo/stepsInfo';
import AssetsInfo from '../cardInfo/assetsInfo';   
import RepairInfo from '../cardInfo/repairInfo'; 
import AssignInfo from '../cardInfo/assignInfo';
import { operation as operationService } from '../../../service';
import assets from '../../../api/assets';
import querystring from 'querystring';
const { Content } = Layout;
class RepairOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      AssetInfoData: {},
    }
  }

  onSubmit = () => {
    const { designateInOrOut,history } = this.props;
    const data = this.refs.assignInfo.postData(); //获取指派信息
    let params = {};
    params.rrpairOrderGuid = this.props.location.state.rrpairOrderGuid;
    params.orderFstate = data.rrpairType==='00'?'30':data.rrpairType==='01'?'20':'90';
    console.log({...params,...data},'指派信息');
    params = {...params,...data };
    console.log(JSON.stringify(params));
    designateInOrOut(assets.designateInOrOut,querystring.stringify(params),(data) => {
      if(data.status){
        message.success("操作成功!");
        history.push({ pathname:`/repairMgt/myRepairList`});
      }else{
        message.error(data.msg)
      }
    },{
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    })
  }
  //获取id 根据id号查详情
  componentWillMount = () =>{
    const assetsRecordGuid = this.props.match.params.id;
    const { getSelectAssetsRecordDetail } = this.props;
    const params = { rrpairOrderGuid: assetsRecordGuid };
    console.log(params,'parma')
    getSelectAssetsRecordDetail(assets.selectRrpairDetailList,querystring.stringify(params),(data) => {
      if(data.status){
        this.setState( { AssetInfoData : data.result })
      }else{
        message.error(data.msg);
      }
    },{
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    })
  }
  render() {
    const rrpairType = this.props.location.state.rrpairType || '' ;
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <Card title="报修进度" extra={[
          <Affix key={1}>
            <Button onClick={this.onSubmit} type='primary'>提交</Button>
          </Affix>
        ]} key={1}>
          <StepsInfo current={1} />
        </Card>
        <Card title="资产信息" style={{marginTop: 16}} hoverable={false} key={2}>
         {
            JSON.stringify(this.state.AssetInfoData) === '{}' ? null 
            :
            <AssetsInfo wrappedComponentRef={(inst) => this.assetsInfo = inst} data={this.state.AssetInfoData.selectRrpairDetailIsAssets} isEdit={true}/>
         } 
        </Card>
        <Card title="报修信息" style={{marginTop: 16}} hoverable={false} key={3}>
          
          {
            JSON.stringify(this.state.AssetInfoData) === '{}' ? null 
            :
            <RepairInfo wrappedComponentRef={(inst) => this.repairInfo = inst} data={this.state.AssetInfoData.selectRrpairDetailIsOrder} isEdit={false}/>
         } 
        </Card>
        <Card title="指派信息" style={{marginTop: 16}} hoverable={false} key={5}>
          {
            JSON.stringify(this.state.AssetInfoData) === '{}' ? null 
            :
            <AssignInfo ref='assignInfo' rrpairType={rrpairType} data={this.state.AssetInfoData.selectRrpairDetailIsCall} />
          }
        </Card>
        <BackTop />
      </Content>
    )
  }
}


export default withRouter(connect(null, dispatch => ({
  getSelectAssetsRecordDetail: (url,values,success,type) => operationService.getInfo(url,values,success,type),
  designateInOrOut: (url,values,success,type) => operationService.getInfo(url,values,success,type),
}))(RepairOrder));