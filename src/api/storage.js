/*库房管理 */
import {_local} from './local';
const storage = {
  //公共接口
  selectFOrgList:`${_local}/StaticDataController/selectFOrgList`,//获取供应商列表
  selectUseDeptList:`${_local}/dept/selectUseDeptList`,//管理部门下拉框
  selectDeliveryForgList:`${_local}/delivery/selectDeliveryForgList`,//供应商下拉框
  getAdress:`${_local}/dept/selectDeptAddress`,//科室选择后获取下拉框
  selectContractCheckList: `${_local}/contractController/selectContractCheckList`,//查询合同下拉框
  //我的送货单
  selectZCDeliveryList:`${_local}/delivery/selectZCDeliveryList`,//查询我的送货单列表
  selectZCDeliveryDetail:`${_local}/delivery/selectZCDeliveryDetail`,//查询我的送货单详情
  //验收送货单
  selectZCDeliveryAndDetail:`${_local}/delivery/selectZCDeliveryAndDetail`,//查询送货单和明细
  updateDeliveryZc:`${_local}/delivery/updateDeliveryZc`,//验收送货单
  //入库管理
  inputImport:`${_local}/import/inputImport`,//入库单详情打印
  insertImport:`${_local}/import/insertImport`,//添加入库单
  searchStaticZc:`${_local}/staticInfoZcController/searchStaticZc`,//查询财务分类
  selectImportList:`${_local}/import/selectImportList`,//查询设备入库单列表
  selectImportDetail:`${_local}/import/selectImportDetail`,//查询设备入库单详情
  selectImportParticularsList:`${_local}/import/selectImportParticularsList`,//查询设备入库明细
  selectOutImportDetail:`${_local}/import/selectOutImportDetail`,//入库管理
  insertOutImport:`${_local}/import/insertOutImport`,//新增入库退货单
  //出库管理
  outputImport:`${_local}/outportAsset/printOutPort`,//出库单打印
  queryOutportAssetList:`${_local}/outportAsset/queryOutportAssetList`,//查询设备出库单列表
  queryOutportAssetDetailList:`${_local}/outportAsset/queryOutportAssetDetailList` ,//查询设备出库单详情
  queryOutportAssetDetails:`${_local}/outportAsset/queryOutportAssetDetails`,//查询设备明细列表
  //领用
  addOutportAsset:`${_local}/outportAsset/addOutportAsset`,//确认出库
  queryAssetListByImport: `${_local}/outportAsset/queryAssetListByImport`, //设备出库 -添加产品 查询列表
  //退库
  queryOutportAssetByAssetsRecordGuid:`${_local}/outportAsset/queryOutportAssetByAssetsRecordGuid`,//资产退库--通过资产编码查询产品
  addOutportAssetOut:`${_local}/outportAsset/addOutportAssetOut`,//资产退库 确认出库


   //新建送货单
   QUERYMATERIALLISTBYQRCODE:`${_local}/templateController/selectFitemidInFbarcode`,//根据二维码查询指定库房库存的产品
  
   //设备送货单
   searchAddrListByDeptGuid:`${_local}/dept/searchAddrListByDeptGuid`,//获取收获地址/信息
  //  selectUseDeptList:`${_local}/deptWorkController/selectUseDeptList`,//根据机构查询科室 -管理科室
   insertDelivery:`${_local}/delivery/insertDelivery`,//添加设备送货单
  //  selectZCDeliveryList:`${_local}/delivery/selectZCDeliveryList`,//查询设备送货单列表
  //  selectZCDeliveryDetail:`${_local}/delivery/selectZCDeliveryDetail`,//查询设备送货单详情
   printSendDeliveryDetails:`${_local}/delivery/printZCDeliveryDetail`,//打印送货单详情
   
   //新增设备发票
   insertInvoiceZc:`${_local}/invoiceZcController/insertInvoiceZc`,//新增设备发票
   selectZCDeliveryListInvoice:`${_local}/invoiceZcController/selectZCDeliveryList`,//查询设备送货单列表
   //设备发票查询
   selectZCInvoiceList:`${_local}/invoiceZcController/selectZCInvoiceList`,//设备发票查询列表
   deleteInvoiceZc:`${_local}/invoiceZcController/deleteInvoiceZc`,//设备发票查询列表 - 删除
   updateInvoiceZc:`${_local}/invoiceZcController/updateInvoiceZc`,//设备发票查询列表 - 编辑
   selectInvoiceDetail:`${_local}/invoiceZcController/selectInvoiceDetail`,//设备发票详情的table
    //库存查询
    selectAssetsRepertoryList:`${_local}/assetsRecordController/selectAssetsRepertoryList`,//库存查询列表
    //付款进度
    selectPayContractList:`${_local}/contractController/selectPayContractList`,//查询付款合同列表	
    selectContractAssetsList:`${_local}/contractController/selectContractAssetsList`,//查询合同关联的资产	
    selectContractPayDetailList:`${_local}/contractController/selectContractPayDetailList`,//查询合同付款明细	
    insertContractPayDetail:`${_local}/contractController/insertContractPayDetail`,//添加合同付款明细	

}

export default storage;