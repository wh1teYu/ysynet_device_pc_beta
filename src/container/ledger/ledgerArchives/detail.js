/**
 * 资产档案详情
 */
import React, { Component } from 'react';
import { Tabs , Row , Col } from 'antd';
import { withRouter } from 'react-router'
import BaseInfo from './baseInfo'; //基本信息
import CertInfo from './certInfo'; //证件信息
import AccessoryInfo from './accessoryInfo'; //证件信息
// import RecordList from './recordList'; //操作记录
import { connect } from 'react-redux';
import { ledgerData} from '../../../constants';
import { ledger as ledgerService } from '../../../service';
import assets from '../../../api/assets';
import { FTP } from '../../../api/local';
import querystring from 'querystring';
import style from './style.css';
const TabPane = Tabs.TabPane;

class LedgerArchivesDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AssetInfoData: {},
      DevalueInfoData:{}
    }
  }
  //获取id 根据id号查详情
  componentWillMount = () =>{
    this.getDetails()
  }

  getDetails = ()=>{
    const assetsRecordGuid = this.props.match.params.id;
    const { getSelectAssetsRecordDetail } = this.props;
    const params = { assetsRecordGuid: assetsRecordGuid };
    getSelectAssetsRecordDetail(assets.selectAssetsRecordDetail , querystring.stringify(params),(data) => {
      this.setState( { AssetInfoData : data.result })
    },{
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    })
  }
//style={{background:'#fff',padding:24}}
  render() {
    console.log(this.state.AssetInfoData,'this.state.AssetInfoData')
    const { AssetInfoData } = this.state;
    return (
      <div>
        <Row className={style.assetBgf}>
          <Col span={4}>
            {
              AssetInfoData && AssetInfoData.assetsImage ? 
              <img alt='资产图片' src={`${FTP}${AssetInfoData.assetsImage}`} height='135' style={{width: '80%'}}/>
              :
              <img alt='资产图片' src={ require('../../../assets/assetimg.jpg')} height='135'/>
            }
          </Col>
          <Col span={20}>
            <h3>{AssetInfoData?AssetInfoData.equipmentStandardName:''}</h3>
            <Col span={9} style={{marginTop:12}}>资产编号:{AssetInfoData?AssetInfoData.assetsRecord:''}</Col>
            <Col span={8} style={{marginTop:12}}>物资分类:{AssetInfoData?AssetInfoData.typeName:''}</Col>
            <Col span={9} style={{marginTop:12}}>保管员:{AssetInfoData?AssetInfoData.custodian:''}</Col>
            <Col span={8} style={{marginTop:12}}>使用科室:{AssetInfoData?AssetInfoData.useDept:''}</Col>
            <Col span={9} style={{marginTop:12}}>存放地址:{AssetInfoData?AssetInfoData.deposit:''}</Col>
          </Col>
          <div className={style.posBox}>
            <div>
              <small>状态</small>
              <h4>{AssetInfoData?AssetInfoData.useFstate?ledgerData[AssetInfoData.useFstate].text :'':''}</h4>
            </div>
            <div>
              <small>原值</small>
              <h4>¥ {AssetInfoData?AssetInfoData.originalValue?AssetInfoData.originalValue.toFixed(2):'0.00':''}</h4>
            </div>
          </div>
        </Row>
         {
          JSON.stringify(this.state.AssetInfoData) === '{}' || this.state.AssetInfoData === null ? null 
          :
          <Tabs defaultActiveKey="1" style={{padding:'0 20px'}} className={style.defindTab}>
            <TabPane tab="产品信息" key="1">
              <BaseInfo AssetInfoData={this.state.AssetInfoData} freshDetail={this.getDetails}/> 
            </TabPane>
            <TabPane tab="证件信息" key="2">
               <CertInfo certGuid={this.state.AssetInfoData.certGuid}/> 
            </TabPane>
            <TabPane tab="附件信息" key="3">
              <AccessoryInfo freshDetail={this.getDetails} assetsRecord={this.state.AssetInfoData.assetsRecord} assetsRecordGuid={this.state.AssetInfoData.assetsRecordGuid}/>
            </TabPane>
            {/*<TabPane tab="操作记录" key="4">
              <RecordList assetsRecord={this.state.AssetInfoData.assetsRecord}/>
            </TabPane>*/}
          </Tabs>
         }
      </div>
    )
  }
}

export default withRouter(connect(null, dispatch => ({
  getSelectAssetsRecordDetail: (url,values,success,type) => ledgerService.getInfo(url,values,success,type),
}))(LedgerArchivesDetail));