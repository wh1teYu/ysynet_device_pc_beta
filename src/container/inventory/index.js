/**资产盘点 */
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import RouteWithSubRoutes from '../../route/routeWithSubRoutes';
import NotFound from '../common/404';
class inventory extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route}/>
          ))
        }
        <Route path="/inventory" render={()=><Redirect to="/inventory/inventoryRecord"/>}/>
        <Route component={NotFound}/>
      </Switch>
    )
  }
}
export default inventory;