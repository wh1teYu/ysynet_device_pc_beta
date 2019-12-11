import asyncComponent from './asyncComponent';
export default {
    path: '/repairMgt',
    name: '维修管理', 
    component: asyncComponent(() => import("../container/repairMgt")), 
    routes: [
    { exact:true, path: '/repairMgt/repairReg', name: '报修登记', component: asyncComponent(() => import("../container/repairMgt/repairReg"))},
    { exact:true, path: '/repairMgt/repairRegList', name: '报修记录', component: asyncComponent(() => import("../container/repairMgt/repairReg/list"))},
    { exact:true, path: '/repairMgt/repairRegList/detail/:id', name: '详情', component: asyncComponent(() => import("../container/repairMgt/repairReg/detail"))},
    { exact:true, path: '/repairMgt/repairRegList/edit/:id', name: '编辑', component: asyncComponent(() => import("../container/repairMgt/repairReg/edit"))},
    { exact:true, path: '/repairMgt/myRepairList', name: '我的指派', component: asyncComponent(() => import("../container/repairMgt/myRepairList/list"))},
    { exact:true, path: '/repairMgt/myRepairList/detail/:id', name: '详情', component: asyncComponent(() => import("../container/repairMgt/myRepairList/detail"))},
    { exact:true, path: '/repairMgt/myRepairList/order/:id', name: '指派', component: asyncComponent(() => import("../container/repairMgt/myRepairList/order"))},
    { exact:true, path: '/repairMgt/myServiceList', name: '我的维修单', component: asyncComponent(() => import("../container/repairMgt/myServiceList/list"))},
    { exact:true, path: '/repairMgt/myServiceList/orderTaking/:id', name: '接修', component: asyncComponent(() => import("../container/repairMgt/myServiceList/orderTaking"))},
    { exact:true, path: '/repairMgt/myServiceList/complete/:id', name: '完成', component: asyncComponent(() => import("../container/repairMgt/myServiceList/complete"))},
    { exact:true, path: '/repairMgt/myServiceList/detail/:id', name: '详情', component: asyncComponent(() => import("../container/repairMgt/myServiceList/detail"))},
    { exact:true, path: '/repairMgt/myCheckList', name: '我的验收单', component: asyncComponent(() => import("../container/repairMgt/myCheckList/list"))},
    { exact:true, path: '/repairMgt/myCheckList/check/:id', name: '验收', component: asyncComponent(() => import("../container/repairMgt/myCheckList/check"))},
    { exact:true, path: '/repairMgt/myCheckList/detail/:id', name: '详情', component: asyncComponent(() => import("../container/repairMgt/myCheckList/detail"))},
    { exact:true, path: '/repairMgt/repairRecord', name: '维修记录', component: asyncComponent(() => import("../container/repairMgt/repairRecord/list"))},
    { exact:true, path: '/repairMgt/repairRecord/:id', name: '详情', component: asyncComponent(() => import("../container/repairMgt/repairRecord/detail"))},
    /* 工程师统计 */
    { exact:true, path: '/repairMgt/enginCount', name: '工程师统计', component: asyncComponent(() => import("../container/repairMgt/enginCount"))},
    { exact:true, path: '/repairMgt/deptCount', name: '科室统计', component: asyncComponent(() => import("../container/repairMgt/deptCount"))},
    { exact:true, path: '/repairMgt/errorCount', name: '故障统计', component: asyncComponent(() => import("../container/repairMgt/errorCount"))},
    /* 维修录入 */
    { exact:true, path: '/repairMgt/repairInput', name: '维修录入', component: asyncComponent(() => import("../container/repairMgt/repairInput"))},
    /* 维修明细 */
    { exact:true, path: '/repairMgt/repairDetail', name: '维修明细', component: asyncComponent(() => import("../container/repairMgt/repairDetails/list"))},
  
  ]
}