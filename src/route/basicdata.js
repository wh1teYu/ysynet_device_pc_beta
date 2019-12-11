import asyncComponent from './asyncComponent';

export default { 
  path: '/basicdata', 
  name: '基础数据', 
  component: asyncComponent(() => import("../container/basicdata")),
  routes: [
      { exact: true, hasBread: true, path: '/basicdata/maintainTmp', name: '保养模板', component: asyncComponent(() => import("../container/basicdata/maintainTmp/maintainTmp"))},
      { exact: true, hasBread: true, path: '/basicdata/suppliesClassify', name: '物资分类', component: asyncComponent(() => import("../container/basicdata/suppliesClassify"))},  
      { exact: true, hasBread: true, path: '/basicdata/financeClassify', name: '财政分类', component: asyncComponent(() => import("../container/basicdata/financeClassify"))},  
      { exact: true, hasBread: true, path: '/basicdata/depreciateClassify', name: '折旧分类', component: asyncComponent(() => import("../container/basicdata/depreciateClassify"))},  
      { exact: true, hasBread: true, path: '/basicdata/contableClassify', name: '财务分类', component: asyncComponent(() => import("../container/basicdata/contableClassify"))},  
      { exact: true, hasBread: true, path: '/basicdata/approvalSetting', name: '审批配置', component: asyncComponent(() => import("../container/basicdata/approvalSetting"))},
      { exact: true, hasBread: true, path: '/basicdata/approvalSetting/add', name: '新增审批配置', component: asyncComponent(() => import("../container/basicdata/approvalSetting/add"))},
      { exact: true, hasBread: true, path: '/basicdata/approvalSetting/add/:id', name: '编辑审批配置', component: asyncComponent(() => import("../container/basicdata/approvalSetting/add"))},
      { exact: true, hasBread: true, path: '/basicdata/approvalSetting/details/:id', name: '审批配置详情', component: asyncComponent(() => import("../container/basicdata/approvalSetting/details"))},
      { exact: true, hasBread: true, path: '/basicdata/workplaceConfig', name: '工作台配置', component: asyncComponent(() => import("../container/basicdata/workplaceConfig"))},
      { exact: true, hasBread: true, path: '/basicdata/numberRules', name: '编码规则', component: asyncComponent(() => import("../container/basicdata/numberRules"))},
      { exact: true, hasBread: true, path: '/basicdata/configCtrl', name: '打印配置', component: asyncComponent(() => import("../container/basicdata/configCtrl"))},
      { exact: true, hasBread: true, path: '/basicdata/serviceProvider', name: '我的服务商', component: asyncComponent(() => import("../container/basicdata/serviceProvider"))},
    ]
}