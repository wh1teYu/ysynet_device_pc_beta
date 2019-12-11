import asyncComponent from './asyncComponent';

export default { path: '/system', name: '系统管理', component: asyncComponent(() => import("../container/system")), routes: [
  { path: '/system/user', exact: true, name: '用户管理', component: asyncComponent(() => import("../container/system/user"))},
  { path: '/system/group', exact: true, name: '组管理', component: asyncComponent(() => import("../container/system/group"))}
]}