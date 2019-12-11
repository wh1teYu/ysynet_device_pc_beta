/**
 * 档案管理-资产档案-详情-基本信息-资产信息
 */
import React, { Component } from 'react';
import { Row , Col , message , Card , Button, Input ,Icon , Form , Select , DatePicker , Modal} from 'antd';
import request from '../../../utils/request';
import { clearNull } from '../../../utils/tools';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { ledger as ledgerService } from '../../../service';
import assets from '../../../api/assets';
import querystring from 'querystring';
import moment, { isMoment } from 'moment';
import { ProductCountry , yesNo , haveNo} from '../../../constants';
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const ShowDomInfo = (props) =>{
  const { name } = props;
  return ( 
    <div style={{height:40,lineHeight:'38px'}}>
      <Col span={6}>{`${name} :`}</Col>
      <Col span={18}>{props.children}</Col>
    </div>
  )
} 
let uuid = 1;
const { TextArea } = Input;
class ModalForm extends Component {

  state={
    useDeptOption:[],//使用科室下拉框
  }
  filterOption = (input, option) => {
    if(option.props.children){
      return option.props.children.indexOf(input) >= 0
    }
    return false
  }

  componentDidMount (){
    //查询机构科室 - 使用科室
    request(assets.selectUseDeptList,{
      body:querystring.stringify({deptType:'00'}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({useDeptOption:data.result})
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
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  getKey = ()=>{
    const { modalFillBack } = this.props;
    let arr = modalFillBack.options.slice(1);
    arr= arr.map((item,index)=>{
      return index+1
    })
    return arr 
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { modalFillBack } = this.props;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    console.log('默认的使用科室',modalFillBack , this.getKey())
    getFieldDecorator('keys', { initialValue:this.getKey() || []});
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <Row key={index}>
          <Col span={16}>
            <FormItem
              {...formItemLayoutWithOutLabel}
              required={false}
              key={`keshi${k}`}
            >
              {getFieldDecorator(`deptGuid[${k}]`, {
                initialValue:modalFillBack.options[k]?modalFillBack.options[k].deptGuid:''
              })(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option)=>this.filterOption(input, option)}
                >
                    <Option value="" key={-1}>全部</Option>
                    {
                        this.state.useDeptOption.map((item,index) => {
                        return <Option key={item.value} value={item.value}>{item.text}</Option>
                        })
                    }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {... formItemLayoutWithOutLabel}
              required={false}
              key={`shareRatio${k}`}
            >
              {getFieldDecorator(`shareRatio[${k}]`, {
                initialValue:modalFillBack.options[k]?modalFillBack.options[k].shareRatio*100 :''
              })(
                  <Input addonAfter='%' style={{width:'60%'}}/>
              )}
              {keys.length > 0 ? (
                <Icon
                  style={{marginLeft:8}}
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={keys.length === 0}
                  onClick={() => this.remove(k)}
                />
              ) : null}
              {
                keys[keys.length-1] === k ?
                (<Icon type="plus" style={{marginLeft:8}} onClick={this.add}/>):null
              } 
            </FormItem>
          </Col>
        </Row>
      );
    });
    return (
      <Form>
        <Row>
          <Col span={16}>
            <FormItem
              {...formItemLayoutWithOutLabel}
              required={false}
              key={`deptGuid0`}
            >
              {getFieldDecorator(`deptGuid[0]`, {
                initialValue:modalFillBack.options?modalFillBack.options[0].deptGuid:''
              })(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option)=>this.filterOption(input, option)}
                  disabled={true}
                >
                    <Option value="" key={-1}>全部</Option>
                    {
                        this.state.useDeptOption.map((item,index) => {
                        return <Option key={item.value} value={item.value}>{item.text}</Option>
                        })
                    }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayoutWithOutLabel}
              required={false}
              key={`shareRatio0`}
            >
              {getFieldDecorator(`shareRatio[0]`, {
                initialValue:modalFillBack.options[0].shareRatio?modalFillBack.options[0].shareRatio*100:'100'
              })(
                  <Input addonAfter='%' style={{width:'70%'}}/>
              )}
              {
                keys.length ===0 ?
                (<Icon type="plus" style={{marginLeft:8}} onClick={this.add}/>):null
              }
            </FormItem>
          </Col>
        </Row>
        

        {formItems}

        {/*
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>*/}
      </Form>
    );
  }
}
const ModalFormWarpper = Form.create()(ModalForm)

