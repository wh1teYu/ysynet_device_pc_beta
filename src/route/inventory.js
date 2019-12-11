/**资产盘点 */
import asyncComponent from './asyncComponent';

export default { 
  path: '/inventory', 
  name: '资产盘点', 
  component: asyncComponent(() => import("../container/inventory")),
  routes: [
    { exact:true, path: '/inventory/inventoryCategory', name: '盘点分类', component: asyncComponent(() => import("../container/inventory/inventoryCategory"))},
    { exact:true, path: '/inventory/inventoryRecord', name: '清查记录', component: asyncComponent(() => import("../container/inventory/inventoryRecord"))},
    { exact:true, path: '/inventory/inventoryRecord/details/:id', name: '清查详情', component: asyncComponent(() => import("../container/inventory/inventoryRecord/details"))},
  ] 
}