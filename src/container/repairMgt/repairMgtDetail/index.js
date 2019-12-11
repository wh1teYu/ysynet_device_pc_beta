/**
 * 维修记录详情
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router'
import BaseInfo from './baseInfo'; //基本信息
import { connect } from 'react-redux';
import { ledger as ledgerService } from '../../../service';
import assets from '../../../api/assets';
import querystring from 'querystring';
import { Button } from 'antd';
class AllDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      BaseInfoInfoData:{} ,
      showPrint:props.showPrint
    }
  }

  //获取id 根据id号查详情
  componentWillMount = () =>{
    const rrpairOrderGuid = this.props.match.params.id || this.props.id;
    const { getSelectRrpairDetailList } = this.props;
    const params = { rrpairOrderGuid: rrpairOrderGuid };
    getSelectRrpairDetailList(assets.selectRrpairDetailList ,querystring.stringify(params),(data) => {
      this.setState({ 
        BaseInfoInfoData : {...data.result.selectRrpairDetailIsOrder,
                              ...data.result.selectRrpairDetailIsAssets,
                              ...data.result.selectRrpairDetailIsAcce,
                              ...data.result.selectRrpairDetailIsRrpair,
                              ...data.result.selectRrpairDetailIsCall,
                              ...data.result.selectRrpairDetail,
                              ...data.result.selectRrpairIsInvalid,
                              ...this.props.location.state
                            }
        })
    },{
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    })
  }

  onPrint = () => {
    const { rrpairOrderGuid } = this.state.BaseInfoInfoData;
    window.open(`${assets.printAssectRrpair}?rrpairOrderGuid=${rrpairOrderGuid}`)
  }
  render() {
    console.log(this.state.BaseInfoInfoData.rrpairOrderGuid)
    const state = this.state.BaseInfoInfoData.orderFstate;
    const { showPrint } = this.state;
    const stateToggle = showPrint && (state==="50" || state==="90") && showPrint!=='repairRegListDetail';
    return (
      <div>
          {
            JSON.stringify(this.state.BaseInfoInfoData) === '{}'? null
            :
            (
              <div>
                {stateToggle?(
                  <div style={{textAlign: 'right',padding: 10}}>
                    <Button type='primary' onClick={this.onPrint}> 打印</Button>
                  </div>
                ):null}
                <BaseInfo BaseInfoInfoData = {this.state.BaseInfoInfoData} showPrint={showPrint==='repairRegListDetail'}/>
              </div>
            )
          }
      </div>
    )
  }
}

export default withRouter(connect(null, dispatch => ({
  getSelectRrpairDetailList : (url,values,success,type) => ledgerService.getInfo(url,values,success,type),
}))(AllDetail));