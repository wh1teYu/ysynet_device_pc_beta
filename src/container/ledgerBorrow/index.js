/*
 * @Author: yuwei -资产借用 -ledgerBorrow
 * @Date: 2018-06-30 14:23:01 
* @Last Modified time: 2018-06-30 14:23:01 
 */
import React, { Component } from 'react';
import { Route, Switch ,Redirect} from 'react-router-dom';
import RouteWithSubRoutes from '../../route/routeWithSubRoutes';
import NotFound from '../common/404';

class LedgerBorrow extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route}/>
          ))
        }
        <Route path="/ledgerBorrow" render={()=><Redirect to="/ledgerBorrow/borrowRecord"/>}/>
         <Route component={NotFound}/>
      </Switch>
    )
  }
}
export default LedgerBorrow;