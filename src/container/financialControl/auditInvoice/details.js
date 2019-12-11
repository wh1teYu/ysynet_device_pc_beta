/*
 * @Author: yuwei 发票审核-详情
 * @Date: 2018-07-05 14:15:30 
* @Last Modified time: 2018-07-05 14:15:30 
 */
import React,{ Component } from 'react';
import {  Layout,Row,Card, Col , Button , message , Modal , Input , Table} from 'antd';
import TableGrid from '../../../component/tableGrid';
import financialControl from '../../../api/financialControl';
import request from '../../../utils/request';
import queryString from 'querystring';
import { deliveryStatus } from '../../../constants';
const {TextArea} = Input;
const { Content } = Layout;
const { RemoteTable } = TableGrid;
const columns = [
  {
    title:"送货单号",
    dataIndex: 'sendNo',
    width:200
  },
  {
    title:"已开票金额",
    dataIndex: 'accountPayed',
    width:200,
    render:(text)=> text?(text-0).toFixed(2):''
  },
  {
    title:"送货单金额",
    dataIndex: 'totalPrice',
    width:200,
    render:(text)=> text?(text-0).toFixed(2):''
  },
  {
    title:"状态",
    dataIndex: 'fstate',
    width:200,
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
  },
  {
    title: '入库单号',
    dataIndex: 'inNo',
  },
]

const payColumns = [
  {
    title:"序号",
    dataIndex: 'sort',
    width:80,
    render:(text,record,index)=>`${index+1}`
  },
  {
    title:"计划名称",
    dataIndex: 'pplanName',
    width:200,
  },
  {
    title:"付款月份",
    dataIndex: 'payYh',
    width:200,
  },
  {
    title:"本期付款",
    dataIndex: 'currentPrice',
    width:200,
  },
  {
    title:"备注",
    dataIndex: 'tfRemark',
    width:200,
  },
]
class DetailsAuditInvoice extends Component{

  state = {
    baseInfo:{},
    selectedRows:[],
    selectedRowKeys:[],
    visible:false,
    reason:""
  }
  //审核通过
  pass = () => {
    //发出请求
    let json = {
      invoiceId:this.props.location.state.invoiceId,
      fstate:'03',
    }
    request(financialControl.updateZCInvoiceFstate,{
      body:queryString.stringify(json),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          const { history } = this.props;
          message.success('审核状态修改成功！')
          history.push({pathname: '/financialControl/auditInvoice'})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  //审核不通过 - 提交
  submit = () => {
    console.log(this.state.reason)
    this.setState({visible:false,reason:""})
    //此处发出请求
    let json = {
      invoiceId:this.props.location.state.invoiceId,
      fstate:'09',
      rejectReason:this.state.reason
    }
    console.log('审核不通过发出的请求信息',json)
    request(financialControl.updateZCInvoiceFstate,{
      body:queryString.stringify(json),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          const { history } = this.props;
          message.success('审核状态修改成功！')
          history.push({pathname: '/financialControl/auditInvoice'})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  render(){
    const { visible , reason} = this.state;
    const baseInfo = this.props.location.state || '';

    const Header = ( 
        <div>
          <Col span={12}>发票信息</Col>
          {
            baseInfo.fstate==="00" ?
            <Col span={12} style={{textAlign:'right'}}>
              <Button type='primary' onClick={()=>this.pass()}>审核通过</Button>
              <Button style={{marginLeft:15}} onClick={()=>this.setState({visible:true})}>审核不通过</Button>
            </Col>
            :null
          }
        </div>
    )

    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <Card title={Header}>
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
                    {baseInfo.invoiceDate?baseInfo.invoiceDate.substr(0,11):""}
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
                    {baseInfo.accountPayed?baseInfo.accountPayed.toFixed(2):''}
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
        <Card title={'送货单信息'} style={{marginTop:15}} >
        <RemoteTable
          ref='table'
          query={{invoiceId:baseInfo.invoiceId}}
          url={financialControl.selectInvoiceDetail}
          scroll={{x: '100%', y : document.body.clientHeight - 311}}
          columns={columns}
          showHeader={true}
          rowKey={'invoiceId'}
          style={{marginTop: 10}}
          size="small"
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
        <Card title={'付款情况'} style={{marginTop:15}} >
        <RemoteTable
          ref='paytable'
          query={{invoiceId:baseInfo.invoiceId}}
          url={financialControl.selectInvoicePayPlan}
          scroll={{x: '100%', y : document.body.clientHeight - 311}}
          columns={payColumns}
          showHeader={true}
          rowKey={'pplanId'}
          style={{marginTop: 10}}
          size="small"
        /> 
        </Card>
        <Modal
          visible={visible}
          title='审核不通过'
          onOk={()=>{this.submit()}}
          onCancel={()=>{this.setState({reason:"",visible:false})}}
        >
          <TextArea placeholder="不通过原因"   value={reason} maxLength={200} rows={4} onInput={(e)=>this.setState({reason:e.target.value})}/>
        </Modal>
      </Content>
    )
  }
}
export default DetailsAuditInvoice