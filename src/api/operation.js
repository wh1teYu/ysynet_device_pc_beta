import promiseRequest from '../utils/promise_request';
import {_local} from './local';
export async function queryAssets(options) {
  return promiseRequest('/meqm/assetsRecordController/selectAssetsRecordDetail', options);
}

const operation={
  queryManagerDeptListByUserId:`${_local}/dept/queryManagerDeptListByUserId`,//查询当前用户关联管理科室
  selectUseDeptList:`${_local}/dept/selectUseDeptList`,//查询当前机构使用科室
  queryApprovalList:`${_local}/applyZcController/queryApprovalList`,//审批管理-列表
  /*工程师统计 */
  selectEngineerCountChart:`${_local}/rrpairOrderController/selectEngineerCountChart`,//工程师统计图表数据
  selectEngineerCount:`${_local}/rrpairOrderController/selectEngineerCount`,//工程师统计列表
  /*科室统计 */
  selectUseDeptCountChart:`${_local}/rrpairOrderController/selectUseDeptCountChart`,//科室统计图表数据
  selectUseDeptCount:`${_local}/rrpairOrderController/selectUseDeptCount`,//科室统计列表
  /* 故障统计 */
  selectAssectRrpairCountChart:`${_local}/rrpairOrderController/selectAssectRrpairCountChart`,//故障统计图表数据
  selectAssectRrpairCount:`${_local}/rrpairOrderController/selectAssectRrpairCount`,//故障统计列表

  /* 保养统计 */
  selectMaintainEngineerCountChart:`${_local}/maintainOrderController/selectMaintainEngineerCountChart`,//保养统计图表数据
  selectMaintainEngineerCount:`${_local}/maintainOrderController/selectMaintainEngineerCount`,//保养统计列表

}

export default operation;