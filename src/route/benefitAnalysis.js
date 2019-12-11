/*
 * @Author: yuwei -效益分析路由
 * @Date: 2018-06-26 11:51:47 
* @Last Modified time: 2018-06-26 11:51:47 
 */
import asyncComponent from './asyncComponent';

export default { 
  path: '/benefitAnalysis', 
  name: '效益分析', 
  component: asyncComponent(() => import("../container/benefitAnalysis")),
  routes: [
    { exact:true, path: '/benefitAnalysis/operation', name: '运行数据导入', component: asyncComponent(() => import("../container/benefitAnalysis/operation"))},
    { exact:true, path: '/benefitAnalysis/income', name: '收入数据导入', component: asyncComponent(() => import("../container/benefitAnalysis/income"))},
    { exact:true, path: '/benefitAnalysis/expenses', name: '支出数据导入', component: asyncComponent(() => import("../container/benefitAnalysis/expenses"))},
    { exact:true, path: '/benefitAnalysis/deptBenefitQuery', name: '效益分析查询', component: asyncComponent(() => import("../container/benefitAnalysis/deptBenefitQuery"))},
    { exact:true, path: '/benefitAnalysis/incomeCount', name: '收入统计', component: asyncComponent(() => import("../container/benefitAnalysis/incomeCount"))},
  ] 
}