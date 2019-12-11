/*
 * @Author: yuwei 审批管理
 * @Date: 2018-07-16 09:30:53 
* @Last Modified time: 2018-07-16 09:30:53 
 */
import {_local} from './local';
const approval = {
  queryUserListByOrgId:`${_local}/dept/queryUserListByOrgId`,//查询审批人-当前机构所有用户
  queryDeptListByUserId:`${_local}/dept/queryDeptListByUserId`,//申请科室
  queryApprovalList:`${_local}/applyZcController/queryApprovalList`,//审批管理-列表
  updateApproval:`${_local}/applyZcController/updateApproval`,//审批管理-审批通过/不通过
  checkNextApproval:`${_local}/applyZcController/checkNextApproval`,//审批管理-验证是否需要审批人
 }
export default approval;