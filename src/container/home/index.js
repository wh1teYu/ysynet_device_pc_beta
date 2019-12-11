import React from 'react';
import { Layout, Icon, message,Spin } from 'antd'; //message
import { connect } from 'react-redux';
import { user as userService, menu as menuService, search  } from '../../service';
import { withRouter, Switch, Redirect } from 'react-router-dom';
import RouteWithSubRoutes from '../../route/routeWithSubRoutes';
import BasicLayout from '../common/basicLayout';
import BreadcrumbGroup from '../../component/breadcrumbGroup';
import Profile from '../../component/profile';
import _ from 'lodash';
// import Notice from '../../component/notice';
const { Header, Footer } = Layout;

const checkPath = (ownList, index) => {
  const path = window.location.hash.split('#')[1].replace(/\s/g,'').toUpperCase();
  for( let i = 0;i < ownList.length; i++){
    for ( let j=0; j<ownList[i].subMenus.length; j++){
      if (path.includes(ownList[i].subMenus[j].path.replace(/\s/g,'').toUpperCase()) || path.includes('WORKPLACE')) { 
          return true;
      }
    }
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      isLoading: true
    }
  }
  async componentWillMount() {
    const { setUser,getMenu, getUser, history } = this.props;//getUser history
      const data = await getUser();
      setUser(data.result);
      if (data.status) {
        this.setState({
          isLoading: false
        })
        const menu =this.sortMenu( await getMenu());
        if(!checkPath(menu,1)){
          // alert('路径错误')
        }
    } else {
      message.error('会话失效, 请重新登录！');
      history.push({pathname: '/login'})
    }
  }
  // 校验路径, 清除查询回填
  componentWillReceiveProps(nextProps) {
    const search = nextProps.search;
    const pathname = nextProps.location.pathname;
    if (Object.keys(search).length ) {
      if (!pathname.startsWith(Object.keys(search)[0])) {
        nextProps.clearSearch();
      }
    }
  }

  sortMenu = (menu) =>{
    let a = _.sortBy(menu,function(o) { 
      let subMenus = o.subMenus;
      o.subMenus = _.sortBy(subMenus,function(subO) {return subO.fsort});
      return o.fsort; 
    });
    return a
  }

  resetLogin=()=>{
    const { history } = this.props;
    history.push('/login')
  }

  render () {
  
    const { routes, menu, user } = this.props;
    //menu.menuList
    const sortMenu = this.sortMenu(menu.menuList);
    return (
      <Spin spinning={this.state.isLoading} size="large">
      <Layout > {/* style={{minHeight: '100vh',position: 'relative'}} */}
        <BasicLayout  menuList={sortMenu} collapsed={this.state.collapsed}/> {/* style={{height:'100vh',overflowY: 'scroll'}} */}
        <Layout >{/* style={{height: '100vh',overflowY: 'scroll'}} */}
          <Header style={{ background: '#fff', padding: '0 20px 0 0' }} className='ysynet-header'>
            <Icon 
              onClick={() => {
                const { collapsed } = this.state;
                this.setState({
                  collapsed: !collapsed
                })
              }}
              className='ysyenert-header-icon ysynet-collapsed'
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} 
            />
            <div style={{display: 'flex'}}>
             {/* <Notice/>*/}
              <Profile userName={user.userInfo.userName || user.userName } resetLogin={this.resetLogin}/>
            </div>  
          </Header>
          <BreadcrumbGroup className='ysynet-breadcrumb' routes={routes}>
          </BreadcrumbGroup>
          {
            this.state.isLoading ? '数据加载中...' : 
            <Switch>
              {
                routes.map((route, i) => (
                  <RouteWithSubRoutes key={i} {...route}/>
                ))
              }
              <Redirect from={'/'} to={'/workplace'}/>  
            </Switch>
          }
          <Footer style={{ textAlign: 'center', padding:'5px 0' }}>
          {/*  */}
            {/* <div className={'ysynet-footer-link'}>
              <ul>
                <li><a>医商云官网</a></li>
                <li><a>医商云供应链平台</a></li>
                <li><a>医商云质控平台</a></li>
              </ul>
            </div>
            <div className={'ysynet-footer-copyright'}>医商云设备平台 ©2017 Created by 普华信联前端部</div>
          */}
         {/*  */}
          </Footer>
        </Layout>  
      </Layout>
      </Spin>
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setUser: user => dispatch(userService.setUserInfo(user)),
  getUser: () => dispatch(userService.fetchUserInfo()),
  getMenu: () => dispatch(menuService.fetchMenu()),
  clearSearch: () => dispatch(search.clearSearch())
}))(Home));