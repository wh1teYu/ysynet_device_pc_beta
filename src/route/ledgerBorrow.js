/*
 * @Author: yuwei - 资产借用
 * @Date: 2018-06-30 14:28:23 
* @Last Modified time: 2018-06-30 14:28:23 
 */

import asyncComponent from './asyncComponent';

export default { 
  path: '/ledgerBorrow', 
  name: '资产借用', 
  component: asyncComponent(() => import("../container/ledgerBorrow")),
  routes: [
    { exact:true, path: '/ledgerBorrow/borrowRecord', name: '借用记录', component: asyncComponent(() => import("../container/ledgerBorrow/borrowRecord"))},
    { exact:true, path: '/ledgerBorrow/borrowHandle', name: '借用处理', component: asyncComponent(() => import("../container/ledgerBorrow/borrowHandle"))},
    { exact:true, path: '/ledgerBorrow/borrowApply', name: '借用申请', component: asyncComponent(() => import("../container/ledgerBorrow/borrowApply"))},
    { exact:true, path: '/ledgerBorrow/borrowApply/details/:id', name: '借用申请详情', component: asyncComponent(() => import("../container/ledgerBorrow/borrowApply/details"))},
    { exact:true, path: '/ledgerBorrow/borrowApply/add', name: '新增借用申请', component: asyncComponent(() => import("../container/ledgerBorrow/borrowApply/add"))},
    { exact:true, path: '/ledgerBorrow/borrowMgt', name: '借用管理', component: asyncComponent(() => import("../container/ledgerBorrow/borrowMgt"))},
    { exact:true, path: '/ledgerBorrow/borrowMgt/loan', name: '借出', component: asyncComponent(() => import("../container/ledgerBorrow/borrowMgt/loan"))},
    { exact:true, path: '/ledgerBorrow/borrowCount', name: '借用统计', component: asyncComponent(() => import("../container/ledgerBorrow/borrowCount"))},
   ] 
}