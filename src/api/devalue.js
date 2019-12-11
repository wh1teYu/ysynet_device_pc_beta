import {_local} from './local';
const devalue = {
  getDevalueList:`${_local}/equipmentDepreciation/selectAssetsCapitalStructureList`,//获取折旧记录列表
  subWithDraw:`${_local}/equipmentDepreciation/insertEquipmentDepreciation`,//提交计提
  getDetailTable:`${_local}/equipmentDepreciation/selectEquimentDepreciationPayList`,//获取折旧记录详细列表
  selectDepreciationTypeCheckList:`${_local}/equipmentDepreciation/selectDepreciationTypeCheckList`,//折旧计提详情查询折旧分类下拉框
  exportAssetsCapitalStructureList:`${_local}/equipmentDepreciation/exportAssetsCapitalStructureList`,//导出折旧信息
  selectUseDeptList:`${_local}/dept/selectUseDeptList`,//获取当前机构 使用科室下拉框
  queryManagerDeptListByUserId:`${_local}/dept/queryManagerDeptListByUserId`,//查询当前用户的所有关联管理科室
  /**@param bDeptId 管理科室ID
    * @param acctDate 折旧月份
    */
  initializeInvoiceMonth:`${_local}/invoiceZcController/initializeInvoiceMonth`,//初始化折旧月份
  /**
   * 查询管理科室的折旧方式
   * @param bDeptId 管理科室ID
   * @return 01自然月 02会计月
   */
  selectEquipmentConfig:`${_local}/invoiceZcController/selectEquipmentConfig`,//查询管理科室的折旧方式

  //折旧汇总
  selectUseDeptEquimentDepreciationSummary:`${_local}/equipmentDepreciation/selectUseDeptEquimentDepreciationSummary`,//折旧汇总列表
  exportUseDeptEquimentDepreciationSummary:`${_local}/equipmentDepreciation/exportUseDeptEquimentDepreciationSummary`,//导出折旧汇总
}
export default devalue;