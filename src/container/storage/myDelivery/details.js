/*
 * @Author: yuwei 我的送货单详情
 * @Date: 2018-06-12 14:20:55 
* @Last Modified time: 2018-06-12 14:20:55 
 */
import React , { Component } from 'react';
import { Layout , Row, message } from 'antd';
import request from '../../../utils/request';
import querystring from 'querystring';
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
    title:"型号",
    dataIndex: 'fmodel',
    width:120
  },
  {
    title:"规格",
    dataIndex: 'spec',
    width:120
  },
  {
    title:"品牌",
    dataIndex: 'tfBrand',
    width:120
  },
  {
    title:"单位 ",
    dataIndex: 'purchaseUnit',
    width:120
  },
  {
    title:"采购单价",
    dataIndex: 'purchasePrice',
    width:120
  },
  {
    title:"发货数量",
    dataIndex: 'amount',
    width:120
  },
  {
    title:"生产商",
    dataIndex: 'produceName',
    width:120
  },
  {
    title:"出厂编号",
    dataIndex: 'downlineNo',
    width:120
  },
  {
    title:"注册证号",
    dataIndex: 'registerNo',
    width:120
  },
  {
    title:"出厂日期",
    dataIndex: 'downlineDate',
    width:120,
    render:(text)=>text?text.substr(0,10):""
  },
  {
    title:"国别",
    dataIndex: 'isImport',
    width:120,
    render:(text,record,index)=>{
      switch(record.isImport){
        case "00":
          return '国产';
        case "01":
          return '进口';
        default:
          return '';
      }
    }
  },
  {
    title:"保修截至日期",
    dataIndex: 'inDate',
    width:120,
    render:(text)=>text?text.substr(0,10):""
  },
  {
    title:"售后服务电话",
    dataIndex: 'aSalePhone',
    width:120
  },
  {
    title:"售后联系人",
    dataIndex: 'aSaleUser',
    width:120
  }
]
class EquipmentDeliveryDetails extends Component {

  state = {
    query:{sendId:this.props.match.params.id}
  }

  componentWillMount (){
    console.log('列表带过来的详情信息',this.props.location.state)
    console.log(this.props.match.params.id)

   // this.getDetails(this.props.match.params.id)
  }  
  getDetails = (sendId) => {
    request(storage.selectZCDeliveryDetail,{
      body:querystring.stringify(sendId),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){

          this.setState({dataSource:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }

  render(){
    const baseInfo = this.props.location.state || {};
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        <Row>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>送货单号</label>
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
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>管理部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                  {baseInfo.deptName}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>收货科室</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                  {baseInfo.tDeptName}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>收货人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                  {baseInfo.lxr}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>收货地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                  {baseInfo.tfAddress}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>联系电话</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                 {baseInfo.lxdh}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                <label>合同编号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                  {baseInfo.contractNo}
                </div>
              </div>
            </div>
          </div>
        </Row>
        
        <RemoteTable
          title={() => '产品信息'}
          url={storage.selectZCDeliveryDetail}
          ref='table'
          query={this.state.query}
          scroll={{x: '150%', y : document.body.clientHeight - 110 }}
          columns={columns}
          rowKey={'sendDetailGuid'}
          showHeader={true}
          style={{marginTop: 10}}
          size="small">
        </RemoteTable>

      </Content>
    )
  }
}

export default EquipmentDeliveryDetails ;