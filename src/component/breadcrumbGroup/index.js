import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb ,Icon} from 'antd';

function getBreadcrumbNameWithParams(breadcrumbNameMap, url) {
  let name = '';
  Object.keys(breadcrumbNameMap).map((item) => {
    const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
    const itemRegExp = new RegExp(itemRegExpStr);
    if (itemRegExp.test(url)) {
      name = breadcrumbNameMap[item];
    }
    return null;
  });
  return name;
}
class BreadcrumbGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.breadcrumbNameMap = {};
    this.state = {
      bread: []
    }
  }
  createBreadcrumbNameMap = (routes) => {
    routes.map((route, index) => {
      this.breadcrumbNameMap[route.path] = route.name;
      if (route.routes) {
        this.createBreadcrumbNameMap(route.routes);
      }
      return null;
    })
  }
  createBreadcrumb = () => {
    const { routes, location } = this.props;
    this.createBreadcrumbNameMap(routes);
    const pathArr = location.pathname.split('/');
    const breadArr = pathArr.map((item, i) => {
      const url = pathArr.slice(0, i+1).join('/');
      return { url, title: getBreadcrumbNameWithParams(this.breadcrumbNameMap, url) }
    })
    return breadArr;
  }
  render() {
    const bread = this.createBreadcrumb();
    return (
      <div>
        <Breadcrumb className={this.props.className} style={{position:'relative'}}>
        <Breadcrumb.Item><a  style={{position: 'absolute', right: '40px', top: '4px'}} onClick={() => window.history.go(-1)}>
          <Icon type="rollback" style={{fontWeight:'bolder',color:'#666'}}/>返回</a></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={'/'}>首页</Link></Breadcrumb.Item>
          {
            bread.map((item, index) => (
              item.title ?
              <Breadcrumb.Item key={index}> 
              {/* {
                (index !== 1 && index !== bread.length - 1)
                ? <Link to={item.url}> { item.title } </Link> : item.title
              } */}
              {
                item.title
              }
              </Breadcrumb.Item>
              : null
            ))
          }

        </Breadcrumb>
        { this.props.children }
      </div>  
    )
  }
}
export default withRouter(BreadcrumbGroup);