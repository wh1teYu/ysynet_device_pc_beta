/*
 * @Author: xuhao - 巡检管理 -inspectionMgt
 * @Date: 2018-08-08 10:49:11 
* @Last Modified time: 2018-08-08 10:49:11
 */


import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import RouteWithSubRoutes from '../../route/routeWithSubRoutes';
import NotFound from '../common/404';
class Approval extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route}/>
          ))
        }
        <Route path="/inspectionMgt" render={()=><Redirect to="/inspectionMgt/inspectionRecord"/>}/>
        <Route component={NotFound}/>
      </Switch>
    )
  }
}
export default Approval;