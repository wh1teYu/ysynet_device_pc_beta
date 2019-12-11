/*
 * @Author: yuwei  - 新建设备采购申请
 * @Date: 2018-07-11 11:33:17 
* @Last Modified time: 2018-07-11 11:33:17 
 */
import React, { Component } from 'react';
import { Row,Col,Input, Layout,Button,message,Form,Select,Icon} from 'antd';
import deptwork from '../../../api/deptwork';
import { CommonData , validMoney , validAmount } from '../../../utils/tools';
import request from '../../../utils/request';
import queryString from 'querystring';
import { fundsSourceSelect } from '../../../constants';
import Style from './styles.css'; 
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const formItemLayoutLine = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const formItemLayoutLine2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
let uuid = 1;
class AddEquipProcurement extends Component {
  state={
    query:{},
    unitList:[],
    manageSelect:[],
    outDeptOptions: [],
    postFile:[],
    editStatus:false,
    editStatusText:'新建设备采购申请',
    bDeptName:"",
    fillBackData:null,//编辑的时候填充
  }
  componentDidMount = () => {
    console.log('this.props')
    if(this.props.match.params.id){
      console.log('编辑状态')
      this.setState({
        editStatusText:'编辑设备采购申请',
        editStatus:true,
      })
      request(deptwork.queryApplyZc,{
        body:JSON.stringify({applyId:this.props.match.params.id}),
        headers: {
          'Content-Type': 'application/json'
        },
        success: data => {
          if(data.status){
            this.setState({fillBackData:data.result})
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      })
    }
    this.getManageSelect();
    this.outDeptSelect();
    CommonData('UNIT', (data) => {
      this.setState({unitList:data.rows || data})
    })
  }
  getManageSelect = () => {
    request(deptwork.selectUseDeptList,{
      body:queryString.stringify({deptType:"01"}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({manageSelect:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  outDeptSelect = () => {
    request(deptwork.queryDeptListByUserId,{
      body:queryString.stringify({}),
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
  }
  handleSubmit = () =>{
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if(!err){
        let url = deptwork.insertApplyZc ; 
        if(this.state.editStatus){//编辑状态
          url = deptwork.updateApplyZc;
          values = Object.assign(this.state.fillBackData,values);
          values.applyDetailZclist = values.applyDetailZclist.filter(item=>item);//动态表单
          delete values.createTime;
          delete values.detaliList;//删除动态数据
          delete values.purchaseName;
          values.fstate="00";
          values.allowType="00";
        }else{//新增
          values.bDeptName=this.state.bDeptName;
          values.fstate="00";
          values.allowType="00";
          values.applyDetailZclist = values.applyDetailZclist.filter(item=>item);//动态表单
          delete values['keys']
        }
        console.log(JSON.stringify(values))
        request(url,{
          body:JSON.stringify(values),
          headers: {
              'Content-Type': 'application/json'
          },
          success: data => {
            if(data.status){
              message.success('保存成功！');
              const {history} = this.props;
              history.push('/deptWork/equipProcurement')
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      }
    })
  }
  goBack = ()=>{
    const { history } = this.props;
    history.push('/deptWork/equipProcurement');
  }

  filterOption = (input, option) => {
    if(option.props.children){
      return option.props.children.indexOf(input) >= 0
    }
    return false
  }

  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    let { fillBackData } = this.state;
    if(fillBackData){ //如果在编辑状态中新增动态表单  对detaliList的K个进行删除
      let newActionList =  fillBackData.detaliList;
      newActionList.slice(k,1);
      let newActionData =  Object.assign(fillBackData,{detaliList:newActionList})
      this.setState({fillBackData:JSON.parse(JSON.stringify(newActionData))})
    }

    console.log( keys.filter(key => key !== k))
    // can use data-binding to set
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
    let { fillBackData } = this.state;
    if(fillBackData){ //如果在编辑状态中新增动态表单  对detaliList的K个进行初始赋值
      let newItem = {
        "materialName":"",
        "budgetPrice":'',
        "recommendProduct":"",
        "recommendFmodel":""
      }
      let newActionList =  fillBackData.detaliList;
      newActionList.push(newItem);
      let newActionData =  Object.assign(fillBackData,{detaliList:newActionList})
      this.setState({fillBackData:JSON.parse(JSON.stringify(newActionData))})
    }
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  getTmp = () =>{
    const { fillBackData } = this.state;
    const { getFieldDecorator , getFieldValue } = this.props.form;
    if(fillBackData&&fillBackData.detaliList){
      const { detaliList } = this.state.fillBackData;
      if(detaliList){
        uuid = detaliList.length;
        //回显编辑的时候
        let initArr = detaliList.map((item,index)=>{return index})
        this.props.form.getFieldDecorator('keys', { initialValue: initArr });
        // this.props.form.getFieldDecorator('applyDetailZclist', { initialValue: detaliList });
      }else{
        getFieldDecorator('keys', { initialValue: [0] });
      }
    }else{
      getFieldDecorator('keys', { initialValue: [0] });
    }
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <div key={index}>
          <h4 style={{padding: '0 17% 0 11.5%'}}>
            推荐产品{index?index:''}
            <span className={Style.fr}>
             { k>keys[0]?
              <a onClick={()=>this.remove(k)}>删除</a>
              :null}
            </span>
          </h4>
          <FormItem
            {...formItemLayout}
            label="产品名称"
            >
            {getFieldDecorator(`applyDetailZclist[${k}].materialName`,{
              initialValue:fillBackData&&fillBackData.detaliList?fillBackData.detaliList[k].materialName:'',
              rules:[{required:true,message:'请选择产品名称'}]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="推荐型号"
            >
            {getFieldDecorator(`applyDetailZclist[${k}].recommendFmodel`,{
              initialValue:fillBackData&&fillBackData.detaliList?fillBackData.detaliList[k].recommendFmodel:'',
            })(
              <Input.TextArea rows={2} maxLength={200}>
              </Input.TextArea>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="预算单价"
            >
            {getFieldDecorator(`applyDetailZclist[${k}].budgetPrice`,{
              initialValue:fillBackData&&fillBackData.detaliList?fillBackData.detaliList[k].budgetPrice:'',
              rules:[{required:true,message:'请填写预算单价'},{validator:validMoney}]
            })(
              <Input style={{width:200}}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="推荐厂商"
            >
            {getFieldDecorator(`applyDetailZclist[${k}].recommendProduct`,{
              initialValue:fillBackData&&fillBackData.detaliList?fillBackData.detaliList[k].recommendProduct:'',
            })(
              <Input.TextArea rows={2} maxLength={200}>
              </Input.TextArea>
            )}
          </FormItem>
          <hr className={Style.hr} style={{margin:' 0 16% 0 10%'}}/>
        </div>
      );
    });
    return formItems
  }

  render() {
    const { getFieldDecorator , getFieldValue } = this.props.form;
    const keys = getFieldValue('keys');
    const { unitList , editStatusText , fillBackData , editStatus  } = this.state; //  editStatus 编辑状态 true为编辑  false 为新增
    const unitOption =  unitList.map(item=>(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>))
    
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <h3 style={{padding:'24px'}}>{editStatusText}  
          <Button style={{float:'right'}} onClick={()=>this.goBack()}>取消</Button>
          <Button type='primary' style={{float:'right',marginRight:8}} onClick={()=>this.handleSubmit()}>确认</Button>
        </h3>

        <Form  onSubmit={this.handleSearch}>
            <Row>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="申请科室"
                >
                  {getFieldDecorator('deptGuid',{
                    initialValue:fillBackData?fillBackData.deptGuid:'',//this.state.outDeptOptions.length>0?this.state.outDeptOptions[0].value:'
                    rules:[{required:true,message:'请选择申请科室'}]
                  })(
                    <Select 
                      showSearch
                      placeholder={'请选择'}
                      optionFilterProp="children"
                      filterOption={(input, option)=>this.filterOption(input, option)}
                      >
                          {
                              this.state.outDeptOptions.map((item,index) => {
                              return <Option key={item.value} value={item.value}>{item.text}</Option>
                              })
                          }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine2}
                  label="管理科室"
                >
                  {getFieldDecorator('bDeptGuid',{
                    initialValue:fillBackData?fillBackData.bDeptGuid:'',
                    rules:[{required:true,message:'请选择管理科室'}]
                  })(
                    <Select 
                      disabled={editStatus}
                      showSearch
                      placeholder={'请选择'}
                      optionFilterProp="children"
                      filterOption={(input, option)=>this.filterOption(input, option)}
                      onSelect={(input, option)=>{
                        this.setState({bDeptName:option.props.children})
                      }}
                      >
                          {
                              this.state.manageSelect.map((item,index) => {
                              return <Option key={item.value} value={item.value}>{item.text}</Option>
                              })
                          }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="申请人"
                >
                  {getFieldDecorator('applyUserId',{
                    initialValue:fillBackData?fillBackData.applyUserId:'',
                    rules:[{required:true,message:'请填写申请人'}]
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine2}
                  label="单位"
                >
                  {getFieldDecorator('purchaseUnit',{
                    initialValue:fillBackData?fillBackData.purchaseUnit:'',
                    rules:[{required:true,message:'请选择单位'}]
                  })(
                    <Select 
                      showSearch
                      placeholder={'请选择'}
                      optionFilterProp="children"
                      filterOption={(input, option)=>this.filterOption(input, option)}
                      >
                        {unitOption}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="申购数量"
                >
                  {getFieldDecorator('amount',{
                    initialValue:fillBackData?fillBackData.amount:'',
                    rules:[{required:true,message:'请填写申购数量'},{validator:validAmount}]
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine2}
                  label="预算总金额"
                >
                  {getFieldDecorator('totalBudgetPrice',{
                    initialValue:fillBackData?fillBackData.totalBudgetPrice:'',
                    rules:[{validator:validMoney}]
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="经费来源"
                >
                  {getFieldDecorator('fundsSource',{
                    initialValue:fillBackData?fillBackData.fundsSource:'',
                  })(
                    <Select>
                    {
                      fundsSourceSelect.map((item)=>(<Option key={item.value} value={item.value}>{item.text}</Option>))
                    }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            {/* 动态表单 */}
            {this.getTmp()}
            {
              keys&&keys.length>=8?null:
              (
                <Row style={{textAlign: 'center',padding: 12}}>
                <Button  onClick={this.add}> <Icon type="plus" theme="outlined"/>增加推荐产品</Button>
              </Row>  
              )
            }
            <FormItem
              {...formItemLayout}
              label="申购理由"
              >
              {getFieldDecorator('buyReason',{
                initialValue:fillBackData?fillBackData.buyReason:'',
              })(
                <Input.TextArea rows={5} maxLength={500}>
                </Input.TextArea>
              )}
            </FormItem>
        </Form>
      </Content>
    )
  }
}
export default Form.create()(AddEquipProcurement);