import asyncComponent from './asyncComponent';

export default { 
  path: '/ledger', 
  name: '档案管理', 
  component: asyncComponent(() => import("../container/ledger/")),
  routes: [
      { exact: true, hasBread: true, path: '/ledger/ledgerReg', name: '资产登记', component: asyncComponent(() => import("../container/ledger/ledgerReg"))},
      { exact: true, hasBread: true, path: '/ledger/ledgerArchives', name: '资产档案', component: asyncComponent(() => import("../container/ledger/ledgerArchives/list"))},
      { exact: true, hasBread: true, path: '/ledger/lifecycle/:id', name: '生命周期', component: asyncComponent(() => import("../container/ledger/ledgerArchives/lifecycle"))},
      { exact: true, hasBread: true, path: '/ledger/ledgerArchives/:id', name: '详情', component: asyncComponent(() => import("../container/ledger/ledgerArchives/detail"))},
      { exact: true, hasBread: true, path: '/ledger/benefitAnalysis/:id', name: '效益分析', component: asyncComponent(() => import("../container/ledger/ledgerArchives/benefitAnalysis"))},
      { exact: true, hasBread: true, path: '/ledger/ledgerArchives/add/:id', name: '新增档案', component: asyncComponent(() => import("../container/ledger/ledgerArchives/add"))},
      { exact: true, hasBread: true, path: '/ledger/contract', name: '合同管理', component: asyncComponent(() => import("../container/ledger/contract"))},
      { exact: true, hasBread: true, path: '/ledger/contract/add', name: '新建合同', component: asyncComponent(() => import("../container/ledger/contract/add"))},
      { exact: true, hasBread: true, path: '/ledger/contract/add/:id', name: '编辑合同', component: asyncComponent(() => import("../container/ledger/contract/add"))},
      { exact: true, hasBread: true, path: '/ledger/contract/details/:id', name: '合同详情', component: asyncComponent(() => import("../container/ledger/contract/details"))},
      { exact: true, hasBread: true, path: '/ledger/tender', name: '招标管理', component: asyncComponent(() => import("../container/ledger/tender"))},
      { exact: true, hasBread: true, path: '/ledger/tender/add', name: '新建招标', component: asyncComponent(() => import("../container/ledger/tender/add"))},
      { exact: true, hasBread: true, path: '/ledger/tender/add/:id', name: '编辑招标', component: asyncComponent(() => import("../container/ledger/tender/add"))},
      { exact: true, hasBread: true, path: '/ledger/tender/details/:id', name: '编辑招标', component: asyncComponent(() => import("../container/ledger/tender/details"))},
    ]
}