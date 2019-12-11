/*
 * @Author: yuwei - 入库详情
 * @Date: 2018-06-12 15:59:01 
* @Last Modified time: 2018-06-12 15:59:01 
 */

import React , { Component } from 'react';
import { Layout , Row, Button,  } from 'antd';//message
// import request from '../../../utils/request';
// import querystring from 'querystring';
import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
const { RemoteTable } = TableGrid;
const { Content } = Layout;
const columns = [
  {
    title:"产品名称",
    dataIndex: 'materialName',
    width:120
  },
  {
    title:"品牌",
    dataIndex: 'tfBrand',
    width:120
  },
  {
    title:"证件号",
    dataIndex: 'registerNo',
    width:120
  },
  {
    title:"规格",
    dataIndex: 'spec',
    width:120
  },
  {
    title:"型号 ",
    dataIndex: 'fmodel',
    width:120
  },
  {
    title:"单位",
    dataIndex: 'purchaseUnit',
    width:120
  },
  {
    title:"采购价",
    dataIndex: 'purchasePrice',
    width:120,
    render:text=>{return text.toFixed(2)}
  },
  {
    title:"入库数量",
    dataIndex: 'rksl',
    width:120
  },
  {
    title:"生产商",
    dataIndex: 'produceName',
    width:120
  },
  {
    title:"财务分类",
    dataIndex:'styleName',
    width:120
  }
]
class WareHouseDetails extends Component {

  state = {
    query:""
  }

  componentWillMount (){
    console.log(this.props.location.state)
    console.log(this.props.match.params.id);
  }  
  onPrint = () => {
    // console.log('123')
    window.open(`${storage.inputImport}?InId=${this.props.location.state.inId}`)
  } 

  render(){
    const baseInfo = this.props.location.state || '';
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        <Row>单据信息
          <Button type='primary' style={{float: 'right'}} onClick={this.onPrint}>打印</Button>
        </Row>
        <Row>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>管理部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                {baseInfo.bDeptName}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>操作员</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                {baseInfo.createUserName}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>入库时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                {baseInfo.inDate}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>入库单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                {baseInfo.inNo}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>送货单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                {baseInfo.sendNo}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>供应商</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                  {baseInfo.fOrgName}
                </div>
              </div>
            </div>
          </div>
        </Row>
        
        <RemoteTable
          title={() => '产品信息'}
          url={storage.selectImportDetail}
          ref='table'
          query={{InId:baseInfo.inId }}
          scroll={{x: '150%', y : document.body.clientHeight - 110 }}
          columns={columns}
          rowKey={'importDetailGuid'}
          showHeader={true}
          style={{marginTop: 10}}
          size="small">
        </RemoteTable>

      </Content>
    )
  }
}

export default WareHouseDetails ;