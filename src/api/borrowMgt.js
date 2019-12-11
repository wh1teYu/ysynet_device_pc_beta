

import {_local} from './local';

const borrowMgt = {
  BorrowRecordList: `${_local}/borrowController/findBorrowRecordList`,    //查询借用记录列表
  updateBorrow: `${_local}/borrowController/updateBorrow`,      //归还
  selectUseDeptList: `${_local}/dept/selectUseDeptList`,        //借出科室
  mgtDeptList: `${_local}/dept/queryManagerDeptListByUserId`,   //管理科室
  addBorrow: `${_local}/borrowController/addBorrow`,            //新增借出
  queryAssetsList: `${_local}/borrowController/queryAssetsList`, //选择资产列表
}

export default borrowMgt;