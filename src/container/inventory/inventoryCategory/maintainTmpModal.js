/**保养登记--列表*/
import React from 'react';
import { Form , Input,  Button,Modal ,Icon, Select , Tooltip} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class ModalFormAdd extends React.Component{

  state={
    data:{
      templateName:''
    }
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
  componentWillReceiveProps =(nextProps)=>{
    this.setState({
      data:this.formTData(nextProps.editModalData)
    })
  }
 
  render(){
    //生成option内容
    const loop = data => data.map((item) => {
        return <Option key={item.maintainTemplateId}>{item.maintainTemplateName}</Option>;
    });
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
    const { selectDropData } =this.props;
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
            <Select>
              {loop(selectDropData)}
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
  
  render(){
    const { visible, loading ,selectRow ,modalState ,selectDropData } = this.props;
    const { data } = this.state;
    return(
      <Modal
        visible={visible}
        title={modalState}
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
        footer={[
          <Button key="back" onClick={this.props.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            确定
          </Button>,
        ]}
      >
        <ModalForm ref='form' selectRow={selectRow} selectDropData={selectDropData} editModalData={data}></ModalForm>
      </Modal>
    )
  }
}

export default MaintainTmpQuoteModal;