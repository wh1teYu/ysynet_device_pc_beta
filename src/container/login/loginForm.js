import React, { PureComponent } from 'react';
import { Form, Input, Icon } from 'antd'; 
const FormItem = Form.Item;
class LoginForm extends PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入您的账号!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" size="large"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入您的密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" size="large" onPressEnter={()=>this.props.login()}/>
          )}
        </FormItem>
      </Form>
    )
  }
}
export default LoginForm;