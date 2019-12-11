import React, { PureComponent } from 'react';
import { Form, Input, Icon, Button, Row, Col } from 'antd'; 
const FormItem = Form.Item;
class PhoneLoginForm extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      buttonText: '输入验证码',
      loading: false
    }
  }
  identifyingCodeTimeout = () => {
    const intervalFunc = setInterval(() => {
      let buttonText = this.state.buttonText;
      const text = typeof buttonText === 'string' ? 59 : buttonText - 1
      this.setState({
        buttonText: text === 0 ? '输入验证码' : text,
        loading: text === 0 ? false : true
      })
      if (text === 0) {
        clearInterval(intervalFunc);
      }
    }, 1000);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { buttonText, loading } = this.state;
    return (
      <Form>
        <FormItem>
          {getFieldDecorator('phoneNo', {
            rules: [{ required: true, message: '请输入您的手机号!' }],
          })(
            <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号" size="large"/>
          )}
        </FormItem>
        <FormItem >
          <Row>
            <Col span={14}>
              {getFieldDecorator('identifyingCode', {
                rules: [{ required: true, message: '请输入您的验证码!' }],
              })(
                <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="验证码" size="large" onPressEnter={()=>this.props.login()}/>
              )}
            </Col>
            <Col span={6} push={3}>
              <Button 
                style={{width: 116}} 
                size='large' 
                onClick={() => this.identifyingCodeTimeout()}
                loading={loading}
              >
                { typeof buttonText === 'string' ? buttonText : `${buttonText}秒`}
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    )
  }
}
export default PhoneLoginForm;