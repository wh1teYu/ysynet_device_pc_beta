import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import RouteWithSubRoutes from '../../route/routeWithSubRoutes';
import NotFound from '../common/404'
class Transfer extends Component {
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
export default Transfer;