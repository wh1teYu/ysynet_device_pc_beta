import React, { Component } from 'react';
import styles from './style.css';
import LoginForm from './loginForm';
import PhoneLoginForm from './phoneLoginForm'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Tabs, Icon, Form, Button,message } from 'antd';
import { user as userService } from '../../service';
import assets from '../../api/assets';
import sha1 from 'sha1';
import md5 from 'md5';
import { login, getUser } from '../../api/login';
const TabPane = Tabs.TabPane;
/**
 * @file 登录页面
 */

const WrappedNormalLoginForm = Form.create()(LoginForm);
const WrappedPhoneLoginForm = Form.create()(PhoneLoginForm);
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIndex: 1,
      loading: false,
    }
  }
  
  login = () => {
    this.setState({loading: true})
    const { tabIndex } = this.state;
    const form = tabIndex === 1 ? this.normalForm : this.phoneForm;
    const postData = form.props.form.getFieldsValue();
    const { userName, password } = postData;
    const { setUser, history,fetchUserLogin } = this.props;

    let arr = [md5(password.toString()).substring(2, md5(password.toString()).length).toUpperCase(), 'vania']
    let pwd = '';
    arr.sort().map( (item, index) => {
      return pwd += item;
    });
    fetchUserLogin(assets.userLogin+'?userNo='+userName+'&pwd=' + sha1(pwd) + '&token=vania',(data)=>{
      if(data.status){
        this.setState({loading: false})
        setUser(data.result);
        // console.log(data.result)
        if (!data.result.userInfo) {
          message.error(data.result.loginResult)
        }else{
          history.push('/');
        }
      }else{
        this.setState({loading: false})
        message.error(data.msg)
      }
    })
    //.then(response =>    this.setState({loading: false}))
  }
  async login () {
    // const { tabIndex } = this.state;
    // const form = tabIndex === 1 ? this.normalForm : this.phoneForm;
    // const postData = form.props.form.getFieldsValue();
    // const { userName, password } = postData;
    // const { setUser, history } = this.props;
    const data = await login();
    if (data.status) {
      const d = getUser()
      console.log(d)
    }
    // if ( userName === 'admin' && password === '999999' ) {
    //   // 管理科室
    //   setUser({userName: '管理科室', type: '01'});
    //   history.push('/');
    // } else if ( userName === 'supplier' && password === '999999' ) {
    //   // 供应商
    //   setUser({userName: '供应商', type: '03'});
    //   history.push('/');
    // } else if ( userName === 'customer' && password === '999999') {
    //   // 使用科室
    //   setUser({userName: '使用科室', type: '02'});
    //   history.push('/');
    // } else {
    //   alert('用户名或密码错误')
    // }
  }
  render() {
    return (
      <Row className={`${styles.container} login`}>
        <div className={styles['top']}>
          <a href="/" className={styles['login-logo']}> </a>
        </div>
        <div className={styles['middle']}>
          <Tabs defaultActiveKey="1" animated={false} style={{width: 400}} onChange={index => this.setState({tabIndex: index})}>
            <TabPane style={{padding: 8}} tab={<span style={{fontSize: 16}}><Icon type="solution" />账户密码登录</span>} key="1">
              <WrappedNormalLoginForm wrappedComponentRef={(inst) => this.normalForm = inst} login={this.login}/>
            </TabPane>
            <TabPane style={{padding: 8}}  tab={<span style={{fontSize: 16}}><Icon type="mobile" />手机号码登录</span>} key="2">
              <WrappedPhoneLoginForm wrappedComponentRef={(inst) => this.phoneForm = inst} login={this.login}/>
            </TabPane>
          </Tabs>
        </div>
        <div className={styles['middle']}>
          <Button style={{width: 384}} type='primary' size='large' onClick={this.login} loading={this.state.loading}>登录</Button>
        </div>
      </Row>
    )
  }
}

export default withRouter(connect(state => state, dispatch => ({
  setUser: user => dispatch(userService.setUserInfo(user)),
  fetchUserLogin: (url,success) => dispatch(userService.fetchUserLogin(url,success))
}))(Login));