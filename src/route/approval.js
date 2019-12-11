/*
 * @Author: yuwei approval 审批管理
 * @Date: 2018-07-11 14:30:03 
* @Last Modified time: 2018-07-11 14:30:03 
 */
import asyncComponent from './asyncComponent';

export default { 
  path: '/approval', 
  name: '审批管理', 
  component: asyncComponent(() => import("../container/approval")),
  routes: [
    { exact:true, path: '/approval/approvalNew', name: '新品审批', component: asyncComponent(() => import("../container/approval/approvalNew"))},
    { exact:true, path: '/approval/approvalNew/details/:id', name: '新品审批', component: asyncComponent(() => import("../container/approval/approvalNew/details"))},
  
  ] 
}