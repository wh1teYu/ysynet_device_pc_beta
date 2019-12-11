/**
 * @file 档案管理-资产档案-详情-基本信息
 */
import React, { Component } from 'react';
import { Card } from 'antd';
import AssetInfo from './assetInfo';//资产信息
import AssetParts from './assetParts';//资产配件
import DepreInfo from './depreInfo';//折旧信息
import FundStructure from './fundStructure';//资金结构

class BaseInfo extends Component {
  render () {
    const { AssetInfoData ,freshDetail} = this.props;
    return (
      <div>
        {/*基本信息*/}
        <AssetInfo AssetInfoData={AssetInfoData} freshDetail={freshDetail}/>
        {/*折旧信息*/}
        <DepreInfo  AssetInfoData={AssetInfoData} freshDetail={freshDetail}/>

        <FundStructure  AssetInfoData={AssetInfoData} freshDetail={freshDetail}/>

        {/*<Card title="资金结构">
          <DepreInfo  AssetInfoData={AssetInfoData} freshDetail={freshDetail}/>
        </Card>*/}
        <Card title="资产配件">
          {
            JSON.stringify(AssetInfoData) === '{}' ? null 
            :
            <AssetParts assetsRecordGuid={AssetInfoData.assetsRecordGuid}/>
          }
        </Card>
      </div>  
    )
  }
}
export default BaseInfo;

