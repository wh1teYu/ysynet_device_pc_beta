/**
 * @file 档案管理-资产档案-详情-基本信息
 */
import React, { Component } from 'react';
import { Collapse } from 'antd';
import AssetInfo from './assetInfo';//资产信息
import DepreInfo from './depreInfo';//折旧信息

const Panel = Collapse.Panel;

class BaseInfo extends Component {
  render () {
    const { AssetInfoData ,freshDetail} = this.props;
    return (
      <div>
        <Collapse defaultActiveKey={['1','2','4']}>
          <Panel header="资产图片" key="1">
            <img alt='资产图片' src={require('../../../assets/assetimg.jpg')} style={{marginRight:15}}/>
            <img alt='资产图片' src={require('../../../assets/assetimg.jpg')} style={{marginRight:15}}/>
            <img alt='资产图片' src={require('../../../assets/assetimg.jpg')}/>
          </Panel>
          <Panel header="资产信息" key="2">
            <AssetInfo AssetInfoData={AssetInfoData}/>
          </Panel>
          <Panel header="折旧信息" key="4">
            <DepreInfo  AssetInfoData={AssetInfoData} freshDetail={freshDetail}/>
          </Panel> 
        </Collapse>
      </div>  
    )
  }
}
export default BaseInfo;

