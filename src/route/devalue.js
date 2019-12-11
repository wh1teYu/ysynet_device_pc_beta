/**资产折旧*/
import asyncComponent from './asyncComponent';

export default { 
  path: '/devalue', 
  name: '资产折旧', 
  component: asyncComponent(() => import("../container/devalue")),
  routes: [
    { exact:true, path: '/devalue/withdraw', name: '折旧计提', component: asyncComponent(() => import("../container/devalue/withdraw"))},
    { exact:true, path: '/devalue/withdraw/details/:id', name: '折旧详情', component: asyncComponent(() => import("../container/devalue/withdraw/details"))},
    { exact:true, path: '/devalue/summary', name: '折旧汇总', component: asyncComponent(() => import("../container/devalue/summary"))},
  ] 
}