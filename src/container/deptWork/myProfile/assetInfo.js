/**
 * 档案管理-资产档案-详情-基本信息-资产信息
 */
import React, { Component } from 'react';
import { Row, Col,message } from 'antd';
import styles from './style.css';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { ledger as ledgerService } from '../../../service';
import assets from '../../../api/assets';
import querystring from 'querystring';
import { ledgerData, productTypeData, certSourceFunds, } from '../../../constants';

const spaceDic = {
  "00":"无",
  "01":"有"
}
class AssetInfo extends Component {
  handleUpdateAssetsRecordInfo = (data,field) =>{
    console.log(data,'data')
    const { updateAssetsRecordInfo,AssetInfoData } = this.props;
    let params = { };
    params.value = field;
    params.text = data;
    params.assetsRecordGuid = AssetInfoData.assetsRecordGuid;
    console.log(params,'params')
    updateAssetsRecordInfo(assets.updateAssetsRecordInfo, querystring.stringify(params),(data) => {
     if(data.status){
      message.success("修改成功")
     }else{
      message.error(data.msg);
     }
   },{
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
   })
  }
  
  render () {
    const { AssetInfoData } = this.props;
    return (
      <Row type="flex" style={{marginTop: 16}}  className={styles['table-row']}>
        <Col span={4} className={styles['table-span']}>资产名称</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.equipmentStandardName }</Col>
        <Col span={4} className={styles['table-span']}>资产编号</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.assetsRecord }</Col>
        <Col span={4} className={styles['table-span']}>通用名称</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.equipmentName }</Col>
        <Col span={4} className={styles['table-span']}>状态</Col>
        <Col span={8} className={styles['table-span']}>{  AssetInfoData.useFstate ? ledgerData[AssetInfoData.useFstate].text :null }</Col>
        <Col span={4} className={styles['table-span']}>型号</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.fmodel }</Col>
        <Col span={4} className={styles['table-span']}>规格</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.spec }</Col>
        <Col span={4} className={styles['table-span']}>资产分类</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.productType ? productTypeData[AssetInfoData.productType].text : null }</Col>
        <Col span={4} className={styles['table-span']}>使用科室</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.useDept }</Col>
        <Col span={4} className={styles['table-span']}>保管员</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.custodian }</Col>
        <Col span={4} className={styles['table-span']}>存放地址</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.deposit}</Col>
        <Col span={4} className={styles['table-span']}>管理科室</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.bDept }</Col>
        <Col span={4} className={styles['table-span']}>注册证号</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.registerNo }</Col>
        <Col span={4} className={styles['table-span']}>品牌</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.tfBrand }</Col>
        <Col span={4} className={styles['table-span']}>生产商</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.product }</Col>
        <Col span={4} className={styles['table-span']}>生产商国家</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.productCountry }</Col>
        <Col span={4} className={styles['table-span']}>出厂日期</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.productionDate?AssetInfoData.productionDate.split(' ')[0]:'' }</Col>
        <Col span={4} className={styles['table-span']}>供应商</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.fOrgName }</Col>
        <Col span={4} className={styles['table-span']}>购置日期</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.buyDate }</Col>
        <Col span={4} className={styles['table-span']}>合同编号</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.contractNo }</Col>
        <Col span={4} className={styles['table-span']}>计量单位</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.meteringUnit }</Col>
        <Col span={4} className={styles['table-span']}>购买金额</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.buyPrice }</Col>
        <Col span={4} className={styles['table-span']}>安装费</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.installPrice }</Col>
        <Col span={4} className={styles['table-span']}>经费来源</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.sourceFunds ? certSourceFunds[AssetInfoData.sourceFunds].text : null }</Col>
        <Col span={4} className={styles['table-span']}>维修分类</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.rrpairType } </Col>
        <Col span={4} className={styles['table-span']}>保养分类</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.maintainType }</Col>
        <Col span={4} className={styles['table-span']}>计量分类</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.meteringType }</Col>
        <Col span={4} className={styles['table-span']}>保养周期</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.maintainDay }</Col>
       
        <Col span={4} className={styles['table-span']}>有无备用</Col>
        <Col span={8} className={styles['table-span']}>{ (AssetInfoData.spare==="01"||AssetInfoData.spare==="00") ? spaceDic[ AssetInfoData.spare] : AssetInfoData.spare }</Col>
      </Row>
    )
  }
}


 export default withRouter(connect(null, dispatch => ({
  updateAssetsRecordInfo: (url,values,success,type) => ledgerService.getInfo(url,values,success,type),
}))(AssetInfo));


