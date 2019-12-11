import promiseRequest from '../utils/promise_request';
import upkeep from './upkeep';
import { _local } from './local';
// 查询科室
export async function queryScrapList(options) {
  return promiseRequest(`${upkeep.queryUserDeptListByUserId}`, options);
}

// 提交报废
export async function saveScrap(options) {
  return promiseRequest(`${_local}/scrap/saveScrap`, options);
}

// 更新报废
export async function updateScrap(options) {
  return promiseRequest(`${_local}/scrap/updateScrap`, options);
}

// 报废静态数据
export async function selectStaticDataList(options) {
  return promiseRequest(`${_local}/StaticDataController/selectStaticDataList?code=SCRAP_CONFIG`, options);
}

// 报废list url
export const scrapListUrl = `${_local}/scrap/findScrapList`;

// 报废详情
export async function queryScrapDetailById(options) {
  return promiseRequest(`${_local}/scrap/findScrapDetail`, options);
}

// 报废详情 - 打印 
export async function printScrapDetailById(options) {
  return promiseRequest(`${_local}/scrap/printScrapInfo`, options);
}

export const scrap ={
  printScrapInfo:`${_local}/scrap/printScrapInfo`,//打印报修记录详情
}