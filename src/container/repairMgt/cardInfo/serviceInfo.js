/**
 * @file 维修信息 Card
 */
import React, { PureComponent } from 'react';
import { Row, Col, Radio, Form, Select, Input } from 'antd';
import PropTypes from 'prop-types';
import { selectOption } from '../../../constants';

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
  
  handleRepairResultChange = (val) => {
    const { callBack } = this.props;
    if(!callBack) return ;
    if (val === '02') {
      this.props.callBack("90"); //关闭按钮
    } else {
      this.props.callBack("50"); //完成按钮
    }
    this.props.data.repairResult = val;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isEdit, data , showOutSide} = this.props;
    const Comp = data.repairResult === '02' ? [
      <Col {...gridStyle.label} key={1}>关闭原因：</Col>,
      <Col {...gridStyle.content} key={2}>
        {
          getFieldDecorator('offCause',{
            initialValue: isEdit ? data.offCause : null
          })(
            isEdit ?
            <Select allowClear>
              {
                selectOption.offCause.map((item, index) => (
                  <Option value={item.value} key={index}> { item.text } </Option>
                ))
              }
            </Select>
            :
            <span> {data.offCause} </span> 
        )}
      </Col>,
      <Col {...gridStyle.label} key={3}>后续处理：</Col>,
      <Col {...gridStyle.content} key={4}>
        {
          getFieldDecorator('followupTreatment',{
            initialValue: isEdit ? data.followupTreatment : null
          })(
            isEdit ? 
            <Select allowClear>
              {
                selectOption.followupTreatment.map((item, index) => (
                  <Option value={item.value} key={index}> { item.text } </Option>
                ))
              }
            </Select>
            :
            <span> {data.followupTreatment} </span> 
        )}
      </Col>,
      <Col span={4} style={{marginTop: 20, textAlign: 'right'}} key={5}>关闭备注：</Col>,
      <Col span={20} style={{marginTop: 20}} key={6}>
        {
          getFieldDecorator('tfRemarkGb',{
            initialValue: isEdit ? data.tfRemarkGb : null
          })(
            isEdit ?
            <TextArea rows={4} style={{width: '100%'}} />
            :
            <span> {data.tfRemarkGb} </span>
        )}
      </Col>
    ] : [
      <Col span={4} style={{marginTop: 20, textAlign: 'right'}} key={7}>维修备注：</Col>,
      <Col span={20} style={{marginTop: 20}} key={8}>
        {
          getFieldDecorator('tfRemarkWx',{
            initialValue: isEdit ? data.tfRemarkWx : null
          })(
            isEdit ? 
            <TextArea rows={4} style={{width: '100%'}} />
            :
            <span> {data.tfRemarkWx} </span> 
        )}
      </Col>
    ];
    return (
      <Form>
         {
          showOutSide?
          (
            <Row>
              <Col {...gridStyle.label}>维修厂家：</Col>
              <Col {...gridStyle.content}>
              {
                  isEdit ? 
                    getFieldDecorator('outOrg',{
                      initialValue: isEdit ? data.outOrg : null
                    })(
                      <Input placeholder='请输入维修厂家'/>
                    )
                    :
                    <span> { data.outOrg || ''} </span>
                }
              </Col>
            </Row>
          ):null
        } 
        <Row type='flex'>
          <Col {...gridStyle.label}>维修结果：</Col>
          <Col {...gridStyle.content}>
            {
              getFieldDecorator('repairResult',{
                initialValue: isEdit ? data.repairResult : null
              })(
                isEdit ? 
                <Select allowClear onChange={this.handleRepairResultChange}>
                  {
                    selectOption.repairResult.map((item, index) => (
                      <Option value={item.value} key={index}> { item.text } </Option>
                    ))
                  }
                </Select>
                :
                <span> { selectOption.repairResult.map((item,index)=>item.value=== data.repairResult ?item.text:'')} </span>
            )}
          </Col>
          <Col {...gridStyle.label}>维修人电话：</Col>
          <Col {...gridStyle.content}>
            {
              getFieldDecorator('inRrpairPhone',{
                initialValue: isEdit ? data.inRrpairPhone : null
              })(
                isEdit ? 
                <Input placeholder='请输入维修人电话'/>
                :
                <span> {data.inRrpairPhone} </span> 
            )}
          </Col>
          <Col {...gridStyle.label}>维修费用（总计）：</Col>
          <Col {...gridStyle.content}>
            {
              getFieldDecorator('actualPrice',{
                initialValue: isEdit ? data.actualPrice : null
              })(
                isEdit ?  
                <Input addonBefore="￥"/>
                :
                <span> ￥{data.actualPrice} </span>
            )}
          </Col>
          <Col {...gridStyle.label}>故障类型：</Col>
          <Col {...gridStyle.content}>
            {
              getFieldDecorator('repairContentType',{
                initialValue: isEdit ? data.repairContentType : null
              })(
                isEdit ? 
                <Select allowClear>
                  {
                    selectOption.repairContentType.map((item, index) => (
                      <Option value={item.value} key={index}> { item.text } </Option>
                    ))
                  }
                </Select>
                :
                <span> {selectOption.repairContentType.map((item,index)=>item.value=== data.repairContentType ?item.text:'')} </span> 
            )}
          </Col>
          <Col {...gridStyle.label}>故障原因：</Col>
          <Col span={20} style={gridStyle.content.style}>
            {
              getFieldDecorator('repairContentTyp',{
                initialValue: isEdit ? data.repairContentTyp : null
              })(
                isEdit ? 
                <Select allowClear style={{width: '40%'}}>
                  {
                    selectOption.repairContentTyp.map((item, index) => (
                      <Option value={item.value} key={index}> { item.text } </Option>
                    ))
                  }
                </Select>
                :
                <span> { selectOption.repairContentTyp.map((item,index)=>item.value=== data.repairContentTyp ?item.text:'')} </span> 
            )}
          </Col>
          {
            Comp
          }
        </Row>
      </Form>  
    )
  }
}

