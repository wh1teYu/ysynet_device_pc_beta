/*  巡检记录  */

import {_local} from './local';

const inspectionMgt = {
    queryCheckInfoList: `${_local}/checkInfoController/queryCheckInfoList`,   //巡检列表
    selectUseDeptList: `${_local}/dept/selectUseDeptList`,
    queryUserListByOrgId: `${_local}/dept/queryUserListByOrgId`,            //巡检人
    insertCheckInfo: `${_local}/checkInfoController/insertCheckInfo`,       //新增巡检
};

export default inspectionMgt;