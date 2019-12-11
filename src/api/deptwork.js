import {_local} from './local';
const deptwork = {
  selectUseDeptList:`${_local}/dept/selectUseDeptList`,//资产弹窗选择科室
  selectAssetsList:`${_local}/assetsRecordController/selectAssetsList`,
  queryDeptListByUserId:`${_local}/dept/queryDeptListByUserId`,//使用科室下拉框
  queryUserListByOrgId:`${_local}/dept/queryUserListByOrgId`,//查询审批人-当前机构所有用户
  //新建申请
  queryApplyZcList:`${_local}/applyZcController/queryApplyZcList`,//申请列表
  deleteApplyZc:`${_local}/applyZcController/deleteApplyZc`,//申请列表删除
  insertApplyZc:`${_local}/applyZcController/insertApplyZc`,//新建申请
  queryApplyZc:`${_local}/applyZcController/queryApplyZc`,//申请详情
  checkApproval:`${_local}/applyZcController/checkApproval`,//验证是否需要制定审批人
  updateApplyZc:`${_local}/applyZcController/updateApplyZc`,//修改申请
  printApplyZc:`${_local}/applyZcController/printApplyZc`,//打印申请单详情
  selectApplyDetailComboBox:`${_local}/applyZcController/selectApplyDetailComboBox`,//查询可以打印的申请单明细下拉框
}
export default deptwork;