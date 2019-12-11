import {_local} from './local';

const transfer = {
  /**
   * 模糊查询当前机构所有用户
	 * @param orgId 机构id（可为空）
	 * @param userName 用户名（模糊匹配）
	 * @return value 用户id   deptName 科室名称  userName用户名称
   */
  getSelectUserNameList: `${_local}/user/selectUserNameList`,// 新保管人模糊搜索框
  /**
   * 查询机构所有的使用科室，管理科室
    * @param orgId 机构id（可为空，为空则查询当前登录用户）
    * @param deptName 科室名称（模糊匹配）
    * @param deptType （00使用科室，01管理科室，若为空，则查询所以科室）
    * @return value 科室id   text 科室名称
   */
  getSelectUseDeptList: `${_local}/dept/selectUseDeptList`,//转入转出科室模糊搜索框

  /**
	 * 查询单个科室的地址
	 * @param deptGuid 科室id
	 * @return deptGuid 科室id  Address 地址
	 */
  queryUserDeptListByUserId:`${_local}/dept/queryUserDeptListByUserId`,//查询当前用户使用科室
  getSelectDeptAddress: `${_local}/dept/selectDeptAddress`,//根据所有转入科室带出新存放地址
  getInsertTransfer: `${_local}/transferController/insertTransfer`,// 新建转科-新增
  
  // 转科管理 + 转科记录
  getSelectTransferList: `${_local}/transferController/selectTransferList`, //列表查询
  getSelectTransferDetailList: `${_local}/transferController/selectTransferDetailList`,//查询转科单明细列表
  printTransfer:`${_local}/transferController/printTransfer`,//打印转科单明细
  getUpdateTransfer: `${_local}/transferController/updateTransfer`,//上传照片
  uploadFile :`${_local}/StaticDataController/uploadFile`,//上传申请附件
}
export default transfer;