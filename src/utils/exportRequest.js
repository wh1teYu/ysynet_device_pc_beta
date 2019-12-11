import { notification } from 'antd';

// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response.json();
//   }
//   notification.error({
//     message: `请求错误 ${response.status}: ${response.url}`,
//     description: response.statusText,
//   });
//   const error = new Error(response.statusText);
//   error.response = response;
//   throw error;
// }

/**
 * exportRequest a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function exportRequest(url, options, callback) {
  const defaultOptions = {
    method: 'GET',
    credentials: 'include',
    mode: 'cors'
  };
  const newOptions = { ...defaultOptions, ...options };
  let filename = '';
  return fetch(url, newOptions)
    // .then(response => checkStatus(response))
    // .then(data =>{
    //   if (typeof newOptions.success === 'function') {
    //     newOptions.success(data)
    //   }else{
    //     const { url, filename } = data;
    //     let a = document.createElement('a');
    //     a.href = url;
    //     a.download = filename || '';
    //     a.click();
    //   }
    // })
    .then(response => {
      filename = response.headers.get('Content-Disposition');
      // filename = window.decodeURI(filename);
      return response.blob();
    })
    .then(blob => {
      // const { url, filename } = response;
      // // const url = window.URL.createObjectURL(blob);
      // let a = document.createElement('a');
      // a.href = url;
      // a.download = filename;
      // a.click();

      const url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    })
    .catch((error) => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.message,
        });
      }
      if (newOptions.error === 'function') {
        newOptions.error(error);
      }
      return error;
    });
}
