/**
 * @file 档案管理 - 资产档案
 * @since 2018/04/20
 */
import promiseRequest from '../utils/promise_request';
import {_local} from './local';
const ledger = {
  selectUserNameList:`${_local}/user/selectUserNameList`,//模糊查询当前机构所有用户
  selectUseDeptList:`${_local}/dept/selectUseDeptList`,//管理部门下拉框
  getAllSelectList:`${_local}/dept/selectInsertAssert`,//获取所有下拉框数据列表
  getSelectEquipmentList: `${_local}/assetsRecordController/selectEquipmentList`,// 选择设弹框-设备列表查询
  getSelectFOrgList: `${_local}/StaticDataController/selectFOrgList`,// 查询供应商列表
  getSelectCertList: `${_local}/assetsRecordController/selectCertList`,// 查询注册证列表
  /**
   * 在添加设备提交之后的数据给选择设备弹框列表查询,然后设备列表查询的添加按钮带出一条信息,将设备id和品牌id点击保存按钮的时候传给后台
   */
  getInsertEquipment: `${_local}/assetsRecordController/insertEquipment`,// 添加设备 - 新增字典弹框
  getInsertAssetsRecord: `${_local}/assetsRecordController/insertAssetsRecord`, //新增/编辑资产档案 - 保存按钮
  selectStaticDataListTfBrand: `${_local}/StaticDataController/selectStaticDataList`,//新增设备-品牌模糊搜索
  getSelectAssetsRecordDetail: `${_local}/assetsRecordController/selectAssetsRecordDetail`, // 根据资产档案GUID查询资产详情
  getSelectEquipmentPayList: `${_local}/equipmentDepreciation/selectEquipmentPayList`,// 查询资金结构的值
  selectStaticDataListMeteringUnit:`${_local}/StaticDataController/selectStaticDataList`,//计量单位

  //招标管理
  insertZCTender:`${_local}/tenderController/insertZCTender`,//新增招标
  selectZCTenderList:`${_local}/tenderController/selectZCTenderList`,//招标列表
  deleteZCTenderInfo:`${_local}/tenderController/deleteZCTenderInfo`,//删除招标
  updateZCTenderFstate:`${_local}/tenderController/updateZCTenderFstate`,//正式提交招标
  selectZCTenderContractList:`${_local}/tenderController/selectZCTenderContractList`,//查询招标合同列表
  selectZCTenderApplyList:`${_local}/tenderController/selectZCTenderApplyList`,//查询招标申请
  queryApplyZcList:`${_local}/applyZcController/queryApplyZcList`,//选择申请列表
  insertZCTenderDetail:`${_local}/tenderController/insertZCTenderDetail`,//添加申请明细到申请详情
  deleteZCTenderDetail:`${_local}/tenderController/deleteZCTenderDetail`,//删除招标明细
  //合同管理
  queryContractList:`${_local}/contractController/queryContractList`,//合同管理列表
  insertContract:`${_local}/contractController/insertContract`,//新建合同
  updateContract:`${_local}/contractController/updateContract`,//新建合同
  deleteContract:`${_local}/contractController/deleteContract`,//删除合同
  updateContractFstate:`${_local}/contractController/updateContractFstate`,//正式提交合同
}
export default ledger;
// 计量单位
export async function selectStaticDataListMeteringUnit(options) {
  return promiseRequest(`${_local}/StaticDataController/selectStaticDataList?code=UNIT`, options);
}