class AssetInfo extends Component {
  state={
    editable:false,//编辑状态更改
    visible:false,//共用科室编辑 - 弹层显示状态
    outDeptOptions:[],//供应商下拉框
    modalFillBack:{
      text:'',
      options:[]
    }
  }
  componentDidMount(){
    request(assets.selectFOrgList,{
      body:querystring.stringify({}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({outDeptOptions:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
    this.searchBDept();
  }

  formatEquipmentDeptListText = (arr) => {
    arr = arr.map(item=>{
      return `${item.aDeptName}  ${item.shareRatio*100}%`
    })
    return arr.join(',')
  }

  //查询共用科室-详情
  searchBDept = ()=>{
    request(assets.selectEquipmentDeptList,{
      body:querystring.stringify({assetsRecordGuid:this.props.AssetInfoData.assetsRecordGuid}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
          console.log('hahahha',data)
          if(data && data.status){
            if(data.result.length>0){
              this.setState({modalFillBack:{
                text:this.formatEquipmentDeptListText(data.result),
                options:data.result
              }})
            }else{
              //默认弹窗内容 
              this.setState({modalFillBack:{
                options:[
                  {deptGuid:this.props.AssetInfoData.useDeptCode,shareRatio:null}
                ]
              }})
            }
          }
          // this.setState({modalFillBack:data.result})
      },
      error: err => {console.log(err)}
    })
  }
  handleUpdateAssetsRecordInfo = (data,field) =>{
    console.log(data,'data')
    const { updateAssetsRecordInfo,AssetInfoData } = this.props;
    let params = { };
    params.value = field;
    params.text = data;
    params.assetsRecordGuid = AssetInfoData.assetsRecordGuid;
    console.log(params,'params')
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
  filterProductCountry = (val) => {
    if(val==="00"){
      return '国产'
    }else if (val==="01"){
      return '进口'
    }else{
      return val
    }
  }
  filterOption = (input, option) => {
    if(option.props.children){
      return option.props.children.indexOf(input) >= 0
    }
    return false
  }

  //1-产品信息- 基本信息 - 整体编辑或保存
  handleSubmit = () => {
    // 此处发出请求地址 insertAssetsRecord   获取所有可编辑的数据
    if(this.state.editable){
      const { AssetInfoData } = this.props;
      this.props.form.validateFields((err, values)=>{
        values.assetsRecordGuid=AssetInfoData.assetsRecordGuid;
        values.assetsRecord=AssetInfoData.assetsRecord;

        if(values.productionDate && isMoment(values.productionDate)){
          values.productionDate=moment(values.productionDate).format('YYYY-MM-DD')
        }
        if(values.buyDate && isMoment(values.buyDate)){
          values.buyDate=moment(values.buyDate).format('YYYY-MM-DD')
        }
        if(values.enableDate && isMoment(values.enableDate)){
          values.enableDate=moment(values.enableDate).format('YYYY-MM-DD')
        }
        if(values.contractDate && isMoment(values.contractDate)){
          values.contractDate=moment(values.contractDate).format('YYYY-MM-DD')
        }
        console.log('整体编辑或保存', values);
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
  //点击编辑 - 共用科室 弹窗
  openModal = () =>{
    //selectEquipmentDeptList
    this.setState({visible:true})
  }
  //提交 - 共用科室 弹窗内容
  submitModal = () =>{
    this.refs.modalForm.validateFields((err, values) => {
      if (!err) {
        //insertEquipmentDepreciationDept
        // "assetsRecordGuid" : "****" ; //资产ID
        // "deptList":[{
        //   "deptGuid" : "***" ; //科室ID
        //   "proportion" : "***"; //分摊比例 
        // }]
        console.log('Received values of form: ', values);
        let deptList = [];
        values.deptGuid.map((item,index)=>{
          let ret = {
            deptGuid:item,
            proportion: values.shareRatio[index]
          }
          deptList.push(ret)
          return ret 
        })
        values.deptList = deptList;
        values.assetsRecordGuid = this.props.AssetInfoData.assetsRecordGuid;
        delete values['deptGuid'];
        delete values['keys'];
        delete values['shareRatio'];
        console.log(values)
        request(assets.insertEquipmentDepreciationDept,{
          body:JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json'
          },
          success: data => {
            if(data.status){
              // this.props.freshDetail();
              this.searchBDept();
              this.setState({visible:false})
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
    const { getFieldDecorator } = this.props.form;
    const { AssetInfoData } = this.props;
    const { editable , visible} = this.state;
    const header= (
      <Row>
        <Col span={12}>基本信息</Col>
        <Col span={12} style={{textAlign:'right'}}>
          <Button type='primary' style={{marginRight:15}} onClick={()=>this.handleSubmit()}>{editable? '保存':'编辑'}</Button>
         {
          AssetInfoData.sharedEquipment==='01'?
          <Button type='primary' onClick={()=>this.openModal()}>增加共用科室</Button>
          :null
         }
        </Col>
      </Row>
    )
    return (
      <Card  title={header} style={{marginTop: 16,marginBottom:24}} className='baseInfo-assetInfo'>
        <Form>
          <Row>
            <Col span={8}>
              <ShowDomInfo name="资产名称">{AssetInfoData.equipmentStandardName?AssetInfoData.equipmentStandardName:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`通用名称`} {...formItemLayout}>
                    {getFieldDecorator(`equipmentName`,{
                      initialValue: AssetInfoData.equipmentName
                    })(
                        <Input/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="通用名称">{AssetInfoData.equipmentName}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              <ShowDomInfo name="型号">{AssetInfoData.fmodel?AssetInfoData.fmodel:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              <ShowDomInfo name="规格">{AssetInfoData.spec?AssetInfoData.spec:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              <ShowDomInfo name="注册证号">{AssetInfoData.registerNo?AssetInfoData.registerNo:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              <ShowDomInfo name="品牌">{AssetInfoData.tfBrand?AssetInfoData.tfBrand:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              <ShowDomInfo name="计量单位">{AssetInfoData.meteringUnit?AssetInfoData.meteringUnit:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              <ShowDomInfo name="管理科室">{AssetInfoData.useDept?AssetInfoData.bDept:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              <ShowDomInfo name="使用科室">{AssetInfoData.useDept?AssetInfoData.useDept:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`存放地址`} {...formItemLayout}>
                    {getFieldDecorator(`deposit`,{
                      initialValue: AssetInfoData.deposit
                    })(
                        <Input/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="存放地址">{AssetInfoData.deposit}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`保管员`} {...formItemLayout}>
                    {getFieldDecorator(`custodian`,{
                      initialValue: AssetInfoData.custodian
                    })(
                        <Input/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="保管员">{AssetInfoData.custodian}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              <ShowDomInfo name="物资分类">{AssetInfoData.typeName?AssetInfoData.typeName:''}</ShowDomInfo>
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`生产商国家`} {...formItemLayout}>
                    {getFieldDecorator(`productCountry`,{
                      initialValue: AssetInfoData.productCountry
                    })(
                        <Select>
                          {
                            ProductCountry.map((item)=><Option key={item.value} value={item.value}>{item.text}</Option>)
                          }
                        </Select>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="生产商国家">{this.filterProductCountry(AssetInfoData.productCountry)}</ShowDomInfo>
              }
            </Col>  
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`生产商`} {...formItemLayout}>
                    {getFieldDecorator(`product`,{
                      initialValue: AssetInfoData.product
                    })(
                        <Input/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="生产商">{AssetInfoData.product}</ShowDomInfo>
              }
            </Col>  
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`出厂日期`} {...formItemLayout}>
                    {getFieldDecorator(`productionDate`,{
                      initialValue: AssetInfoData.productionDate?moment(AssetInfoData.productionDate,'YYYY-MM'):null
                    })(
                        <DatePicker/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="出厂日期">{ AssetInfoData.productionDate?AssetInfoData.productionDate.split(' ')[0]:'' }</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`供应商`} {...formItemLayout}>
                    {getFieldDecorator(`fOrgId`,{
                      initialValue: AssetInfoData.fOrgId
                    })(
                      <Select 
                      showSearch
                      placeholder={'请选择'}
                      optionFilterProp="children"
                      filterOption={(input, option)=>this.filterOption(input, option)}
                      >
                          <Option value="" key={-1}>全部</Option>
                          {
                              this.state.outDeptOptions.map((item,index) => {
                              return <Option key={item.orgId} value={item.orgId}>{item.orgName}</Option>
                              })
                          }
                      </Select>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="供应商">{this.filterProductCountry(AssetInfoData.fOrgName)}</ShowDomInfo>
              }
            </Col>   
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`购买金额`} {...formItemLayout}>
                    {getFieldDecorator(`buyPrice`,{
                      initialValue: AssetInfoData.buyPrice
                    })(
                      <Input type='number'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="购买金额">{AssetInfoData.buyPrice}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`出厂编号`} {...formItemLayout}>
                    {getFieldDecorator(`eqProductNo`,{
                      initialValue: AssetInfoData.eqProductNo?AssetInfoData.eqProductNo:null
                    })(
                        <Input/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="出厂编号">{AssetInfoData.eqProductNo}</ShowDomInfo>
              }
            </Col> 
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`购置日期`} {...formItemLayout}>
                    {getFieldDecorator(`buyDate`,{
                      initialValue: null
                    })(
                        <DatePicker/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="购置日期">{AssetInfoData.buyDate?AssetInfoData.buyDate.substr(0,10):''}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`启用日期`} {...formItemLayout}>
                    {getFieldDecorator(`enableDate`,{
                      initialValue: null
                    })(
                        <DatePicker/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="启用日期">{AssetInfoData.enableDate?AssetInfoData.enableDate.substr(0,10):''}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`案卷编号`} {...formItemLayout}>
                    {getFieldDecorator(`caseNo`,{
                      initialValue: AssetInfoData.caseNo?AssetInfoData.caseNo:null
                    })(
                        <Input/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="案卷编号">{AssetInfoData.caseNo}</ShowDomInfo>
              }
            </Col> 
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`购入方式`} {...formItemLayout}>
                    {getFieldDecorator(`buyType`,{
                      initialValue: AssetInfoData.buyType?AssetInfoData.buyType==="00"?'招标采购':'议价采购':null
                    })(
                        <Select>
                          <Option value='00'>招标采购</Option>
                          <Option value='01'>议价采购</Option>
                        </Select>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="购入方式">{AssetInfoData.buyType?AssetInfoData.buyType==="00"?'招标采购':'议价采购':''}</ShowDomInfo>
              }
            </Col> 
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`合同编号`} {...formItemLayout}>
                    {getFieldDecorator(`contractNo`,{
                      initialValue: AssetInfoData.contractNo
                    })(
                        <Input/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="合同编号">{AssetInfoData.contractNo}</ShowDomInfo>
              }
            </Col> 
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`合同签订日期`} {...formItemLayout}>
                    {getFieldDecorator(`contractDate`,{
                      initialValue: AssetInfoData.contractDate?moment(AssetInfoData.contractDate,'YYYY-MM'):null
                    })(
                        <DatePicker/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="合同签订日期">{AssetInfoData.contractDate?AssetInfoData.contractDate.substr(0,11):''}</ShowDomInfo>
              }
            </Col>
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`计量设备`} {...formItemLayout}>
                    {getFieldDecorator(`askJlFlag`,{
                      initialValue: AssetInfoData.askJlFlag?AssetInfoData.askJlFlag:null
                    })(
                        <Select>
                          <Option key='01' value='01'>是</Option>
                          <Option key='00' value='00'>否</Option>
                        </Select>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="计量设备">{yesNo[AssetInfoData.askJlFlag]}</ShowDomInfo>
              }
            </Col>  
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`公用设备`} {...formItemLayout}>
                    {getFieldDecorator(`publicEquipment`,{
                      initialValue: AssetInfoData.publicEquipment?AssetInfoData.publicEquipment:null
                    })(
                        <Select>
                          <Option key='01' value='01'>是</Option>
                          <Option key='00' value='00'>否</Option>
                        </Select>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="公用设备">{yesNo[AssetInfoData.publicEquipment]}</ShowDomInfo>
              }
            </Col> 
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`借用单价`} {...formItemLayout}>
                    {getFieldDecorator(`rentingPrice`,{
                      initialValue: AssetInfoData.rentingPrice
                    })(
                        <Input  type='number' addonAfter='元/小时'/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="借用单价">{AssetInfoData && AssetInfoData.rentingPrice?`${AssetInfoData.rentingPrice}元/小时`:''}</ShowDomInfo>
              }
            </Col>  
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`有无备用`} {...formItemLayout}>
                    {getFieldDecorator(`spare`,{
                      initialValue: AssetInfoData.spare
                    })(
                        <Select>
                          <Option key='01' value='01'>有</Option>
                          <Option key='00' value='00'>无</Option>
                        </Select>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="有无备用">{haveNo[AssetInfoData.spare]}</ShowDomInfo>
              }
            </Col> 
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`共用设备`} {...formItemLayout}>
                    {getFieldDecorator(`sharedEquipment`,{
                      initialValue: AssetInfoData.sharedEquipment?AssetInfoData.sharedEquipment:null
                    })(
                        <Select>
                          <Option key='01' value='01'>是</Option>
                          <Option key='00' value='00'>否</Option>
                        </Select>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="共用设备">{yesNo[AssetInfoData.sharedEquipment]}</ShowDomInfo>
              }
            </Col> 
            {
              AssetInfoData.sharedEquipment==='01'?
              <Col span={8}>
              <ShowDomInfo name="共用科室">
                <p style={{width:'80%', overflow:  'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis'}}>
                  {this.state.modalFillBack?this.state.modalFillBack.text?this.state.modalFillBack.text:'':''}
                </p>
                <a style={{float:'right',position: 'absolute',right: 10,top:0}} onClick={()=>this.openModal()}>编辑</a>
              </ShowDomInfo>
              </Col>:null
            }
            <Col span={8}>
              {
                editable? 
                  <FormItem label={`三方系统编码`} {...formItemLayout}>
                    {getFieldDecorator(`fcode`,{
                      initialValue: AssetInfoData.fcode?AssetInfoData.fcode:null
                    })(
                      <TextArea rows={2} maxLength={200}/>
                    )}
                  </FormItem>
                  :<ShowDomInfo name="三方系统编码">{AssetInfoData.fcode}</ShowDomInfo>
              }
            </Col> 
            
          </Row>
        </Form>
        {/*上一版本的老结构
          <Row type="flex" className={styles['table-row']} style={{marginTop:25}}>
            <Col span={4} className={styles['table-span']}>资产名称</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.equipmentStandardName }</Col>
            <Col span={4} className={styles['table-span']}>资产编号</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.assetsRecord }</Col>
            <Col span={4} className={styles['table-span']}>通用名称</Col>
            <Col span={8} className={styles['table-span']}><InputWrapper onEndEdit={(data) => this.handleUpdateAssetsRecordInfo(data,'EQUIPMENT_NAME')} text={ AssetInfoData.equipmentName } /></Col>
            <Col span={4} className={styles['table-span']}>状态</Col>
            <Col span={8} className={styles['table-span']}>{  AssetInfoData.useFstate ? ledgerData[AssetInfoData.useFstate].text :null }</Col>
            <Col span={4} className={styles['table-span']}>型号</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.spec }</Col>
            <Col span={4} className={styles['table-span']}>规格</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.fmodel }</Col>
            <Col span={4} className={styles['table-span']}>资产分类</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.productType ? productTypeData[AssetInfoData.productType].text : null }</Col>
            <Col span={4} className={styles['table-span']}>使用科室</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.useDept }</Col>
            <Col span={4} className={styles['table-span']}>保管员</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.custodian }</Col>
            <Col span={4} className={styles['table-span']}>存放地址</Col>
            <Col span={8} className={styles['table-span']}><InputWrapper text={ AssetInfoData.deposit} onEndEdit={(data) => this.handleUpdateAssetsRecordInfo(data,'DEPOSIT')}/></Col>
            <Col span={4} className={styles['table-span']}>管理科室</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.bDept }</Col>
            <Col span={4} className={styles['table-span']}>注册证号</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.registerNo }</Col>
            <Col span={4} className={styles['table-span']}>品牌</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.tfBrand }</Col>
            <Col span={4} className={styles['table-span']}>生产商</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.product }</Col>
            <Col span={4} className={styles['table-span']}>生产商国家</Col>
            <Col span={8} className={styles['table-span']}>{ this.filterProductCountry(AssetInfoData.productCountry) }</Col>
            <Col span={4} className={styles['table-span']}>出厂日期</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.productionDate?AssetInfoData.productionDate.split(' ')[0]:'' }</Col>
            <Col span={4} className={styles['table-span']}>供应商</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.fOrgName }</Col>
            <Col span={4} className={styles['table-span']}>购置日期</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.buyDate }</Col>
            <Col span={4} className={styles['table-span']}>合同编号</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.contractNo }</Col>
            <Col span={4} className={styles['table-span']}>计量单位</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.meteringUnit }</Col>
            <Col span={4} className={styles['table-span']}>购买金额</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.buyPrice }</Col>
            <Col span={4} className={styles['table-span']}>安装费</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.installPrice }</Col>
            <Col span={4} className={styles['table-span']}>经费来源</Col>
            <Col span={8} className={styles['table-span']}>{ AssetInfoData.sourceFunds ? certSourceFunds[AssetInfoData.sourceFunds].text : null }</Col>
            <Col span={4} className={styles['table-span']}>维修分类</Col>
            <Col span={8} className={styles['table-span']}><InputWrapper text={ AssetInfoData.rrpairType } onEndEdit={(data) => this.handleUpdateAssetsRecordInfo(data,'RRPAIR_TYPE')} /></Col>
            <Col span={4} className={styles['table-span']}>保养分类</Col>
            <Col span={8} className={styles['table-span']}><InputWrapper text={ AssetInfoData.maintainType } onEndEdit={(data) => this.handleUpdateAssetsRecordInfo(data,'MAINTAIN_TYPE')} /></Col>
            <Col span={4} className={styles['table-span']}>计量分类</Col>
            <Col span={8} className={styles['table-span']}><InputWrapper text={ AssetInfoData.meteringType } onEndEdit={(data) => this.handleUpdateAssetsRecordInfo(data,'METERING_TYPE')} /></Col>
            <Col span={4} className={styles['table-span']}>保养周期</Col>
            <Col span={8} className={styles['table-span']}><InputWrapper text={ AssetInfoData.maintainDay } onEndEdit={(data) => this.handleUpdateAssetsRecordInfo(data,'MAINTAIN_DAY')} /></Col>
          
            <Col span={4} className={styles['table-span']}>有无备用</Col>
            <Col span={8} className={styles['table-span']}><InputWrapper text={ AssetInfoData.spare } onEndEdit={(data) => this.handleUpdateAssetsRecordInfo(data,'SPARE')} /></Col>
          </Row>
        */}  

        <Modal visible={visible} title='维护共用科室' 
          destroyOnClose={true}
          onOk={ () => this.submitModal()} 
          onCancel={ () =>  this.setState({visible:false}) }>
            <ModalFormWarpper ref='modalForm' AssetInfoData={AssetInfoData} modalFillBack={this.state.modalFillBack} ></ModalFormWarpper>    
        </Modal>
      </Card>
    )
  }
}


 export default withRouter(connect(null, dispatch => ({
  updateAssetsRecordInfo: (url,values,success,type) => ledgerService.getInfo(url,values,success,type),
}))(Form.create()(AssetInfo)));