// 外修
/* class OutsideRepairForm extends PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isEdit, data } = this.props;
    return (
      <Form>
        <Row type='flex'>
          <Col {...gridStyle.label}>指派服务商：</Col>
          <Col {...gridStyle.content}>
            {
              getFieldDecorator('outOrg',{
                initialValue: isEdit ? data.outOrg : null
              })(
                isEdit ?  
                <Input placeholder='输入服务商'/>
                :
                <span> {data.outOrg} </span>
            )}
          </Col>
          <Col {...gridStyle.label}>维修联系电话：</Col>
          <Col {...gridStyle.content}>
            {
              getFieldDecorator('outRrpairPhone',{
                initialValue: isEdit ? data.outRrpairPhone : null
              })(
                isEdit ? 
                <Input placeholder='输入联系电话'/>
                :
                <span> {data.outRrpairPhone} </span> 
            )}
          </Col>
          <Col {...gridStyle.label}>预期完成时间：</Col>
          <Col span={20} style={gridStyle.content.style}>
            {
              getFieldDecorator('completTime',{
                initialValue: isEdit ? data || data.completTime=== "" || data.completTime === null? null: moment(data.completTime,'YYYY-MM-DD') : null
              })(
                isEdit ?
                <DatePicker style={{width: '40%'}}/>
                :
                <span> {data.completTime} </span> 
            )}
          </Col>
          <Col span={4} style={{marginTop: 20, textAlign: 'right'}}>指派备注：</Col>
          <Col span={20} style={{marginTop: 20}}>
            {
              getFieldDecorator('tfRemarkZp',{
                initialValue: isEdit ? data.tfRemarkZp : null
              })(
                isEdit ? 
                <TextArea rows={4} style={{width: '100%'}} />
                :
                <span> {data.tfRemarkZp} </span> 
            )}
          </Col>
        </Row>
      </Form> 
    )
  }
} */
class ServiceInfo extends PureComponent {
  static defaultProps = {
    isEdit: false,
    data: {}
  };
  static propTypes = {
    isEdit: PropTypes.bool,
    data: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      rrpairType: this.props.rrpairType || '00'
    }
  }
  postData = () => {
    const { rrpairType } = this.state;
    const data = this.wrapperForm.props.form.getFieldsValue();
    data.completTime =  data.completTime === undefined || data.completTime === null ? '':data.completTime.format('YYYY-MM-DD');
    return {...data, rrpairType: rrpairType}
  }
  render() {
    const { rrpairType } = this.state;
    const { isEdit , data , callBack } = this.props;//repairInput
    // const Comp = rrpairType === "00" ? Form.create()(InsideRepairForm) : Form.create()(OutsideRepairForm)
    const Comp = Form.create()(InsideRepairForm) ; 

    return (
      <div>
        <Row type="flex">
          <Col {...gridStyle.label}>维修方式：</Col>
          <Col span={16} style={gridStyle.content.style}>
            <RadioGroup defaultValue={rrpairType} onChange={e => {
              this.setState({rrpairType: e.target.value});
              if(e.target.value === "01"){
                this.props.cb_rrpairType("20")
              }else{
                this.props.cb_rrpairType("50")
                data.repairResult = "";
              }
              //this.props.setRrpairType(e.target.value);
            }}>
              <RadioButton value="00" disabled={!isEdit && rrpairType !== '00'}>内修</RadioButton>
              <RadioButton value="01" disabled={ !isEdit && rrpairType !== '01' }>外修</RadioButton>{/* repairInput ? repairInput: !isEdit && rrpairType !== '01' */}
            </RadioGroup>
          </Col>
        </Row>
        <Comp wrappedComponentRef={(inst) => this.wrapperForm = inst} isEdit={isEdit} data={data} showOutSide={rrpairType === "01"} callBack={callBack}/>
      </div>  
    )
  }
}
export default ServiceInfo;