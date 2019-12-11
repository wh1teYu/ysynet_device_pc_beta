/*
 * @Author: yuwei - 审批管理 -approval
 * @Date: 2018-07-11 14:29:11 
* @Last Modified time: 2018-07-11 14:29:11 
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
        <Route path="/approval" render={()=><Redirect to="/approval/approvalNew"/>}/>
        <Route component={NotFound}/>
      </Switch>
    )
  }
}
export default Approval;