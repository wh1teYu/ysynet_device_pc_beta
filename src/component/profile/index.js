import React, { PureComponent } from 'react';
import { Avatar, Popover, List, Icon } from 'antd';
import { Link } from 'react-router-dom';
import ChangePsd from './changepsd';
import styles from './style.css';
const data = [
//  { text: '个人中心', path: '/profile', icon: 'user' },
 { text: '修改密码', path: '', icon: 'key' },
 { text: '设置', path: '/profile/setting', icon: 'setting' },
 { text: '退出登录', path: '/login', icon: 'logout'},
];

class Profile extends PureComponent {

  state={
    showChangePSD:false,
    showPopover:false,
  }
  editPSD=()=>{
    this.setState({showChangePSD:true,showPopover:false})
  }
  handleVisibleChange = (visible) => {
    this.setState({ showPopover:visible });
  }
  
  render() {
    const ProfileList = () => (
      <List
        style={{padding: 0}}
        dataSource={data}
        renderItem={item => (
          <List.Item className={styles.profileItem}>
          {
            item.icon==='key'?
            <div className={styles.profileItemLink} onClick={this.editPSD}>
              <Icon type={item.icon} className={styles.profileIcon}/>{item.text}
            </div>
            :
            (
              <Link className={styles.profileItemLink} to={item.path}>
                <Icon type={item.icon} className={styles.profileIcon}/>{item.text}
              </Link>
            )
          }
          </List.Item>)
        }
      />
    )
    return (
      <div>
        <Popover 
        content={<ProfileList/>} 
        trigger="hover" 
        placement="bottomLeft"
        onVisibleChange={this.handleVisibleChange}
        visible={this.state.showPopover}>
          <div className={styles.profile}>
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" className={styles.profileImage}/>
            <span className={`${styles.username}`}>{this.props.userName}</span>
          </div>
        </Popover> 
        <ChangePsd 
        visible={this.state.showChangePSD}
        close={()=>this.setState({showChangePSD:false})}
        resetLogin={()=>this.props.resetLogin()}
        ></ChangePsd>
      </div>
    )
  }
}

export default Profile;