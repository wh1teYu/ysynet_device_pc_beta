/**
 * 拒绝说明--拒绝维修
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, Select, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { operation as operationService } from '../../../service';
import assets from '../../../api/assets';
import querystring from 'querystring';
const Option = Select.Option;
const { TextArea } = Input;
const gridStyle = {
    label: {
      span: 4,
      style: { textAlign: 'left', height: 50, lineHeight: '50px' }
    }, 
    content: {
      span: 18,
      style: { textAlign: 'left', height: 50, lineHeight: '50px' }
    }
  }
class refuseForm extends PureComponent{
    constructor(props) {
        super(props);
        this.state = {
          disabled: true
        }
    }
    onSubmit = ()=>{
        let parmas = this.props.form.getFieldsValue();
        parmas.orderFstate = '80';//拒绝
        parmas.rrpairOrderGuid = this.props.rrpairOrderGuid;
        console.log(parmas,'parmas');
        this.props.refuseService(parmas);
    }
    onSelect = (value) =>{
        if(value === '其他'){
            this.setState({ disabled: false })
        }else{
            this.setState({ disabled: true })
        }
    }
    render(){
        console.log(this.props,'props')
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Row type='flex'>
                    <Col {...gridStyle.label}>拒绝原因：</Col>
                    <Col {...gridStyle.content}>
                        {
                            getFieldDecorator('refuseCause',{
                                initialValue:''
                            })(
                                <Select allowClear
                                    onSelect={this.onSelect}
                                >
                                    <Option value={""}>请选择</Option>
                                    <Option value={"1"}>原因1</Option>
                                    <Option value={"2"}>原因2</Option>
                                    <Option value={"其他"}>其他</Option>
                                </Select>
                        )}
                    </Col>
                    <Col {...gridStyle.label} style={{marginTop: 20}}>其他原因：</Col>
                    <Col {...gridStyle.content} style={{marginTop: 20}}>
                        {
                        getFieldDecorator('otherCause')(
                            <TextArea disabled={this.state.disabled} rows={4} style={{width: '100%'}} />
                        )}
                    </Col>
                    <Col {...gridStyle.label} style={{marginTop: 20}}>备注：</Col>
                    <Col {...gridStyle.content} style={{marginTop: 20}}>
                        {
                        getFieldDecorator('tfRemarkJj')(
                            <TextArea rows={4} style={{width: '100%'}} />
                        )}
                    </Col>
                    <Col span={24} style={{textAlign:'center',marginTop: 20}}>
                        <Button type='primary' onClick={this.onSubmit}>提交</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const WrapRefuseForm = Form.create()(refuseForm);
class refuseReason extends PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
      }
    componentWillReceiveProps = (nextProps)=>{
        if(nextProps.visible){
            this.setState({ visible: nextProps.visible })
        }else{
            this.setState({ visible:false })
        }
    }
    refuseService = (val)=>{
        const { refuseService,history } = this.props;
        refuseService(assets.updateRrpairOrderFstate,querystring.stringify(val),(data)=>{
            if(data.status){
                history.push({ pathname:'/repairMgt/myServiceList' });
                message.success('操作成功');
            }else{
                message.error(data.msg);
            }
        },{
          Accept: 'application/json',
         'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        })
    }
    render(){
        const { visible } = this.state;
        return (
        <div>
            <Modal
                visible={visible}
                title={'拒绝说明'}
                onCancel={()=>{this.props.setVisible(false); this.setState({ visible: false })}}
                footer={null}
            >
                <WrapRefuseForm 
                    refuseService={(val)=>this.refuseService(val)}
                    rrpairOrderGuid={this.props.location.state.rrpairOrderGuid}/>
                
            </Modal>
        </div>)
    }
}
export default withRouter(connect(null, dispatch => ({
    refuseService: (url,values,success,type) => operationService.getInfo(url,values,success,type),
  }))(refuseReason));