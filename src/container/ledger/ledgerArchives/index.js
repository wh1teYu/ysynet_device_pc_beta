/**
 * 资产档案
 */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWithSubRoutes from '../../../route/routeWithSubRoutes';
import NotFound from '../../common/404';
class LedgerArchives extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route}/>
          ))
        }
        <Route component={NotFound}/>
      </Switch>
    )
  }
}
export default LedgerArchives;