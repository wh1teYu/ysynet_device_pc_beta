/**保养登记--列表*/
import React from 'react';
import { Form , Input,  Button,Modal ,Icon, Select , Tooltip, message } from 'antd';
import basicdata from '../../../api/basicdata';
import request from '../../../utils/request';
import querystring from 'querystring';
const FormItem = Form.Item;
const Option = Select.Option;
class ModalFormAdd extends React.Component{

  state={
    data:{
      templateName:''
    },
    selectDropData:[]
  }
  componentWillMount =()=>{
    this.setState({
      data:this.formTData(this.props.editModalData)
    })
  }
  formTData=(editModalData)=>{
    
    if(editModalData.parentKey){
      return {
        templateName:editModalData.title,
        maintainTemplateId:editModalData.parentKey||'',
        maintainTemplateDetailId:editModalData.key||'',
      }
    }else{
      return {
        templateName:editModalData.title,
        parentKey:editModalData.key||'',
      }
    }
    
  }
  componentWillMount = ()=>{
    this.fetch();
  }
  componentWillReceiveProps =(nextProps)=>{
    this.setState({
      data:this.formTData(nextProps.editModalData)
    })
  }

  handleChange = (value)=>{
    this.fetch(value);
  }
  fetch =(value)=>{
    let o;
    if(value){
      o={maintainTemplateName:value}
    }else{
      o=''
    }
    let options = {
      body:querystring.stringify(o),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          let ret = []
          data.result.forEach(item => {
            let i ={
              value:item.maintainTemplateId,
              text:item.maintainTemplateName,
              key:item.detailNum
            }
            ret.push(i);
          });
          this.setState({
            'selectDropData':  ret
          })
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    }
    request(basicdata.queryOneModule,options)
  }
  render(){
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
    const { getFieldDecorator } = this.props.form;
    const { data } =this.state;
    const { selectDropData } = this.state;
    const options = selectDropData.map(d => <Option key={d.value} value={d.text}>{d.text}</Option>);
    return (
      <Form className="login-form">
        <FormItem
        {...formItemLayout}
        label={(
          <span>
            上级分类&nbsp;
            <Tooltip title="不选择上级时创建模板，选择上级创建保养项目">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        )}>
          {getFieldDecorator('maintainTemplateId', {initialValue:data.maintainTemplateId,})(
              <Select
                mode="combobox"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleChange}
              >
                <Option key='null' value='' >无分类</Option>
                {options}
              </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('parentKey', {initialValue:data.parentKey,})(
            <span></span>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('maintainTemplateDetailId', {initialValue:data.maintainTemplateDetailId,})(
            <span></span>
          )}
        </FormItem>
        <FormItem
          label='名称'
          {...formItemLayout}
        >
          {getFieldDecorator('templateName', {
            initialValue:data.templateName,
            rules: [{ required: true, message: '请填写名称！' }],
          })(
            <Input placeholder="请填写名称" />
          )}
        </FormItem>
      </Form>
    );
  }
}
const ModalForm = Form.create()(ModalFormAdd);

class MaintainTmpQuoteModal extends React.Component{
  
  state={
    data:{}
  }
  handleOk = () =>{
    this.refs.form.validateFields((err, values) => {
      if (!err) {
        let sigleData = this.props.selectDropData.filter(item =>{
          return item.text===values.maintainTemplateId
        })[0];
        values.maintainTemplateId = sigleData ?  sigleData.value:''
        this.props.callback(values,this.props.modalState)
      }
    });
  }
  componentWillReceiveProps =(nextProps)=>{
    if(nextProps.modalState==='新增'){
      this.setState({
        data:{}
      })
    }else{
      this.setState({
        data:nextProps.data
      })
    }
    
  }
  
  cancel =()=>{
    this.props.handleCancel();
    this.refs.form.resetFields();
  }
  render(){
    const { visible, loading ,selectRow ,modalState } = this.props;
    const { data } = this.state;
    return(
      <Modal
        visible={visible}
        title={modalState}
        onOk={this.props.handleOk}
        onCancel={this.cancel}
        footer={[
          <Button key="back" onClick={this.cancel}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            确定
          </Button>,
        ]}
      >
        <ModalForm ref='form' selectRow={selectRow} editModalData={data}></ModalForm>
      </Modal>
    )
  }
}

export default MaintainTmpQuoteModal;