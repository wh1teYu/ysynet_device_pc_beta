import {_local} from './local';
const basicdata = {
  queryManagerDeptListByUserId:`${_local}/dept/queryManagerDeptListByUserId`,//查询当前用户的所有关联管理科室
  selectUseDeptList:`${_local}/dept/selectUseDeptList`,//资产弹窗选择科室
 // getTreeData:`${_local}/maintainOrderController/selectMaintainTemplateEquipment`,//获取树结构的保养模板信息
  addMaintainTmp:`${_local}/maintainOrderController/insertMaintainTemplate`,//添加保养模版（1级）
  addEuoteTmp:`${_local}/maintainOrderController/insertMaintainTemplate`,//添加二级模板（2级）
  addEuoteTmpModal:`${_local}/maintainOrderController/insertMaintainTemplateDetail`,//添加引用模板
  queryOneModule:`${_local}/maintainOrderController/selectMaintainTemplate`,///查询一级模板以及下拉框内容
  queryTwoModule:`${_local}/maintainOrderController/selectMaintainTemplateDetail`,//查询二级项目-------------
  queryAllProject:`${_local}/maintainOrderController/searchMaintainType`,//查询引用新增-------------
  queryEquipmentTmp:`${_local}/maintainOrderController/selectEquipmentInTemplate`,//查询某级下面的transfer设备
  editEEquipmentTmp:`${_local}/maintainOrderController/insertTemplataEquipment`,//改变transfer设备方向
  deleteOne:`${_local}/maintainOrderController/deleteMaintainTemplate`,//删除一级tree-------------
  deleteTwo:`${_local}/maintainOrderController/deleteMaintainTemplateDetail`,//删除二级tree-------------
  editModuleName:`${_local}/maintainOrderController/updateMaintainTemplateName`,//编辑名称-------------
  //物资分类
  queryStaticZcByCode:`${_local}/staticInfoZcController/queryStaticZcByCode`,//获取顶层分类的staticId
  searchStaticZc:`${_local}/staticInfoZcController/searchStaticZc`,//获取资产分类__列表
  insertStaticInfoZc:`${_local}/staticInfoZcController/insertStaticInfoZc`,//添加资产分类
  updateStaticInfoZc:`${_local}/staticInfoZcController/updateStaticInfoZc`,//编辑资产分类
  deleteStaticInfoZc:`${_local}/staticInfoZcController/deleteStaticInfoZc`,//删除资产分类
  selectAssets:`${_local}/assetsTypeController/selectAssets`,//资产列表
  insertAssetsType:`${_local}/assetsTypeController/insertAssetsType`,//分类关联资产
  queryAssetsTypeList:`${_local}/assetsTypeController/queryAssetsTypeList`,//查询分类关联资产
  deleteAssetsTypeList:`${_local}/assetsTypeController/deleteAssetsTypeList`,//移出分类
  queryStaticZcByName: `${_local}/staticInfoZcController/queryStaticZcByName`,//搜索框

  //审批配置
  insertZCApproval:`${_local}/approvalController/insertZCApproval`,//新建审批配置
  selectZCApprovalList:`${_local}/approvalController/selectZCApprovalList`,//审批列表
  deleteZCApproval:`${_local}/approvalController/deleteZCApproval`,//删除审批配置
  updateZCApprovalSeqNum:`${_local}/approvalController/updateZCApprovalSeqNum`,//审批上下移动  
  queryUserListByOrgId:`${_local}/dept/queryUserListByOrgId`,//查询审批人-当前机构所有用户

  //工作台配置
  findGroupList: `${_local}/user/findGroupList`,        //查询当前机构用户组
  documentTypeList: `${_local}/StaticDataController/documentTypeList`,        //单据类型和 最新单据列表
  insertOrgConfig: `${_local}/orgConfigController/insertOrgConfig`,            //添加或修改工作台配置

  //打印配置管理
  selectStoragePrintConfigList:`${_local}/storagePrintConfigController/selectStoragePrintConfigList`,//查询库房配置列表
  updateStoragePrintConfig:`${_local}/storagePrintConfigController/updateStoragePrintConfig`,//修改管理科室打印配置

  //编码规则
  insertCpbmConfigZc:`${_local}/cpbmConfigZcController/insertCpbmConfigZc`,//新增/编辑编码规则
  selectCpbmConfigZc:`${_local}/cpbmConfigZcController/selectCpbmConfigZc`,//查询编码规则
  previewCpbmConfigZc:`${_local}/cpbmConfigZcController/previewCpbmConfigZc`,//预览编码

  //我的服务商
  selectServiceList: `${_local}/maintainOrderController/selectServiceList`,//我的服务商列表
  selectStaticFOrgList: `${_local}/StaticDataController/selectStaticFOrgList`,//查询供应商字典列表
  insertServiceInfo: `${_local}/maintainOrderController/insertServiceInfo`,//添加我的服务商
  deleteServiceInfo: `${_local}/maintainOrderController/deleteServiceInfo`,//删除我的服务商
}
export default basicdata;