/**
 * 档案管理-资产档案-详情-基本信息-资产信息
 */
import React, { Component } from 'react';
import { Form , Card , Input , Row, Col,message , Button , Alert} from 'antd';
import request from '../../../utils/request';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { ledger as ledgerService } from '../../../service';
import assets from '../../../api/assets';
import querystring from 'querystring';
import _ from 'lodash';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const ShowDomInfo = (props) =>{
  const { name } = props;
  return ( 
    <div style={{height:40,lineHeight:'38px'}}>
      <Col span={8}>{`${name} :`}</Col>
      <Col span={16}>{props.children}</Col>
    </div>
  )
} 

class FundStructure extends Component {
  
  state={
    submitList:[],
    value:1,
    editable:false,
  }

  componentWillMount () {
    this.getDevalueInfoData(this.props.match.params.id)
  }

  //获取资金结构详情 
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


  //获取返回的数据 - 进行数据处理
  getBackData = (type,field)=>{
    let single = _.find(this.state.submitList,{"payType":type})
    if(single && single[field]){
      return single[field].toString()
    }else{
      return ''
    }
  }

  formatData = (values) =>{
    const {originalValue,totalDepreciationPrice} = values;
    const { submitList } = this.state;
    let ret = [];
    //混合成数组格式
    for( let item in originalValue){
      if(originalValue[item]!=='' && totalDepreciationPrice[item]!==''){
        ret.push({
          "payType":item,
          "originalValue":originalValue[item],
          "totalDepreciationPrice":totalDepreciationPrice[item]
        })
      }else{
        if(originalValue[item]!==""){
          ret.push({"payType":item,originalValue:originalValue[item]})
        }
        if(totalDepreciationPrice[item]!==""){
          ret.push({"payType":item,totalDepreciationPrice:totalDepreciationPrice[item]})
        }
      }
    }

    //获取equipmentPayGuid混合在一起
    ret = ret.map((item,index)=>{
      for(let i =0;i<submitList.length;i++){
        if(item.payType===submitList[i].payType){
          item.equipmentPayGuid=submitList[i].equipmentPayGuid;
        }
      }
      return item
    })
    return ret 
  }
 
