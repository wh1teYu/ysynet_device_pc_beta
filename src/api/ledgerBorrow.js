/*
 * @Author: yuwei -资产借用
 * @Date: 2018-06-30 14:27:39 
* @Last Modified time: 2018-06-30 14:27:39 
 */
import {_local} from './local';
const ledgerBorrow = {
  queryUserDeptListByUserId:`${_local}/dept/queryUserDeptListByUserId`,//查询当前用户使用科室 借用
  selectUseDeptList:`${_local}/dept/selectUseDeptList`,//管理部门下拉框 查询当前机构使用科室   借出 
  findBorrowRecordList:`${_local}/borrowController/findBorrowRecordList`,//借用记录查询列表
  BorrowRecordList: `${_local}/borrowController/findBorrowRecordList`,    //查询借用记录列表
  updateBorrow: `${_local}/borrowController/updateBorrow`,      //归还
  mgtDeptList: `${_local}/dept/queryManagerDeptListByUserId`,   //管理科室
  addBorrow: `${_local}/borrowController/addBorrow`,            //新增借出
  queryAssetsList: `${_local}/borrowController/queryAssetsList`, //选择资产列表

  /* 借用统计 */
  selectAssectBorrowCountChart:`${_local}/borrowController/selectAssectBorrowCountChart`,//借用统计图表数据
  selectAssectBorrowCount:`${_local}/borrowController/selectAssectBorrowCount`,//借用统计列表
  /* 借用申请 borrowApply */
  updateBorrowInfo:`${_local}/borrowController/updateBorrowInfo`,//编辑借用申请详情
  updateBorrowFstate:`${_local}/borrowController/updateBorrowFstate`,//修改借用处理状态
}

export default ledgerBorrow;