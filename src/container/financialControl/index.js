/*
 * @Author: yuwei  财务管理- financialControl
 * @Date: 2018-07-05 13:57:50 
* @Last Modified time: 2018-07-05 13:57:50 
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import RouteWithSubRoutes from '../../route/routeWithSubRoutes';
import NotFound from '../common/404';
class FinancialControl extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route}/>
          ))
        }
        <Route path="/financialControl" render={()=><Redirect to="/financialControl/auditInvoice"/>}/>
        <Route component={NotFound}/>
      </Switch>
    )
  }
}
export default FinancialControl;