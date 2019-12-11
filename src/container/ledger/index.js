/**
 * 档案管理
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import RouteWithSubRoutes from '../../route/routeWithSubRoutes';
import NotFound from '../common/404';
class Ledger extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route}/>
          ))
        }
        <Route path="/ledger" render={()=><Redirect to="/ledger/ledgerArchives"/>}/>
        <Route component={NotFound}/>
      </Switch>
    )
  }
}
export default Ledger;