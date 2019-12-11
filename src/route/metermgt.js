import asyncComponent from './asyncComponent';

export default { 
  path: '/meterMgt', 
  name: '计量管理', 
  component: asyncComponent(() => import("../container/meterMgt")),
  routes: [
    { exact:true, path: '/meterMgt/meterStand', name: '计量台账', component: asyncComponent(() => import("../container/meterMgt/meterStand"))},
    { exact:true, path: '/meterMgt/meterStand/add', name: '新增计量台账', component: asyncComponent(() => import("../container/meterMgt/meterStand/add"))},
    { exact:true, path: '/meterMgt/meterStand/check/:id', name: '检测计量台账', component: asyncComponent(() => import("../container/meterMgt/meterStand/check"))},
    { exact:true, path: '/meterMgt/meterQuery', name: '计量查询', component: asyncComponent(() => import("../container/meterMgt/meterQuery"))},
    { exact:true, path: '/meterMgt/meterQuery/details/:id', name: '计量查询', component: asyncComponent(() => import("../container/meterMgt/meterQuery/details"))},
  ] 
}