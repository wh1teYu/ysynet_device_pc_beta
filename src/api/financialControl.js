import {_local} from './local';
const financialControl = {
  selectZCInvoiceList:`${_local}/invoiceZcController/selectZCInvoiceList`,//设备发票-列表
  selectUseDeptList:`${_local}/dept/selectUseDeptList`,//管理部门下拉框
  queryManagerDeptListByUserId:`${_local}/dept/queryManagerDeptListByUserId`,//当前用户管理科室
  selectFOrgList:`${_local}/StaticDataController/selectFOrgList`,//获取供应商列表
  selectInvoiceDetail:`${_local}/invoiceZcController/selectInvoiceDetail`,//设备发票详情的table
  updateZCInvoiceFstate:`${_local}/invoiceZcController/updateZCInvoiceFstate`,//审核发票

  //入库汇总
  selectImportCollect:`${_local}/invoiceZcController/selectImportCollect`,//查询入库汇总
  selectOutAcctCollect:`${_local}/invoiceZcController/selectOutAcctCollect`,//查询出库汇总
  selectBalanceCollect:`${_local}/invoiceZcController/selectBalanceCollect`,//查询结存汇总
  selectInventoryCollect:`${_local}/invoiceZcController/selectInventoryCollect`,//查询库存汇总
  selectInventoryCollectNum:`${_local}/invoiceZcController/selectInventoryCollectNum`,//查询库存汇总-全部合计
  exportImportCollect:`${_local}/invoiceZcController/exportImportCollect`,//导出入库汇总
  exportOutAcctCollect:`${_local}/invoiceZcController/exportOutAcctCollect`,//导出出库汇总
  exportBalanceSumList:`${_local}/invoiceZcController/exportBalanceSumList`,//导出结存汇总
  exportInventoryCollect:`${_local}/invoiceZcController/exportInventoryCollect`,//导出库存汇总
  createForms:`${_local}/invoiceZcController/createForms`,//生成报表
  
  selectInvoiceByMonth:`${_local}/invoiceZcController/selectInvoiceByMonth`,//财务结账
  selectInvoiceDetailByMonth:`${_local}/invoiceZcController/selectInvoiceDetailByMonth`,//财务已结账详情
  sumInvoiceNotAcctCountMoney:`${_local}/invoiceZcController/sumInvoiceNotAcctCountMoney`,//未结账金额
  invoiceSettleAccount:`${_local}/invoiceZcController/invoiceSettleAccount`,//确认结账
  selectInvoiceMonth:`${_local}/invoiceZcController/selectInvoiceMonth`,//查询结账月份

  //付款计划
  selectPayPlanList:`${_local}/payPlanController/selectPayPlanList`,//查询付款计划列表
  selectPayPlanInvoiceList:`${_local}/payPlanController/selectPayPlanInvoiceList`,//查询发票
  selectPayPlanDetailList:`${_local}/payPlanController/selectPayPlanDetailList`,//查询详情table列表
  selectPlanDetailForgSum:`${_local}/payPlanController/selectPlanDetailForgSum`,//详情页面 - 查询供应商汇总
  insertPayPlan:`${_local}/payPlanController/insertPayPlan`,//新增/编辑付款计划
  selectPayPlanForgFOrgSum:`${_local}/payPlanController/selectPayPlanForgFOrgSum`,//汇总计划查询
  updatePayPlanFstate:`${_local}/payPlanController/updatePayPlanFstate`,//发布付款计划
  deletePayPlan:`${_local}/payPlanController/deletePayPlan`,//删除付款计划
  selectInvoicePayPlan:`${_local}/payPlanController/selectInvoicePayPlan`,//发票审核详情 付款情况
}
export default financialControl;