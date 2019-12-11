/*
 * @Author: yuwei  - 财务管理 financialControl
 * @Date: 2018-07-05 14:00:44 
* @Last Modified time: 2018-07-05 14:00:44 
 */

import asyncComponent from './asyncComponent';

export default { 
  path: '/financialControl', 
  name: '财务管理', 
  component: asyncComponent(() => import("../container/financialControl")),
  routes: [
    { exact:true, path: '/financialControl/auditInvoice', name: '发票审核', component: asyncComponent(() => import("../container/financialControl/auditInvoice"))},
    { exact:true, path: '/financialControl/auditInvoice/details/:id', name: '发票审核详情', component: asyncComponent(() => import("../container/financialControl/auditInvoice/details"))},
    { exact:true, path: '/financialControl/payPlan', name: '付款计划', component: asyncComponent(() => import("../container/financialControl/payPlan"))},
    { exact:true, path: '/financialControl/payPlan/edit/:id', name: '编辑计划', component: asyncComponent(() => import("../container/financialControl/payPlan/add"))},
    { exact:true, path: '/financialControl/payPlan/details/:id', name: '查看计划', component: asyncComponent(() => import("../container/financialControl/payPlan/add"))},
    { exact:true, path: '/financialControl/payPlan/add', name: '新建计划', component: asyncComponent(() => import("../container/financialControl/payPlan/add"))},
    
    { exact:true, path: '/financialControl/warehouseSummary', name: '入库汇总', component: asyncComponent(() => import("../container/financialControl/warehouseSummary"))},
    { exact:true, path: '/financialControl/outboundSummary', name: '出库汇总', component: asyncComponent(() => import("../container/financialControl/outboundSummary"))},
    { exact:true, path: '/financialControl/balanceSummary', name: '结存汇总', component: asyncComponent(() => import("../container/financialControl/balanceSummary"))},
    { exact:true, path: '/financialControl/inventorySummary', name: '库存汇总', component: asyncComponent(() => import("../container/financialControl/inventorySummary"))},
    { exact:true, path: '/financialControl/financialClosing', name: '财务结账', component: asyncComponent(() => import("../container/financialControl/financialClosing"))},
    { exact:true, path: '/financialControl/financialClosing/details', name: '财务结账详情', component: asyncComponent(() => import("../container/financialControl/financialClosing/details"))},
    
  ] 
}