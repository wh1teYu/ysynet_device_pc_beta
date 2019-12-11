/**
 * 档案管理-资产档案-详情-基本信息-资产信息
 */
import React, { Component } from 'react';
import { Row, Col,Tooltip } from 'antd';
import styles from './style.css';
import request from '../../../utils/request';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { ledger as ledgerService } from '../../../service';
import assets from '../../../api/assets';
import querystring from 'querystring';
import moment , { isMoment }from 'moment';
import _ from 'lodash';
import { depreciationTypeData } from '../../../constants';

class DepreInfo extends Component {
  
  state={
    submitList:[],
    value:1
  }

  componentWillMount () {
    this.getDevalueInfoData(this.props.match.params.id)
  }

  getDevalueInfoData (id){

    request(assets.getDepreciateDetails, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body:  querystring.stringify({'assetsRecordGuid':id}),
      success: (data) => {
        if(_.isArray(data.result)){
          this.setState({
            submitList:data.result
          })
        }else{
          this.setState({
            submitList:[]
          })
        }
      },
      error: err => alert(err)
    })
  }

  getBackData = (type,field)=>{
    let single = _.find(this.state.submitList,{"payType":type})
    if(single && single[field]){
      return single[field].toString()
    }else{
      return ''
    }
  }
 
  render () {
    const { AssetInfoData } = this.props;
    return (
      <Row type="flex" style={{marginTop: 16}}  className={styles['table-row']}>
        <Col span={4} className={styles['table-span']}>折旧方式</Col>
        <Col span={8} className={styles['table-span']}>
          {AssetInfoData.depreciationType ? depreciationTypeData[AssetInfoData.depreciationType].text :''}
        </Col>
        <Col span={4} className={styles['table-span']}>原值</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.originalValue }</Col>
        <Col span={4} className={styles['table-span']}>
          <Tooltip placement="top" title={`自筹资金:￥${this.getBackData('01','buyPrice')}财政拨款：￥${this.getBackData('02','buyPrice')}`} arrowPointAtCenter>累计折旧</Tooltip>
        </Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.totalDepreciationPrice }</Col>
        <Col span={4} className={styles['table-span']}>净值</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.carryingAmount }</Col>
        <Col span={4} className={styles['table-span']}>净残值率</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.residualValueV ? AssetInfoData.residualValueV.toString() : '' }</Col>
        <Col span={4} className={styles['table-span']}>净残值</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.residualValue }</Col>
        <Col span={4} className={styles['table-span']}>月折旧率</Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.monthDepreciationV }</Col>
        <Col span={4} className={styles['table-span']}>
            <Tooltip placement="top" title={`自筹资金:￥${this.getBackData('01','buyPrice')}财政拨款：￥${this.getBackData('02','buyPrice')}`} arrowPointAtCenter>月折旧额</Tooltip>
        </Col>
        <Col span={8} className={styles['table-span']}>{ AssetInfoData.monthDepreciationPrice }</Col>
        <Col span={4} className={styles['table-span']}>预计使用年限</Col>
        <Col span={8} className={styles['table-span']}>
          { AssetInfoData.useLimit ?  AssetInfoData.useLimit.toString() : '' }
        </Col>
        <Col span={4} className={styles['table-span']}>计提开始时间</Col>
        <Col span={8} className={styles['table-span']}>
          {AssetInfoData.depreciationBeginDate ? isMoment(AssetInfoData.depreciationBeginDate)? moment(AssetInfoData.depreciationBeginDate,'YYYY-MM'):AssetInfoData.depreciationBeginDate :null}
        </Col>

        <Col span={24} className={styles['table-span']} style={{textAlign:'left',textIndent:'15px'}}>资金结构 </Col>
        <Col span={0} className={styles['table-span']}></Col>

        <Col span={4} className={styles['table-span']} style={{textAling:'center'}}> 自筹资金</Col>
        <Col span={8} className={styles['table-span']}>{ this.getBackData('01','buyPrice') } </Col>
        
        <Col span={4} className={styles['table-span']}  style={{textAling:'center'}}>财政拨款</Col>
        <Col span={8} className={styles['table-span']}>{ this.getBackData('02','buyPrice') }</Col>
        
        <Col span={4} className={styles['table-span']}>自筹资金原值</Col>
        <Col span={8} className={styles['table-span']}>{ this.getBackData('01','originalValue') }</Col>
        
        <Col span={4} className={styles['table-span']}>财政拨款原值</Col>
        <Col span={8} className={styles['table-span']}>{ this.getBackData('02','originalValue') }</Col>
        
        <Col span={4} className={styles['table-span']}>科研经费</Col>
        <Col span={8} className={styles['table-span']}>{  this.getBackData('03','buyPrice') }</Col>
        
        <Col span={4} className={styles['table-span']}>教学资金</Col>
        <Col span={8} className={styles['table-span']}>{ this.getBackData('04','buyPrice')  }</Col>
        
        <Col span={4} className={styles['table-span']}>科研经费原值</Col>
        <Col span={8} className={styles['table-span']}>{ this.getBackData('03','originalValue') }</Col>
        
        <Col span={4} className={styles['table-span']}>教学资金原值</Col>
        <Col span={8} className={styles['table-span']}>{ this.getBackData('04','originalValue') }</Col>
        
        <Col span={4} className={styles['table-span']}>接收捐赠</Col>
        <Col span={8} className={styles['table-span']}>{ this.getBackData('05','buyPrice') }</Col>
        
        <Col span={4} className={styles['table-span']}>其他</Col>
        <Col span={8} className={styles['table-span']}>{ this.getBackData('06','buyPrice') }</Col>
        
        <Col span={4} className={styles['table-span']}>接收捐赠原值</Col>
        <Col span={8} className={styles['table-span']}>{ this.getBackData('05','originalValue') }</Col>
        
        <Col span={4} className={styles['table-span']}>其他原值</Col>
        <Col span={8} className={styles['table-span']}>{ this.getBackData('06','originalValue') }</Col>
        
    </Row>
    )
  }
}


 export default withRouter(connect(null, dispatch => ({
  updateAssetsRecordInfo: (url,values,success,type) => ledgerService.getInfo(url,values,success,type),
}))(DepreInfo));


