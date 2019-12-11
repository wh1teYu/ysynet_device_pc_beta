import React from "react";
import { Form , Layout , Input , Col , Row , Card , Modal , message , Affix , Button , DatePicker } from 'antd';
import request from '../../../utils/request';
import storage from '../../../api/storage';
import querystring from 'querystring';
import TableGrid from '../../../component/tableGrid';
import { validMoney } from '../../../utils/tools';
import { contractTypeStatus , PayFstate }  from '../../../constants'
import moment from 'moment';
import styles from '../style.css';
const { Content } = Layout;
const FormItem = Form.Item;
const { RemoteTable } = TableGrid;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const columns =[
  {
    dataIndex:"assetsRecord",
    title:"资产编号"
  },
  {
    dataIndex:"equipmentStandardName",
    title:"资产名称"
  },{
    dataIndex:"fmodel",
    title:"型号"
  },{
    dataIndex:"spec",
    title:"规格"
  },{
    dataIndex:"useDept",
    title:"使用科室"
  },{
    dataIndex:"buyPrice",
    title:"购买金额",
    render:(text)=>text||text===0?Number(text).toFixed(2):''
  },
]

class PayProgressDetails extends React.Component{

  state={
    query:{contractId:this.props.match.params.id},
    showModal:false,
    baseInfo:null
  }

  componentDidMount(){
    this.setDetail()
  }

  setDetail = () => {
    const  contractId = this.props.match.params.id;
    request(storage.selectPayContractList,{
      body:querystring.stringify({contractId}),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({baseInfo:data.result.rows[0]})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  onSubmit = () => {
    /* submit */
    this.props.history.push('/storage/payProgress')
    message.success("操作成功！")
  }

  addNewPay = () => {
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if(!err){
        values.contractId = this.props.match.params.id;
        values.payTime = moment(values.payTime).format('YYYY-MM-DD');
        console.log(values)
        /* send ajax */
        request(storage.insertContractPayDetail,{
          body:querystring.stringify(values),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: data => {
            if(data.status){
              this.setState({showModal:false})
              this.refs.tablePay.fetch()
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      }
    })
  }

  render(){
    const { showModal , baseInfo , query} = this.state;
    const { getFieldDecorator } = this.props.form;
    const defineColumns = [
      {
        dataIndex:"payTime",
        title:"付款日期",
        render:(text)=>text?(text).substr(0,11):''
      },
      {
        dataIndex:"payPrice",
        title:"付款金额",
        render:(text)=>text||text===0?Number(text).toFixed(2):'0.00'
      }
    ]
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}} >
        <Affix>
          <div className={styles['affix']}>
            <h2>合同编号：{baseInfo?baseInfo.contractNo:''}</h2>
            <div className={styles['fixed-box']}>
            {
              baseInfo&&baseInfo.payType !== "09" ?
              <Button type='primary' onClick={this.onSubmit}>提交</Button>
              :null 
            }
              <Row gutter={12}>
                <Col span={12}> 
                  <small>付款状态</small>
                  <h3>{baseInfo&&baseInfo.payType?PayFstate[baseInfo.payType]:'未付款'}</h3>
                </Col>
                <Col span={12}>
                  <small>资产总金额</small>
                  <h3>¥ {baseInfo&& baseInfo.totalPrice? Number(baseInfo.totalPrice).toFixed(2):'0.00'}</h3>
                </Col>
              </Row>
            </div>
            <Row className={styles['gap-m']}>
              <Col span={6}>合同名：{baseInfo?baseInfo.contractName:''}</Col>
              <Col span={6}>管理科室：{baseInfo?baseInfo.bDeptName:''}</Col>
              <Col span={6}>合同类型：{baseInfo?contractTypeStatus[baseInfo.contractType]|| '设备':''}</Col>
            </Row>
          </div>
        </Affix>
        
        <Card title='资产信息' className={styles['gap-m']}>
          <RemoteTable
            ref='table'
            rowKey='assetsRecordGuid'
            query={query}
            url={storage.selectContractAssetsList}
            scroll={{x: '100%'}}
            columns={columns}
            showHeader={true}
          >
          </RemoteTable>

        </Card>
        
        <Card title='付款情况' className={styles['gap-m']}>
        {
          baseInfo&&baseInfo.payType !== "09" ?
          <Button type='primary' style={{marginBottom:8}} onClick={()=>this.setState({showModal:true})}>新增付款</Button>
          :null 
        }
          <RemoteTable
            ref='tablePay'
            rowKey='contractPayDetailId'
            query={query}
            url={storage.selectContractPayDetailList}
            scroll={{x: '100%'}}
            columns={defineColumns}
            showHeader={true}
          >
          </RemoteTable>
        </Card>

      <Modal  
        destroyOnClose={true}
        visible={showModal}
        title='新增付款'
        onOk={this.addNewPay}
        onCancel={()=>this.setState({showModal:false})}>
        <Form>
            <FormItem label='付款日期' {...formItemLayout}>
                {
                  getFieldDecorator('payTime',{
                    initialValue:moment(),
                    rules:[{required:true,message:"请输入付款日期"}]
                  })(
                    <DatePicker placeholder='请输入付款日期'/>
                  )
                }
            </FormItem>
            <FormItem label='付款金额' {...formItemLayout}>
                {
                  getFieldDecorator('payPrice',{
                    rules:[{required:true,message:"请输入付款金额"},{validator: validMoney}]
                  })(
                    <Input placeholder='请输入付款金额' type='number' />
                  )
                }
            </FormItem>
        </Form>
      </Modal>

      </Content>
    )
  }
}
export default Form.create()(PayProgressDetails)