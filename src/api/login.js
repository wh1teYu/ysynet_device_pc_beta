import promiseRequest from '../utils/promise_request';
export async function login(options) {
  return promiseRequest(
    `http://192.168.0.200:5656/ysy/login/userLogin?userNo=admin&pwd=3e29d79c1e1d3deb3cfe5b6f90b065ad788154a6&token=vania`, 
    options
  );
}

export async function getUser(options) {
  return promiseRequest(
    `http://192.168.0.200:5656/ysy/login/getUserInfo`, 
    options
  );
}