   //1-产品信息- 折旧信息 - 整体编辑或保存
   handleSubmit = () => {
    // 此处发出请求地址 insertAssetsRecord   获取所有可编辑的数据
    if(this.state.editable){
      const { AssetInfoData } = this.props;
      this.props.form.validateFields((err, values)=>{
        values = this.formatData(values);
        console.log('整体编辑或保存',JSON.stringify({assetsRecordGuid:AssetInfoData.assetsRecordGuid,equipmentPayList:values}));
        request(assets.submitEquipmentPay,{
          body:JSON.stringify({assetsRecordGuid:AssetInfoData.assetsRecordGuid,equipmentPayList:values}),
          headers: {
            'Content-Type': 'application/json'
          },
          success: data => {
            if(data.status){
              this.getDevalueInfoData(AssetInfoData.assetsRecordGuid)
              this.setState({editable:!this.state.editable})
              this.props.freshDetail()
              message.success('保存成功！')
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      })
    }else{
      this.setState({editable:!this.state.editable})
    }
  }
  
  render () {
    const { getFieldDecorator } = this.props.form;
    const { editable } = this.state;
    const header= (
      <Row>
        <Col span={12}>资金结构
          <Alert style={{display:'inline-block',paddingRight:50,marginLeft:15}} message="修改累计折旧请同时修改已折月数" type="warning" closable></Alert>
        </Col>
        <Col span={12} style={{textAlign:'right'}}>
          <Button type='primary' style={{marginRight:15}} onClick={()=>this.handleSubmit()}>{editable? '保存':'编辑'}</Button>
        </Col>
      </Row>
    )
    return (

      <Card  title={header} style={{marginTop: 16,marginBottom:24}} className='baseInfo-assetInfo'>
        <Form>
          <Row>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`自筹资金原值`} {...formItemLayout}>
                    {getFieldDecorator(`originalValue['01']`,{
                      initialValue: this.getBackData('01','originalValue')
                    })(
                        <Input type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="自筹资金原值">{this.getBackData('01','originalValue')}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`财政拨款原值`} {...formItemLayout}>
                    {getFieldDecorator(`originalValue['02']`,{
                      initialValue: this.getBackData('02','originalValue')
                    })(
                        <Input  type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="财政拨款原值">{this.getBackData('02','originalValue')}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`科研经费原值`} {...formItemLayout}>
                    {getFieldDecorator(`originalValue['03']`,{
                      initialValue: this.getBackData('03','originalValue')
                    })(
                        <Input  type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="科研经费原值">{this.getBackData('03','originalValue')}</ShowDomInfo>
              }
            </Col>

            <Col span={8}>
              {
                editable? 
                  <FormItem label={`自筹资金累计折旧`} {...formItemLayout}>
                    {getFieldDecorator(`totalDepreciationPrice['01']`,{
                      initialValue:  this.getBackData('01','totalDepreciationPrice')
                    })(
                        <Input  type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="自筹资金累计折旧">{ this.getBackData('01','totalDepreciationPrice')}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`财政拨款累计折旧`} {...formItemLayout}>
                    {getFieldDecorator(`totalDepreciationPrice['02']`,{
                      initialValue: this.getBackData('02','totalDepreciationPrice')
                    })(
                        <Input  type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="财政拨款累计折旧">{this.getBackData('02','totalDepreciationPrice')}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`科研经费累计折旧`} {...formItemLayout}>
                    {getFieldDecorator(`totalDepreciationPrice['03']`,{
                      initialValue: this.getBackData('03','totalDepreciationPrice')
                    })(
                        <Input  type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="科研经费累计折旧">{ this.getBackData('03','totalDepreciationPrice')}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`教学资金原值`} {...formItemLayout}>
                    {getFieldDecorator(`originalValue['04']`,{
                      initialValue: this.getBackData('04','originalValue')
                    })(
                        <Input  type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="教学资金原值">{this.getBackData('04','originalValue')}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`接受捐赠原值`} {...formItemLayout}>
                    {getFieldDecorator(`originalValue['05']`,{
                      initialValue: this.getBackData('05','originalValue')
                    })(
                        <Input  type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="接受捐赠原值">{this.getBackData('05','originalValue')}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`其他原值`} {...formItemLayout}>
                    {getFieldDecorator(`originalValue['06']`,{
                      initialValue: this.getBackData('06','originalValue')
                    })(
                        <Input  type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="其他原值">{this.getBackData('06','originalValue')}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`教学资金累计折旧`} {...formItemLayout}>
                    {getFieldDecorator(`totalDepreciationPrice['04']`,{
                      initialValue: this.getBackData('04','totalDepreciationPrice')
                    })(
                        <Input  type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="教学资金累计折旧">{ this.getBackData('04','totalDepreciationPrice')}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`接收捐赠累计折旧`} {...formItemLayout}>
                    {getFieldDecorator(`totalDepreciationPrice['05']`,{
                      initialValue: this.getBackData('05','totalDepreciationPrice')
                    })(
                        <Input  type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="接收捐赠累计折旧">{ this.getBackData('05','totalDepreciationPrice')}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`其他累计折旧`} {...formItemLayout}>
                    {getFieldDecorator(`totalDepreciationPrice['06']`,{
                      initialValue: this.getBackData('06','totalDepreciationPrice')
                    })(
                        <Input  type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="其他累计折旧">{ this.getBackData('06','totalDepreciationPrice')}</ShowDomInfo>
              }
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
}

 export default withRouter(connect(null, dispatch => ({
  updateAssetsRecordInfo: (url,values,success,type) => ledgerService.getInfo(url,values,success,type),
}))(Form.create()(FundStructure)));


