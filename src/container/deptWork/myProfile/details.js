/**
 * 资产档案详情
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router'
import BaseInfo from './baseInfo'; //基本信息
import { connect } from 'react-redux';
import { ledger as ledgerService } from '../../../service';
import assets from '../../../api/assets';
import querystring from 'querystring';

class LedgerArchivesDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AssetInfoData: {},
      DevalueInfoData:{}
    }
  }
  //获取id 根据id号查详情
  componentDidMount = () =>{
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

  render() {
    console.log(this.state.AssetInfoData,'this.state.AssetInfoData')
    return (
      <div>
         {
          JSON.stringify(this.state.AssetInfoData) === '{}' || this.state.AssetInfoData === null ? null 
          :
            <BaseInfo AssetInfoData={this.state.AssetInfoData} freshDetail={this.getDetails}/> 
            
         }
      </div>
    )
  }
}

export default withRouter(connect(state=>state, dispatch => ({
  getSelectAssetsRecordDetail: (url,values,success,type) => ledgerService.getInfo(url,values,success,type),
}))(LedgerArchivesDetail));