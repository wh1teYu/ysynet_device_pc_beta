import { _local, FTP } from './local';
export default {
 queryUserDeptListByUserId:`${_local}/dept/queryUserDeptListByUserId` ,//用户关联的使用科室
 userLogin: `${_local}/login/userLogin`,//登录
 picUploadUrl: `${_local}/ftp/post`,//图片上传
 uploadFile: `${_local}/checkInfoController/uploadFile`, //文件上传
 deleteFile: `${_local}/checkInfoController/deleteFile`, //文件删除
 YSYPATH:`${_local}/ftp`,//项目地址
 selectFOrgList:`${_local}/StaticDataController/selectFOrgList`,//获取供应商列表
 selectUseDeptList:`${_local}/dept/selectUseDeptList`,//管理部门下拉框 - 所有机构
 queryManagerDeptListByUserId:`${_local}/dept/queryManagerDeptListByUserId`,//当前用户管理科室
 selectAssetsList: `${_local}/assetsRecordController/selectAssetsList`, //查询资产列表
 selectAssetsBuyPriceSum:`${_local}/assetsRecordController/selectAssetsBuyPriceSum`,//资产总金额
 selectAssetsIsNormalUseList:`${_local}/assetsRecordController/selectAssetsIsNormalUseList`,//查询资产列表 - 保养台账
 selectAssetsRecordDetail: `${_local}/assetsRecordController/selectAssetsRecordDetail`, // 根据资产档案GUID查询资产详情 
 selectRrpairAssetsRecordDetail: `${_local}/rrpairOrderController/selectRrpairAssetsRecordDetail`, // 根据资产档案GUID查询资产详情 
 updateAssetsRecordInfo: `${_local}/assetsRecordController/updateAssetsRecordInfo`, // 修改资产档案信息 
 insertAssetsRecord:`${_local}/assetsRecordController/insertAssetsRecord`,//新增/编辑资产档案信息 
 selectEquipmentDeptList:`${_local}/equipmentDepreciation/selectEquipmentDeptList`,//查询共用科室 - 资产折旧分摊比例
 insertEquipmentDepreciationDept:`${_local}/equipmentDepreciation/insertEquipmentDepreciationDept`,//新增共用科室 - 
 selectAssetsExtendList: `${_local}/assetsRecordController/selectAssetsExtendList`, // 根据资产档案GUID查询资产配件信息 
 deleteAssetsExtend: `${_local}/assetsRecordController/deleteAssetsExtend`, //  删除附件信息
 searchCertList: `${_local}/equipmentAdd/searchCertList`, // 根据资产 证件GUID 查询证件信息
 selectCertInfoList: `${_local}/assetsRecordController/selectCertInfoList`, // 根据资产编号assetsRecord 查询资产附件列表
 selectEqOperationInfoList: `${_local}/assetsRecordController/selectEqOperationInfoList`, // 根据资产GUID 查询资产档案操作记录列表
 importEquipments: `${_local}/equipmentAdd/importEquipments`, // 资产信息导入
 assetsFileUpLoad: `${_local}/assetsRecordController/assetsFileUpLoad`, // 资产附件上传 
 insertAssetsFile:`${_local}/assetsRecordController/insertAssetsFile`,// 新增资产附件- 弹窗
 assetsUploadFile:`${_local}/assetsRecordController/uploadFile`,//资产附件上传-现用
 deleteAssetsFile: `${_local}/assetsRecordController/deleteAssetsFile`, // 删除资产附件信息
 printEquipmentQrcode: `${_local}/equipmentAdd/printEquipmentQrcode`, // 打码
 importAssetsTemplate: `${FTP}/meqmFile/importAssetsTemplate.xlsx`, // 下载模板
 importModalTemplate: `${FTP}/meqmFile/importModalTemplate.xlsx`, // 下载资产模板
 accessoriesModalTemplate: `${FTP}/meqmFile/accessoriesModalTemplate.xlsx`, // 下载配件模板
getDepreciateDetails:`${_local}/equipmentDepreciation/selectEquipmentPayList`,//获取资产档案-这就信息
submitEquipmentPay:`${_local}/equipmentDepreciation/insertEquipmentPay`,//提交资产档案的资金结构 
insertCustomFieldZc:`${_local}/assetsRecordController/insertCustomFieldZc`,//资产添加用户自定义字段
selectCustomFieldZcList:`${_local}/assetsRecordController/selectCustomFieldZcList`,//查询资产的用户自定义字段
//报修登记
 insertOrUpdateRrpair: `${_local}/rrpairOrderController/insertOrUpdateRrpair`,
 selectRrpairFittingList: `${_local}/rrpairOrderController/selectRrpairFittingList`, //查询维修配件使用列表
 insertRrpairFitting: `${_local}/rrpairOrderController/insertRrpairFitting`, //资产列表添加维修附件信息
 insertRrpairExtend: `${_local}/rrpairOrderController/insertRrpairExtend`, //手动添加维修附件信息
 deleteRrpairFitting: `${_local}/rrpairOrderController/deleteRrpairFitting`, //删除当前维修配件
 //指派维修提交
 designateInOrOut: `${_local}/rrpairOrderController/designateInOrOut`,


 //维修记录
 selectRrpairList: `${_local}/rrpairOrderController/selectRrpairList`, //查询设备维修列表
 selectRrpairDetailList: `${_local}/rrpairOrderController/selectRrpairDetailList`, //查询设备维修详情列表
 selectEqOperationList: `${_local}/rrpairOrderController/selectEqOperationList`, //维修单详情操作记录
 updateRrpairOrderFstate: `${_local}/rrpairOrderController/updateRrpairOrderFstate`, //维修工单状态扭转
 printAssectRrpair:`${_local}/rrpairOrderController/printAssectRrpair`,//维修单详情-打印
 //维修明细
 selectRrpairFittingUseList:`${_local}/rrpairOrderController/selectRrpairFittingUseList`,//维修明细列表
 exportRrpairFittingUseList:`${_local}/rrpairOrderController/exportRrpairFittingUseList`,//维修明细列表 - 导出
 //验收
 insertRrpairOrderAcce: `${_local}/rrpairOrderController/insertRrpairOrderAcce`, //验收维修单

//保养工单
selectMaintainOrderList:`${_local}/maintainOrderController/selectMaintainOrderList`, //查询保养工单列表

//工作台
getSelectOrderNumber: `${_local}/StaticDataController/selectOrderNumber`,//待办事项

//获取效益分析页面数据
// getBenefitAnalysis :'https://www.easy-mock.com/mock/5a572f501288172a545ad02f/equipment_pc/get/benefitAnalysis',
// getDataAnalysis  :'https://www.easy-mock.com/mock/5a572f501288172a545ad02f/equipment_pc/get/dataAnalysis ',
selectAssetsBenefitMap:`${_local}/benefitController/selectAssetsBenefitMap`,
//资产档案
importAssets:`${_local}/equipmentAdd/importAssetsOrParts`,//资产导入
addAssets:`${_local}/equipmentAdd/addAssetsOrParts`,//保存通过验证的资产导入
exportApplyList:`${_local}/assetsRecordController/exportApplyList`,//资产导出
//资产档案-详情配件
insertAssetsExtend:`${_local}/assetsRecordController/insertAssetsExtend`,// 新增配件
printAssetsExtendQrcode:`${_local}/equipmentAdd/printAssetsExtendQrcode`,//资产打印
//资产档案-生命周期
querySelectRrpairList:`${_local}/rrpairOrderController/selectRrpairList`,//维修
querySelectMaintainOrderList:`${_local}/maintainOrderController/selectMaintainOrderList`,//保养
selectTransferDetailList:`${_local}/transferController/selectAssertTransferList`,//转科
selectEquimentDepreciationPayList:`${_local}/equipmentDepreciation/selectEquimentDepreciationPayList`,//折旧
selectContractRecordList:`${_local}/contractController/selectContractRecordList`,//合同
selectMeterRecordList:`${_local}/meterRecordController/selectMeterRecordList`,//计量


//资产档案 - 生成编码
createAssetsRecord:`${_local}/assetsRecordController/createAssetsRecord`,//生成编码
insertCreateAssetsRecord:`${_local}/assetsRecordController/insertCreateAssetsRecord`,//保存编码
};