/**
 * 保养管理
 */ 
import React, { Component } from 'react';
import { Route, Switch ,Redirect} from 'react-router-dom';
import RouteWithSubRoutes from '../../route/routeWithSubRoutes';
import NotFound from '../common/404';

class upkeep extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route}/>
          ))
        }
        <Route path="/storage" render={()=><Redirect to="/storage/myDelivery"/>}/>
         <Route component={NotFound}/>
      </Switch>
    )
  }
}
export default upkeep;