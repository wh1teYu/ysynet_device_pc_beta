import {_local} from './local';
const upkeep = {
  queryUserDeptListByUserId:`${_local}/dept/queryUserDeptListByUserId`,//查询当前用户使用科室
  getAssetInfo: `${_local}/assetsRecordController/selectAssetsRecordDetail`,//通过资产编号带出资产信息
  submitAssetInfo:`${_local}/maintainOrderController/insertMaintainOrder`,//提交保养登记表单
  selectUserNameList:`${_local}/user/selectUserNameList`,//保养登记-保养人
  selectServiceCheckList:`${_local}/maintainOrderController/selectServiceCheckList`,//保养登记-服务商
  uploadFile:`${_local}/StaticDataController/uploadFile`,//保养登记 - 上传附件 
  listToDetails:`${_local}/maintainOrderController/selectMaintainOrderDetail`,//立标进入详情获取对应信息
  getTreeData:`${_local}/maintainOrderController/selectTemplateAndTypeList`,//获取保养模板树状结构
  queryAllProject:`${_local}/maintainOrderController/searchMaintainType`,//查询引用新增-------------
  //保养计划列表
  planList:`${_local}/maintainOrderController/selectMaintainPlanList`,//保养计划列表
  //保养工单详情 - 打印
  printMaintain:`${_local}/maintainOrderController/printMaintain`,//打印
  //计划列表进详情
  queryPlanDetails:`${_local}/maintainOrderController/selectMaintainPlanDetail`,//查询单条明细
  editPlanDetails:`${_local}/maintainOrderController/updateMaintainPlan`,//修改保存计划
  deletePlanDetails:`${_local}/maintainOrderController/deleteMaintainPlan`,//删除计划
  doPlanDetails:`${_local}/maintainOrderController/updateMaintainPlanFstate`,//执行计划
  updateMaintainPlanDetailFstate:`${_local}/maintainOrderController/updateMaintainPlanDetailFstate`,//关闭计划

  //新建计划添加
  insertMaintainPlan:`${_local}/maintainOrderController/insertMaintainPlan`,//新建计划添加
  selectUseDeptList:`${_local}/dept/selectUseDeptList`,//资产弹窗选择科室
  getAssetsListInfo:`${_local}/maintainOrderController/selectAssetsListGetMainType`,//根据资产的GUID获取资产表格给的内容

  // 保养台账
  selectMaintainParameterList:`${_local}/maintainOrderController/selectMaintainParameterList`,//查询保养台账列表
  updateMaintainPlanFlag:`${_local}/maintainOrderController/updateMaintainPlanFlag`,//保养台账更新状态
  updateMaintainPlan:`${_local}/maintainOrderController/updateMaintainPlan`,//保养台账编辑修改保存
}

export default upkeep;