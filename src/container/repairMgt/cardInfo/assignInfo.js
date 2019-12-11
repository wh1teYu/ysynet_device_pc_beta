/**
 * @file 指派信息 Card
 */
import React, { PureComponent } from 'react';
import { Row, Col, Radio, Form, Select, DatePicker, Input , message } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import request from '../../../utils/request';
import queryString from 'querystring';
import ledger from '../../../api/ledger';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
const gridStyle = {
  label: {
    span: 4,
    style: { textAlign: 'right', height: 50, lineHeight: '50px' }
  }, 
  content: {
    span: 8,
    style: { textAlign: 'left', height: 50, lineHeight: '50px' }
  }
}
// 内修
class InsideRepairForm extends PureComponent {

  state ={
    userNameList:[]
  }
  componentWillMount (){
    request(ledger.selectUserNameList,{
      body:queryString.stringify({}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({userNameList:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }

  render() {
    const { isEdit, data , wxrEditable} = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row type='flex'>
          <Col {...gridStyle.label}>维修组：</Col>
          <Col {...gridStyle.content}>
            {
              getFieldDecorator('callDeptCode',{
                initialValue: isEdit? null : data.callDeptCode
              })(
                isEdit ? <span> { data.callDeptCode } </span> : 
                <Select allowClear disabled={true}>
                  <Option value={"0"}>维修组1</Option>
                  <Option value={"1"}>维修组2</Option>
                  <Option value={"2"}>维修组3</Option>
                  <Option value={"3"}>维修组4</Option>
                </Select>
            )}
          </Col>
          <Col {...gridStyle.label}>维修人：</Col>
          <Col {...gridStyle.content}>
            {
                wxrEditable==="50"  ? <span> { data.inRrpairUsername } </span> :
                <Select 
                showSearch
                defaultValue={data.inRrpairUserid}
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                onSelect={(input, option) => {
                  console.log(option)
                  this.props.setOtherState({
                    inRrpairUsername: option.props.children.split('-')[1],
                    inRrpairUserid:option.props.value,
                  })
                }}
                >
                  {
                    this.state.userNameList.map((item,index) => {
                    return <Option key={index} value={item.value}>{`${item.deptName?item.deptName:''}-${item.userName?item.userName:''}`}</Option>
                    })
                  }
                </Select>
              }
          </Col>
          <Col {...gridStyle.label}>预期完成时间：</Col>
          <Col span={20} style={gridStyle.content.style}>
            {
              getFieldDecorator('completTime',{
                initialValue: isEdit ? null:data.completTime=== "" || data.completTime === null? null: moment(data.completTime,'YYYY-MM-DD')
              })(
                isEdit ? <span> { data.completTime } </span> : <DatePicker />
            )}
          </Col>
          <Col span={4} style={{marginTop: 20, textAlign: 'right'}}>指派备注：</Col>
          <Col span={20} style={{marginTop: 20}}>
            {
              getFieldDecorator('tfRemarkZp',{
                initialValue: isEdit? null : data.tfRemarkZp
              })(
                isEdit ? <span> { data.tfRemarkZp } </span> : 
                <TextArea rows={4} style={{width: '100%'}} />
            )}
          </Col>
        </Row>
      </Form>  
    )
  }
}

// 外修
class OutsideRepairForm extends PureComponent {
  render() {
    const { isEdit, data } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row type='flex'>
          <Col {...gridStyle.label}>指派服务商：</Col>
          <Col {...gridStyle.content}>
            {
              getFieldDecorator('outOrg',{
                initialValue: isEdit ? null: data.outOrg 
              })(
                isEdit ? <span> { data.outOrg } </span> : 
                <Input placeholder='输入服务商'/>
            )}
          </Col>
          <Col {...gridStyle.label}>维修联系电话：</Col>
          <Col {...gridStyle.content}>
            {
              getFieldDecorator('outRrpairPhone',{
                initialValue: isEdit ? null: data.outRrpairPhone 
              })(
                isEdit ? <span> { data.outRrpairPhone } </span> : 
                <Input placeholder='输入联系电话'/>
            )}
          </Col>
          <Col {...gridStyle.label}>预期完成时间：</Col>
          <Col span={20} style={gridStyle.content.style}>
            {
              getFieldDecorator('completTime',{
                initialValue: isEdit ? null:data.completTime=== "" || data.completTime === null? null: moment(data.completTime,'YYYY-MM-DD')
              })(
                isEdit ? <span> { data.completTime } </span> : 
                <DatePicker style={{width:'40%'}}/>
            )}
          </Col>
          <Col span={4} style={{marginTop: 20, textAlign: 'right'}}>指派备注：</Col>
          <Col span={20} style={{marginTop: 20}}>
            {
              getFieldDecorator('tfRemarkZp',{
                initialValue: isEdit ? null: data.tfRemarkZp 
              })(
                isEdit ? <span> { data.tfRemarkZp } </span> : 
                <TextArea rows={4} style={{width: '100%'}} />
            )}
          </Col>
        </Row>
      </Form> 
    )
  }
}

// 关闭
class CloseRepairForm extends PureComponent {
  render() {
    const { isEdit, data } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row type='flex'>
          <Col {...gridStyle.label}>关闭原因：</Col>
          <Col {...gridStyle.content}>
            {
              getFieldDecorator('offCause')(
                isEdit ? <span> { data.offCause } </span> : 
                <Select allowClear>
                  <Option value={"0"}>关闭原因1</Option>
                  <Option value={"1"}>关闭原因2</Option>
                  <Option value={"2"}>关闭原因3</Option>
                  <Option value={"3"}>关闭原因3</Option>
                </Select>
            )}
          </Col>
          <Col {...gridStyle.label}>后续处理：</Col>
          <Col {...gridStyle.content}>
            {
              getFieldDecorator('followupTreatment')(
                isEdit ? <span> { data.followupTreatment } </span> : 
                <Select allowClear>
                  <Option value={"0"}>后续处理4</Option>
                  <Option value={"1"}>后续处理3</Option>
                  <Option value={"2"}>后续处理2</Option>
                  <Option value={"3"}>后续处理1</Option>
                </Select>
            )}
          </Col>
          <Col span={4} style={{marginTop: 20, textAlign: 'right'}}>关闭备注：</Col>
          <Col span={20} style={{marginTop: 20}}>
            {
              getFieldDecorator('tfRemarkGb')(
                isEdit ? <span> { data.tfRemarkGb } </span> : 
                <TextArea rows={4} style={{width: '100%'}} />
            )}
          </Col>
        </Row>
      </Form> 
    )
  }
}

class AssignInfo extends PureComponent {
  static defaultProps = {
    isEdit: false,
    data: {}
  };
  static propTypes = {
    isEdit: PropTypes.bool,
    data: PropTypes.object
  };
  constructor(props) {
    super(props)
    this.state = {
      rrpairType: this.props.rrpairType || '00',
      OtherState:{},
      FormWrapper: null
    }
  }
  componentDidMount () {
    const { rrpairType } = this.state;
    if (rrpairType === "00") {
      this.setState({
        FormWrapper: Form.create()(InsideRepairForm)
      })
    } else {
      this.setState({
        FormWrapper: Form.create()(CloseRepairForm)
      })
    }
    //const FormWrapper1 = Form.create()(InsideRepairForm);
    //} else if (rrpairType === "01") {
    // const FormWrapper2 = Form.create()(OutsideRepairForm);
    //} else {
    //const FormWrapper3 = Form.create()(CloseRepairForm);
    //}
  }
  
  postData = () => {
    const { rrpairType , OtherState } = this.state;
    const data = this.wrapperForm.props.form.getFieldsValue();
    if(this.state.rrpairType!=='02'){
      data.completTime =  data.completTime === undefined || data.completTime === null?'':data.completTime.format('YYYY-MM-DD');
    }
    console.log(OtherState);
    let ret = Object.assign({...data, rrpairType: rrpairType},OtherState);
    return ret
  }
  _getForm = type => {
    switch (type) {
      case '00':
        return Form.create()(InsideRepairForm)
      case '01':
        return Form.create()(OutsideRepairForm) 
      default:
        return Form.create()(CloseRepairForm)
    }
  }
  render() {
    const { rrpairType, FormWrapper } = this.state;
    const { isEdit, data , wxrEditable } = this.props;
    const props = {
      isEdit,
      data,
      wxrEditable,
      setOtherState: OtherState=> {
        console.log(OtherState)
        this.setState({ OtherState })
      }
    }
    return (
      <div>
        <Row type="flex">
          <Col {...gridStyle.label}>维修方式：</Col>
          <Col span={16} style={gridStyle.content.style}>
            {
              <RadioGroup defaultValue={rrpairType} onChange={e => {
                this.setState({rrpairType: e.target.value, FormWrapper: this._getForm(e.target.value)})
              }}>
                <RadioButton value="00" disabled={isEdit && rrpairType !== '00'}>内修</RadioButton>
               {/* <RadioButton value="01" disabled={isEdit && rrpairType !== '01'}>外修</RadioButton>*/}
                <RadioButton value="02" disabled={isEdit && rrpairType !== '02'}>关闭</RadioButton>
              </RadioGroup>
            }
          </Col>
        </Row> 
        {
          FormWrapper ? 
          <FormWrapper {...props} wrappedComponentRef= {(inst) => this.wrapperForm = inst}/>
          : null
        }
      </div>
    )
  }
}

export default AssignInfo;