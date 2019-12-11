import {_local} from './local';
const inventory = {
    submitInventoryOrders:`${_local}/stockCount/createStockCount`,//提交清查记录新增
    selectUseDeptList:`${_local}/dept/selectUseDeptList`,//获取使用科室下拉框
    queryStockCountList:`${_local}/stockCount/queryStockCountList`,//获取清查列表
    queryStockCount:`${_local}/stockCount/queryStockCount`,//查单条
    updateStockCount:`${_local}/stockCount/updateStockCount`,//提交单条
    queryStockCountDetailList:`${_local}/stockCountDetail/queryStockCountDetailList`,//盘点明细搜索条件接口
    importQrcodeIn:`${_local}/stockCountDetail/ImportQrcodeIn`,//导入文件上传的路径

}

export default inventory;