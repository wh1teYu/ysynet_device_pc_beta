import React, { Component } from 'react';
import { Layout, Menu, Icon, Spin, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { menu as menuService } from '../../service';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

// 使用递归创建菜单
const createMenu = menuList => {
  return (
    Array.isArray(menuList) ? menuList.map((menu, index) => {
      return (
        menu.subMenus && menu.name ? (
          <SubMenu
            key={menu.key} 
            title={<span><Icon type={menu.icon} /><span>{menu.name}</span></span>}
          >
            { createMenu(menu.subMenus) }
          </SubMenu>
        ) : (
          menu.name ? 
          <Menu.Item key={menu.key}>
            <Icon type={menu.icon} />
            <span> { menu.name } </span>
          </Menu.Item> : null
        )
      )
    }) : (
      <Menu.Item key={menuList.key}>
        <Icon type={menuList.icon} />
        <span> { menuList.name } </span>
      </Menu.Item>
    )
  )
}

class BasicLayout extends Component {
  state = {
    selectedKeys: [],
    openKeys: [],
    recordKeys: []//修复官方hover bug
  };
  changeActiveKeys = () => {
    const href = window.location.href;
    const pathname = href.split('#')[1];
    const { openKeys } = this.state;
    const keys = pathname.split('/');
    let selectedKeys = '', newOpenKeys = [];
    if (keys.length > 3) {
      selectedKeys = keys.slice(0, 3).join('/');
      newOpenKeys = [ keys.slice(0, 2).join('/'), keys.slice(0, 3).join('/') ]; 
    } else { 
      selectedKeys = pathname;
      newOpenKeys = openKeys.length ? openKeys : [ keys.slice(0, 2).join('/') ];  
    };
    this.setState({selectedKeys, openKeys: newOpenKeys});
  }
  componentWillMount = () => {
    this.changeActiveKeys();
  }
  onOpenChange = openKeys => {
    let changeKey = openKeys.length ? openKeys[openKeys.length - 1] : [];
    if (changeKey.length) {
      let changeKeyArr = changeKey.split('/');
      if (changeKeyArr.length > 2) {
        if (openKeys.length === 1) {
          changeKey = [];
        } else {
          changeKey = [changeKeyArr.slice(0, 2).join('/'), changeKeyArr.slice(0, 3).join('/') ];
        }
      } else {
        changeKey = [ changeKeyArr.slice(0, 2).join('/') ]
      }
    } else {
      changeKey = [];
    }
    this.setState({
      openKeys: changeKey
    })
  }
  componentWillReceiveProps = (nextProps) => {
    this.changeActiveKeys();
    if (nextProps.collapsed) {
      this.setState({ openKeys: [] })
    }
  }
  render() {
    const { history, menuList, collapsed } = this.props;
    const { selectedKeys, openKeys } = this.state;
    return (
      <Sider
        width={200}      
        collapsed={collapsed}
      >
        <div className='logoWrapper'>
          <img src={require('../../assets/logo.png')} alt='logo' className='logo'/>
          <h1 className='logoDesc'>P H X L</h1>
        </div>
        {
          menuList && menuList.length ?
          <Menu 
            theme="dark" 
            mode="inline"
            selectedKeys={[selectedKeys]}
            onOpenChange={this.onOpenChange}
            openKeys={openKeys}
            onClick={item => {
              const { pathname } = history.location; 
              if (pathname !== item.key)
                history.push({pathname: `${item.key}`})
              else 
                message.info('您正位于该页面')
            }}
          >
          <Menu.Item key='/workplace'>
            <Icon type="home" />
            <span> 工作台 </span>
          </Menu.Item>
           {
             createMenu(menuList)
           }
           </Menu> :
           <Spin tip="数据加载中" style={{width: '100%', height: 200, marginTop: 200}}/>
        } 
      </Sider>
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setBread: bread => dispatch(menuService.setBreadMapper(bread))
}))(BasicLayout));