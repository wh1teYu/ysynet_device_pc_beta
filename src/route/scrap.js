import asyncComponent from './asyncComponent';

export default { 
  path: '/scrap', 
  name: '资产报废', 
  component: asyncComponent(() => import("../container/scrap")),
  routes: [
    { exact:true, path: '/scrap/scrapApply', name: '报废申请', component: asyncComponent(() => import("../container/scrap/apply"))},
    { exact:true, path: '/scrap/scrapRecord', name: '报废记录', component: asyncComponent(() => import("../container/scrap/record"))},
    { exact:true, path: '/scrap/scrapRecord/:id', name: '报废记录详情', component: asyncComponent(() => import("../container/scrap/record/detail"))},
    { exact:true, path: '/scrap/scrapManager', name: '报废管理', component: asyncComponent(() => import("../container/scrap/manager"))},
    { exact:true, path: '/scrap/scrapManager/:id', name: '报废管理详情', component: asyncComponent(() => import("../container/scrap/manager/detail"))},
    { exact:true, path: '/scrap/scrapManager/execute/:id', name: '报废执行详情', component: asyncComponent(() => import("../container/scrap/manager/execute"))},
    { exact:true, path: '/scrap/scrapAppraisal', name: '技术鉴定', component: asyncComponent(() => import("../container/scrap/appraisal"))},
    { exact:true, path: '/scrap/scrapAppraisal/:id', name: '鉴定详情', component: asyncComponent(() => import("../container/scrap/appraisal/detail"))},
  ] 
}