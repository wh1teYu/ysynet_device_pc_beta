/*
 * @Author: yuwei 借用申请 - 详情 
 * @Date: 2018-09-25 21:11:11 
* @Last Modified time: 2018-09-25 21:11:11 
 */
import React , { PureComponent } from 'react'
import { Button, message , Row, Col , Modal, Layout, Form, DatePicker, Input ,Card, Affix , } from 'antd';
import ledgerBorrow from '../../../api/ledgerBorrow';
import request from '../../../utils/request';
import queryString from 'querystring';
import moment from 'moment';
import Style from './style.css';
const Confirm = Modal.confirm;
const {Content} = Layout;
const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
      xs: {span: 24},
      sm: {span: 7}
  },
  wrapperCol: {
      xs: {span: 24},
      sm: {span: 16}
  }
}
const sigleFormItemLayout ={
  labelCol: {
    xs: {span: 24},
    sm: {span: 2}
  },
  wrapperCol: {
      xs: {span: 24},
      sm: {span: 16}
  }
}
class BorrowApplyDetails extends PureComponent {

  state={
    fillBackData:{},//回显数据
  }

  componentDidMount(){
    console.log(this.props.match.params.id)
    request(ledgerBorrow.BorrowRecordList, {     //借出科室
      body: queryString.stringify({ borrowGuid: this.props.match.params.id,borrowType:"02"}),
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (data) => {
        console.log(data)
        this.setState({fillBackData:data.result.rows[0]})
      },
      error: (err) => console.log(err)
   });
  }
  onSubmit = () => {
    console.log('保存')
    this.props.form.validateFieldsAndScroll((err,values)=>{
      const { fillBackData } = this.state;
      if(values.estimateBack){
        values.estimateBack = moment(values.estimateBack).format('YYYY-MM-DD HH:mm')
      }else{
        delete values['estimateBack']
      }
      values.borrowGuid = fillBackData.borrowGuid;
      console.log(JSON.stringify(values))
      request(ledgerBorrow.updateBorrowInfo,{
        body:queryString.stringify({...values}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            message.success('操作成功')
            const { history } = this.props;
            history.push('/ledgerBorrow/borrowApply')
          }
        },
        error: err => {console.log(err)}
      })

    })
  }

  onCancel = () =>{
    console.log('取消')
    Confirm({
      content:'确定取消？',
      onOk:()=>{
        const { history } = this.props;
        history.push({pathname:'/ledgerBorrow/borrowApply'})
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { fillBackData } = this.state;
    return( 
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
        <Affix offsetTop={0}>
          <div style={{textAlign: 'right'}}>
            <Button type='primary' className={Style.buttonGap} onClick={this.onSubmit}> 保存</Button>
            <Button onClick={this.onCancel}>关闭</Button>
          </div>
        </Affix>
        <Card title='资产信息' style={{marginTop: 12}}> 
          <Row>
            <Col span={12}>
              <FormItem label='资产编号' {...formItemLayout}>
                  {fillBackData?fillBackData.assetsRecord:''}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='资产名称' {...formItemLayout}>
                {fillBackData?fillBackData.equipmentStandardName:''}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='型号' {...formItemLayout}>
              {fillBackData?fillBackData.fmodel:''}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='规格' {...formItemLayout}>
              {fillBackData?fillBackData.spec:''}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='资产类别' {...formItemLayout}>
                {fillBackData?fillBackData.productType:''}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='使用科室' {...formItemLayout}>
                  {fillBackData?fillBackData.useDeptName:''}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='保管员' {...formItemLayout}>
                  {fillBackData?fillBackData.custodian:''}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='管理科室' {...formItemLayout}>
                {fillBackData?fillBackData.manageDeptName:''}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title='借用信息' style={{marginTop: 12}}> 
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label='预计归还时间'
              >
              {getFieldDecorator('estimateBack',{
                initialValue:fillBackData&& fillBackData.estimateBack?moment(fillBackData.estimateBack,'YYYY-MM-DD HH:ss'):null,
                rules:[{
                  required:true,message:'请选择预计归还时间'
                }]
              })(
                <DatePicker />
              )}
            </FormItem>
          </Col>  
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label='借用人'
              >
              {getFieldDecorator('borrowUserName',{
                initialValue:fillBackData?fillBackData.borrowUserName:''
              })(
                <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col> 
          <Col span={24}>
            <FormItem
              {...sigleFormItemLayout}
              label='借用原因'
              >
              {getFieldDecorator('borrowCause',{
                initialValue:fillBackData?fillBackData.borrowCause:''
              })(
                <TextArea />
              )}
            </FormItem>
          </Col>  
        </Card>

      
      </Content>
    )
  }

}

export default Form.create()(BorrowApplyDetails);