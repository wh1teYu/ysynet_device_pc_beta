import React from 'react'
import {
  HashRouter as Router, Switch
} from 'react-router-dom';
import RouteWithSubRoutes from './routeWithSubRoutes';
import Home from '../container/home';
import Login from '../container/login';
import system from './system';
import ledger from './ledger';
import operation from './operation';
import dashboard from './dashboard';
import upkeep from './upkeep';
import basicdata from'./basicdata';
import transfer from './transfer';
import inventory from './inventory';
import scrap from './scrap';
import devalue from './devalue';
import metermgt from './metermgt';
import deptwork from './deptwork';
import storage from './storage';
import benefitAnalysis from './benefitAnalysis';
import ledgerBorrow from './ledgerBorrow';
import financialControl from './financialControl';
import approval from './approval';
import inspectionMgt from './inspectionMgt';
const routes = [
  { path: '/login', exact: true, component: Login },
  { path: '/register', exact: true, component: () =>  <div>register</div> },
  { path: '/', component: Home, routes: [
    system, ledger, operation, dashboard , upkeep ,basicdata, transfer , inventory, scrap ,devalue , metermgt , deptwork ,
    storage,
    benefitAnalysis,
    ledgerBorrow,
    financialControl,
    approval,
    inspectionMgt
  ]}
]

const RouterMonitor = () => (
  <Router>
    <Switch>
      {
        routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route}/>
        ))
      }
    </Switch>
  </Router>
)

export default RouterMonitor