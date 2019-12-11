/**
 * 档案管理-资产档案-详情-基本信息-资产信息
 */
import React, { Component } from 'react';
import { Form , Card , Input , Row, Col,message,Tooltip ,DatePicker , Button , Select , Modal ,Icon} from 'antd';
import './style.css';
import request from '../../../utils/request';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { ledger as ledgerService } from '../../../service';
import assets from '../../../api/assets';
import querystring from 'querystring';
import moment, { isMoment } from 'moment';
import _ from 'lodash';
import { clearNull , limitNum , validMonth } from '../../../utils/tools';
import { depreciationTypeData } from '../../../constants';
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};
const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  },
};
const ShowDomInfo = (props) =>{
  const { name } = props;
  return ( 
    <div style={{height:40,lineHeight:'38px'}}>
      <Col span={7}>{`${name} :`}</Col>
      <Col span={17}>{props.children}</Col>
    </div>
  )
} 

class DepreInfo extends Component {
  
  state={
    submitList:[],
    value:1,
    editable:false,
    definedMoreModal:false,
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

  handleUpdateAssetsRecordInfo = (data,field) =>{
    if(isMoment(data)){
        data = moment(data).format('YYYY-MM')
    }
    const { updateAssetsRecordInfo } = this.props;
    let params = { };
    params.value = field;
    params.text = data;
    params.assetsRecordGuid = this.props.match.params.id;

    updateAssetsRecordInfo(assets.updateAssetsRecordInfo, querystring.stringify(params),(data) => {
     if(data.status){
      message.success("修改成功")
     }else{
      message.error(data.msg);
     }
   },{
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
   })
  }
  handlePayList = ()=>{
    //提交资金结构列表
    let json = {
      equipmentPayList:this.state.submitList,
      assetsRecordGuid:this.props.match.params.id
    }
    console.log(JSON.stringify(json))
    let options = {
			body:JSON.stringify(json),
			success: data => {
				if(data.status){
          message.success('资金结构保存成功')
          this.props.freshDetail();//刷新单条
				}else{
					message.error(data.msg)
				}
			},
			error: err => {console.log(err)}
		}
		request(assets.submitEquipmentPay,options)
  }
  setSubmitList = (value,type,field)=> {
    let j = {
      payType:type,
      [field]:value-0
    }
    let a = this.state.submitList;
    if(a.length){
      a.forEach(ele=>{
        if(ele.payType===j.payType){
          ele=Object.assign(ele,j)
          return
        }
      })
    }
    a.push(j)
    this.setState({
      submitList:_.uniqBy(a,'payType')
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
 
   //1-产品信息- 折旧信息 - 整体编辑或保存
   handleSubmit = () => {
    // 此处发出请求地址 insertAssetsRecord   获取所有可编辑的数据
    if(this.state.editable){
      const { AssetInfoData } = this.props;
      this.props.form.validateFields((err, values)=>{
        values.assetsRecordGuid=AssetInfoData.assetsRecordGuid;
        values.assetsRecord=AssetInfoData.assetsRecord;
        if(values.depreciationBeginDate && isMoment(values.depreciationBeginDate)){
          values.depreciationBeginDate=moment(values.depreciationBeginDate).format('YYYY-MM-DD')
        }
        console.log('整体编辑或保存', {assetsRecord:clearNull(values),equipmentPayList:[]});
        request(assets.insertAssetsRecord,{
          body:JSON.stringify({assetsRecord:clearNull(values),equipmentPayList:[]}),
          headers: {
            'Content-Type': 'application/json'
          },
          success: data => {
            if(data.status){
              this.props.freshDetail()
              this.setState({editable:!this.state.editable})
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

  //更多自定义弹窗 -
  definedMore = ()=>{
    this.setState({definedMoreModal:true})
  }
  
  //自定义表单提交
  _submitDefineMore = ()=>{
    this.defineForm.props.form.validateFields((errs,values)=>{
      if(!errs){
        delete values['keys'];
        let postData ={
          assetsRecordGuid:this.props.match.params.id,
          list:values.list.filter(item=>item)
        }
        console.log(JSON.stringify(postData))
        request(assets.insertCustomFieldZc,{
          body:JSON.stringify(postData),
          headers: {
            'Content-Type': 'application/json'
          },
          success: data => {
            if(data.status){
              message.success('保存成功！')
              this.setState({definedMoreModal:false})
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      }
    });
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { AssetInfoData } = this.props;
    const { editable , definedMoreModal } = this.state;
    const header= (
      <Row>
        <Col span={12}>折旧信息</Col>
        <Col span={12} style={{textAlign:'right'}}>
          <Button type='primary' style={{marginRight:15}} onClick={()=>this.handleSubmit()}>{editable? '保存':'编辑'}</Button>
          <Button style={{marginRight:15}} onClick={this.definedMore}>更多自定义字段</Button>
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
                  <FormItem label={`折旧方式`} {...formItemLayout}>
                    {getFieldDecorator(`depreciationType`,{//DEPRECIATION_TYPE
                      initialValue: AssetInfoData.depreciationType
                    })(
                      <Select>
                        <Option value="00">无折旧方式</Option>
                        <Option value="01">{depreciationTypeData['01'].text}</Option>
                        <Option value="02">{depreciationTypeData['02'].text}</Option>
                        <Option value="03">{depreciationTypeData['03'].text}</Option>
                        <Option value="04">{depreciationTypeData['04'].text}</Option>
                      </Select> 
                    )}
                  </FormItem>
                  :<ShowDomInfo name="折旧方式">{AssetInfoData?depreciationTypeData[AssetInfoData.depreciationType]?depreciationTypeData[AssetInfoData.depreciationType].text:'':''}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              <ShowDomInfo name="原值">{AssetInfoData?AssetInfoData.originalValue:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              <ShowDomInfo name="累计折旧">
                <Tooltip placement="top" title={`自筹资金:￥${this.getBackData('01','buyPrice')}财政拨款：￥${this.getBackData('02','buyPrice')}`} arrowPointAtCenter>
                {AssetInfoData?AssetInfoData.totalDepreciationPrice:''}
                </Tooltip>
              </ShowDomInfo>
            </Col>
            <Col span={8}>
              <ShowDomInfo name="净值">{AssetInfoData?AssetInfoData.carryingAmount:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`净残值率`} {...formItemLayout}>
                    {getFieldDecorator(`residualValueV`,{
                      initialValue: AssetInfoData.residualValueV*100,
                      rules:[{validator:limitNum,max:100,message:'请输入0-100的数字，最多保留两位小数!'}]
                    })(
                        <Input addonAfter='%'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="净残值率">{`${AssetInfoData.residualValueV*100}%`}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`预计使用年限`} {...formItemLayout}>
                    {getFieldDecorator(`useLimit`,{
                      initialValue: AssetInfoData.useLimit,
                    })(
                      <Input />
                    )}
                  </FormItem>
                  :
                <ShowDomInfo name="预计使用年限">{AssetInfoData?AssetInfoData.useLimit:''}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              <ShowDomInfo name="月折旧率">{AssetInfoData?AssetInfoData.monthDepreciationV:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              <ShowDomInfo name="月折旧额">{AssetInfoData?AssetInfoData.monthDepreciationPrice:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`已折月数`} {...formItemLayout}>
                    {getFieldDecorator(`depreciationMonths`,{
                      initialValue: AssetInfoData.depreciationMonths,
                      rules:[{validator:validMonth,max:12*(getFieldValue('useLimit')||0),message:`${getFieldValue('useLimit')?`请输入0-${12*getFieldValue('useLimit')}正整数`:`请先填写预计使用年限`}`}]
                    })(
                        <Input/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="已折月数">{AssetInfoData.depreciationMonths}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              <ShowDomInfo name="剩余月数">{AssetInfoData?AssetInfoData.surplusMonths:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`开始折旧时间`} {...formItemLayout}>
                    {getFieldDecorator(`depreciationBeginDate`,{
                      initialValue: AssetInfoData.depreciationBeginDate?moment(AssetInfoData.depreciationBeginDate,'YYYY-MM'):null
                    })(
                        <DatePicker.MonthPicker allowClear={false}/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="开始折旧时间">{ AssetInfoData.depreciationBeginDate?AssetInfoData.depreciationBeginDate.substr(0,7):'' }</ShowDomInfo>
              }
            </Col>  
          </Row>
        </Form>
        <Modal title='自定义字段' visible={definedMoreModal} onOk={this._submitDefineMore} onCancel={()=>this.setState({definedMoreModal:false})}>
              {
                definedMoreModal?
                <DefineFiledsWapper assetsRecordGuid={this.props.match.params.id} wrappedComponentRef={(form) => this.defineForm = form} ></DefineFiledsWapper>
                :null
              }
        </Modal>      
      </Card>
    )
  }
}


 export default withRouter(connect(null, dispatch => ({
  updateAssetsRecordInfo: (url,values,success,type) => ledgerService.getInfo(url,values,success,type),
}))(Form.create()(DepreInfo)));

class DefineFileds extends Component{

  state={
    backData:null
  }
  componentDidMount(){
    //查询自定义字段
    request(assets.selectCustomFieldZcList,{
      body:querystring.stringify({assetsRecordGuid:this.props.assetsRecordGuid}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          if(data.result.length){

            this.setState({backData:
              {
                list:data.result
              }
            })
          }
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const list = form.getFieldValue('list');
    if (keys.length === 1) {
      return;
    }
    keys.splice(k,1);
    list.splice(k,1);
    console.log('remove before list', list)
    form.setFieldsValue({
      keys,
      list,
    });

  }
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(keys[keys.length-1]+1);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  
  getTep = ()=>{
    const { backData } = this.state;
    const { getFieldDecorator , getFieldValue } = this.props.form;
    const keys = getFieldValue('keys');
    if(keys.length){
      let items =  keys.map((k, index) => {
        return (
          <Row 
          key={index}
          >
            <Col span={10}>
              <FormItem
              {...formItemLayoutWithOutLabel}
              >
                  {getFieldDecorator(`list[${index}].columnName`,{
                    initialValue:backData&&backData.list[index]?backData.list[index].columnName:''
                  })(
                    <Input placeholder="请输入字段名" style={{ width: '80%' }} />
                  )}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem
              {...formItemLayoutWithOutLabel}
              >
              {getFieldDecorator(`list[${index}].columnValue`,{
                initialValue:backData&&backData.list[index]?backData.list[index].columnValue:'',
                // rules:[{required:true,message:'请输入字段值'}]
              })(
                <Input placeholder="请输入字段值" style={{ width: '70%', marginRight: 8 }} />
              )}
  
              {/* 新增按钮 */}
              { index === keys.length -1 && index<19 ? (
                <Icon
                  style={{marginRight: 8}}
                  className="dynamic-delete-button"
                  type="plus-circle-o"
                  onClick={() => this.add(index)}
                />
              ) : null}
              {/* 删除按钮 */}
              {keys.length > 1 ? (
                <Icon
                  style={{marginRight: 8}}
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={keys.length === 1}
                  onClick={() => this.remove(index)}
                />
              ) : null}
            </FormItem>
            </Col>
          </Row>
        );
      });
      return items;
    }
   
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { backData } = this.state;
    getFieldDecorator('keys', { initialValue: backData&&backData.list? backData.list.map((item,index)=>index):[0] });
    // getFieldDecorator('list', { initialValue: backData&&backData.list? backData.list:[{columnName: "1", columnValue: "1"}] });
    return(
      <div>
        {this.getTep()}
      </div>
    )
  }
}

const DefineFiledsWapper = Form.create()(DefineFileds)