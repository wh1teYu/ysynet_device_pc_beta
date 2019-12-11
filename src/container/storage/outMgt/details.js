/*
 * @Author: yuwei - 出库详情
 * @Date: 2018-06-12 15:59:01 
* @Last Modified time: 2018-06-12 15:59:01 
 */

import React , { Component } from 'react';
import { Layout , Row , Button  } from 'antd';//message
// import { fetchData } from '../../../utils/tools';
// import querystring from 'querystring';
import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
const { RemoteTable } = TableGrid;
const { Content } = Layout;
const columns = [
  {
    title:"产品名称",
    dataIndex: 'materialName',
    width:200
  },
  {
    title:"品牌",
    dataIndex: 'brand',
    width:100
  },
  {
    title:"证件号",
    dataIndex: 'registerNo',
    width:150
  },
  {
    title:"规格",
    dataIndex: 'spec',
    width:150
  },
  {
    title:"型号 ",
    dataIndex: 'fmodel',
    width:150
  },
  {
    title:"单位",
    dataIndex: 'purchaseUnit',
    width:150
  },
  {
    title:"采购价",
    dataIndex: 'purchasePrice',
    width:150,
    render:(text)=>{return (text-0).toFixed(2)}
  },
  {
    title:"出库数量",
    dataIndex: 'outNumber',
    width:150,
    render:(text,record)=>{
      if(record.outMode==="02"){
          return record.outNumber;
      }else if (record.outMode==="05"){
          return record.withdrawNumber;
      }else{
          return text
      }
    }
  },
  {
    title:"生产商",
    dataIndex: 'produceName',
    width:150
  },
  {
    title:"财务分类",
    dataIndex: 'styleName',
    width:150
  },
  {
    title:"资产编号",
    dataIndex: 'assetsRecord',
    width:150
  }
]
class WareHouseDetails extends Component {

  state = {
    query:""
  }

  componentWillMount (){
    console.log(this.props.location.state)
  }  

  onPrint = () => {
    window.open(`${storage.outputImport}?outId=${this.props.location.state.outId}`)
  } 

  render(){
    const baseInfo = this.props.location.state || '' ; 
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        <Row>单据信息
          <Button type='primary' style={{float: 'right'}} onClick={this.onPrint}>打印</Button>
        </Row>
        <Row>
          <div className="ant-col-6">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>管理部门</label>
              </div>  
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                  {baseInfo.manageDeptName}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-6">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>操作员</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                {baseInfo.createUsername}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-6">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>出库时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                {baseInfo.outDate}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-6">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>出库方式</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                  {
                    baseInfo.outMode ? (baseInfo.outMode==="02" ? '科室领用出库':'退库出库'):''
                  }
                </div>
              </div>
            </div>
          </div>
        </Row>
        
        <RemoteTable
          title={() => '产品信息'}
          url={storage.queryOutportAssetDetailList}
          ref='table'
          query={{outId:baseInfo.outId}}
          scroll={{x: '100%', y : document.body.clientHeight - 110 }}
          columns={columns}
          rowKey={'RN'}
          showHeader={true}
          style={{marginTop: 10}}
          size="small">
        </RemoteTable>

      </Content>
    )
  }
}

export default WareHouseDetails ;