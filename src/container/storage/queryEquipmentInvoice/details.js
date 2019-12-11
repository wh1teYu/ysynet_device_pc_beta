/*
 * @Author: yuwei  - 查询设备发票详情
 * @Date: 2018-07-04 16:12:24 
* @Last Modified time: 2018-07-04 16:12:24 
 */
import React , { Component } from 'react';
import { Layout, Row,Card,Table} from 'antd';
import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
import { deliveryStatus } from '../../../constants';
const { RemoteTable } = TableGrid;
const { Content } = Layout;

const columns = [
  {
    title:"送货单号",
    dataIndex: 'sendNo',
  },
  {
    title:"已开票金额",
    dataIndex: 'accountPayed',
    render:(text)=> text?(text-0).toFixed(2):''
  },
  {
    title:"送货单金额",
    dataIndex: 'totalPrice',
    render:(text)=> text?(text-0).toFixed(2):''
  },
  {
    title:"状态",
    dataIndex: 'fstate',
    render:(text)=>text ?deliveryStatus[text].text:""
  }
]
const subColumnsData = [
  {
    title:"产品名称",
    dataIndex:"materialName"
  },
  {
    title:"型号",
    dataIndex:"fmodel"
  },
  {
    title:"规格",
    dataIndex:"spec"
  },
  {
    title:"单位",
    dataIndex:"purchaseUnit"
  },
  {
    title:"单价",
    dataIndex:"purchasePrice",
    render:(text)=> text?Number(text).toFixed(2):''
  },
  {
    title:"数量",
    dataIndex:"amount"
  },
  {
    title:"金额",
    dataIndex:"amountMoney",
    render:(text)=> text?Number(text).toFixed(2):''
  }
]

class DetailsEquipmentInvoice extends Component{

  state = {
    baseInfo:{},
  }
  render(){
    const baseInfo = this.props.location.state || '';
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
        <Card title={'发票信息'}>
          <Row>
            <div className="ant-col-8">
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                  <label>发票代码</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className="ant-form-item-control">
                  {baseInfo.invoiceCode}
                  </div>
                </div>
              </div>
            </div>
            <div className="ant-col-8">
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                  <label>发票号码</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className="ant-form-item-control">
                    {baseInfo.invoiceNo}
                  </div>
                </div>
              </div>
            </div>
            <div className="ant-col-8">
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                  <label>开票日期</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className="ant-form-item-control">
                    {baseInfo.invoiceDate}
                  </div>
                </div>
              </div>
            </div>
            <div className="ant-col-8">
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                  <label>开票金额</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className="ant-form-item-control">
                    {baseInfo.accountPayed.toFixed(2)}
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
                    {baseInfo.bDeptName}
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Card>
        <Card title={'送货单信息'} style={{marginTop:15}}>
          <RemoteTable
            query={{invoiceId:baseInfo.invoiceId}}
            rowKey={'invoiceId'}
            url={storage.selectInvoiceDetail}
            columns={columns}
            showHeader={true}
            size='small' 
            scroll={{ x: '100%' }}
            expandedRowRender={(record)=>{
              if(record.subList && record.subList.length!==0){
                return(
                  <Table
                    rowKey={'sendDetailGuid'}
                    columns={subColumnsData}
                    dataSource={record.subList}
                  ></Table>
                )
              }else{
                return(<p>暂无数据</p>)
              }
            }} 
          /> 
        </Card>
      </Content>
    )
  }
}
export default   DetailsEquipmentInvoice;