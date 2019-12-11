import React, { PureComponent } from 'react';
import { Form, Modal , Input , message } from 'antd';
import querystring from 'querystring';
import request from '../../utils/request';
import { _local } from '../../api/local';
import md5 from 'md5';
const FormItem = Form.Item;
const URL = `${_local}/user/modifyUserPwd`;
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
class ChangePsd extends PureComponent{
		state={
			confirmDirty: false,
		}
		handleConfirmBlur = (e) => {
			const value = e.target.value;
			this.setState({ confirmDirty: this.state.confirmDirty || !!value });
		}

		compareToFirstPassword = (rule, value, callback) => {
			const form = this.props.form;
			if (value && value !== form.getFieldValue('newPwd')) {
				callback('两次输入的密码不一致!');
			} else {
				callback();
			}
		}

		validateToNextPassword = (rule, value, callback) => {
			const form = this.props.form;
			if (value && this.state.confirmDirty) {
				form.validateFields(['confirm'], { force: true });
			}
			callback();
		}
		handleSubmit = () => {
			this.props.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log('Received values of form: ', values);
					delete values['checkPsd']
					values.oldPwd = md5(values.oldPwd.toString()).substring(2, md5(values.oldPwd.toString()).length).toUpperCase();
         	values.newPwd = md5(values.newPwd.toString()).substring(2, md5(values.newPwd.toString()).length).toUpperCase();
					let body = querystring.stringify(values)
					request(URL,{
						body,
						headers:{
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success: data => {
							if(data.status){
								message.success('修改成功，请重新登录!');
								this.props.resetLogin();
							}else{
								message.error(data.msg)
							}
						}
					})
				}
			});
		}
    render(){
				const { getFieldDecorator } = this.props.form;
				const { visible } = this.props;
        return(
						<Modal 
							destroyOnClose={true}
							visible={visible} 
							title='修改密码'
							onOk={()=>this.handleSubmit()}
							onCancel={()=>this.props.close()}
						>
                <Form>
                    <FormItem
                    {...formItemLayout}
                    label="旧密码"
                    >
                    {getFieldDecorator('oldPwd', {
                        rules: [{
                        	required: true, message: '请输入旧密码！',
                        },{min: 6, message: '密码不能少于6位'
												}],
                    })(
                        <Input type="password"/>
                    )}
                    </FormItem>
										<FormItem
												{...formItemLayout}
												label="新密码"
											>
												{getFieldDecorator('newPwd', {
													rules: [{
														required: true, message: '请输入新密码！',
													},{
														min: 6, message: '密码不能少于6位'
													},{
														validator: this.validateToNextPassword,
													}],
												})(
													<Input type="password" />
												)}
										</FormItem>
										<FormItem
											{...formItemLayout}
											label="确认新密码"
										>
											{getFieldDecorator('checkPsd', {
												rules: [{
													required: true, message: '请重复输入新密码!',
												},{
													min: 6, message: '密码不能少于6位'
												},{
													validator: this.compareToFirstPassword,
												}],
											})(
												<Input type="password" onBlur={this.handleConfirmBlur} />
											)}
										</FormItem>
                </Form>
            </Modal>
        )
    }
}
export default Form.create()(ChangePsd);