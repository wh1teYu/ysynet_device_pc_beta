/*
 * @Author: yuwei - 效益分析
 * @Date: 2018-06-26 11:41:12 
* @Last Modified time: 2018-06-26 11:41:12 
 */
import React, { Component } from 'react';
import { Route, Switch ,Redirect} from 'react-router-dom';
import RouteWithSubRoutes from '../../route/routeWithSubRoutes';
import NotFound from '../common/404';

class BenefitAnalysis extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route}/>
          ))
        }
        <Route path="/benefitAnalysis" render={()=><Redirect to="/benefitAnalysis/operation"/>}/>
         <Route component={NotFound}/>
      </Switch>
    )
  }
}
export default BenefitAnalysis;