import asyncComponent from './asyncComponent';

export default { 
  path: '/workplace', name: '工作台', component: asyncComponent(() => import("../container/dashboard/workplace"))
}