import promiseRequest from '../utils/promise_request';
import { _local } from './local';

// 查询机构用户
export async function getUsers(options) {
  return promiseRequest(`${_local}/user/selectUserNameList`, options);
}