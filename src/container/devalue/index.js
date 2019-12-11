/**
 * 资产折旧
 */
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import RouteWithSubRoutes from '../../route/routeWithSubRoutes';
import NotFound from '../common/404';
class devalue extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route}/>
          ))
        }
        <Route path="/devalue" render={()=><Redirect to="/devalue/withdraw"/>}/>
        <Route component={NotFound}/>
      </Switch>
    )
  }
}
export default devalue;