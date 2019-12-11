/*
 * @Author: xuhao - 巡检管理 -inspectionMgt
 * @Date: 2018-08-08 10:49:11 
* @Last Modified time: 2018-08-08 10:49:11
 */
import asyncComponent from './asyncComponent';

export default { 
  path: '/inspectionMgt', 
  name: '巡检管理', 
  component: asyncComponent(() => import("../container/inspectionMgt")),
  routes: [
    { exact:true, path: '/inspectionMgt/inspectionRecord', name: '巡检记录', component: asyncComponent(() => import("../container/inspectionMgt/inspectionRecord"))},
    { exact:true, path: '/inspectionMgt/inspectionRecord/newRegister', name: '巡检登记', component: asyncComponent(() => import("../container/inspectionMgt/inspectionRecord/newRegister"))},
    { exact:true, path: '/inspectionMgt/inspectionRecord/detail/:id', name: '巡检详情', component: asyncComponent(() => import("../container/inspectionMgt/inspectionRecord/detail"))},
  ] 
}