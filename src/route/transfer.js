import asyncComponent from './asyncComponent';

export default { 
  path: '/transfer', 
  name: '资产转科', 
  component: asyncComponent(() => import("../container/transfer")),
  routes: [
    { exact:true, path: '/transfer/newTransfer', name: '新建转科', component: asyncComponent(() => import("../container/transfer/new"))},
    { exact:true, path: '/transfer/transferRecord', name: '转科记录', component: asyncComponent(() => import("../container/transfer/record"))},
    { exact:true, path: '/transfer/transferRecord/details/:id', name: '转科详情', component: asyncComponent(() => import("../container/transfer/record/details"))},
    { exact:true, path: '/transfer/transferManager', name: '转科管理', component: asyncComponent(() => import("../container/transfer/manager"))},
    { exact:true, path: '/transfer/transferManager/details/:id', name: '转科管理详情', component: asyncComponent(() => import("../container/transfer/manager/details"))},
    { exact:true, path: '/transfer/transferManager/edit/:id', name: '转科管理操作', component: asyncComponent(() => import("../container/transfer/manager/edit"))},
  ] 
}