import asyncComponent from './asyncComponent';

export default { 
  path: '/upkeep', 
  name: '保养管理', 
  component: asyncComponent(() => import("../container/upkeep")),
  routes: [
    { exact:true, path: '/upkeep/addUpKeep', name: '保养登记', component: asyncComponent(() => import("../container/upkeep/addUpKeep"))},
    { exact:true, path: '/upkeep/upkeepTask', name: '保养任务', component: asyncComponent(() => import("../container/upkeep/upKeepTask"))},
    { exact:true, path: '/upkeep/upkeepTask/details/:id', name: '保养任务详情', component: asyncComponent(() => import("../container/upkeep/upKeepTask/details"))},
    { exact:true, path: '/upkeep/upkeepTask/finish/:id', name: '保养任务修改', component: asyncComponent(() => import("../container/upkeep/upKeepTask/finish"))},

    { exact:true, path: '/upkeep/upkeepRecord', name: '保养记录', component: asyncComponent(() => import("../container/upkeep/upKeepRecord"))},
    { exact:true, path: '/upkeep/upkeepRecord/details/:id', name: '保养记录详情', component: asyncComponent(() => import("../container/upkeep/upKeepRecord/details"))},
    { exact:true, path: '/upkeep/upkeepRecord/finish/:id', name: '保养记录修改', component: asyncComponent(() => import("../container/upkeep/upKeepRecord/finish"))},
    
    { exact:true, path: '/upkeep/upkeeplist', name: '保养工单', component: asyncComponent(() => import("../container/upkeep/upKeepList"))},
    { exact:true, path: '/upkeep/upkeeplist/details/:id', name: '保养工单详情', component: asyncComponent(() => import("../container/upkeep/upKeepList/details"))},
    { exact:true, path: '/upkeep/upkeeplist/finish/:id', name: '保养工单修改', component: asyncComponent(() => import("../container/upkeep/upKeepList/finish"))},
    { exact:true, path: '/upkeep/UpKeepDetail/details/:id', name: '保养列表详情', component: asyncComponent(() => import("../container/upkeep/UpKeepDetail/details"))},
    { exact:true, path: '/upkeep/UpKeepDetail/finish/:id', name: '保养列表修改', component: asyncComponent(() => import("../container/upkeep/UpKeepDetail/finish"))},
    { exact:true, path: '/upkeep/plan', name: '保养计划', component: asyncComponent(() => import("../container/upkeep/plan")) },
    { exact:true, path: '/upkeep/plan/details/:id', name: '保养计划详情', component: asyncComponent(() => import("../container/upkeep/plan/details")) },
    { exact:true, path: '/upkeep/plan/edit/:id', name: '保养计划编辑', component: asyncComponent(() => import("../container/upkeep/plan/edit")) },
    { exact:true, path: '/upkeep/newplan', name: '新建计划', component: asyncComponent(() => import("../container/upkeep/newplan")) },
    { exact:true, path: '/upkeep/upKeepCount', name: '保养统计', component: asyncComponent(() => import("../container/upkeep/upKeepCount"))},
    { exact:true, path: '/upkeep/upKeepAccount', name: '保养台账', component: asyncComponent(() => import("../container/upkeep/upKeepAccount"))},
    { exact:true, path: '/upkeep/upKeepAccount/newAdd', name: '新增台账', component: asyncComponent(() => import("../container/upkeep/upKeepAccount/newAdd"))},
    { exact:true, path: '/upkeep/upKeepAccount/edit/:id', name: '编辑台账', component: asyncComponent(() => import("../container/upkeep/upKeepAccount/edit"))},
    
  ] 
} 