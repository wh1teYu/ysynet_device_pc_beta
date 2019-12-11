import request from '../utils/request';


export const  getInfo= ( url , values , success,type ) => {
  request(url, {
    headers: type || null,
    body: values,
    success: data => success(data),
    error: err => alert(err)
  })
}