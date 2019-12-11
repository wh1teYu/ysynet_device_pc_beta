/*
 * @Author: yuwei  - 科室业务
 * @Date: 2018-06-08 14:50:53 
* @Last Modified time: 2018-06-08 14:50:53 
 */

import React, { Component } from 'react';
import { Route, Switch ,Redirect} from 'react-router-dom';
import RouteWithSubRoutes from '../../route/routeWithSubRoutes';
import NotFound from '../common/404';

class MeterMgt extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route}/>
          ))
        }
        <Route path="/deptWork" render={()=><Redirect to="/deptWork/myProfile"/>}/>
         <Route component={NotFound}/>
      </Switch>
    )
  }
}
export default MeterMgt;