import React from 'react';
import { Tooltip } from 'antd';//message
import { _local,FTP } from '../api/local';
import querystring from 'querystring';
export default function textTips(width,text) {
  return <Tooltip placement="topLeft" title={text}>
            <div style={{whiteSpace:"nowrap",width:width+"px",textOverflow:"ellipsis",overflow:"hidden"}}>{text}</div>
         </Tooltip>
}


export const fetchData = (
  api, body, callback, type='application/x-www-form-urlencoded', method='post'
) => {
  const query = typeof body === 'object' ? JSON.stringify(body) : body;
  fetch(api, {
    method: method,
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': type
    },
    body: query
  })
    .then(res => {
      switch (res.status) {
        // case 996:
        //   hashHistory.push({pathname: '/login'});
        //   return message.warn('会话失效，请重新登录');
        // case 997:
        //   hashHistory.push({pathname: '/login'});
        //   return message.warn('非法访问，请重新登录');
        // case 998:
        //   hashHistory.push({pathname: '/login'});
        //   return message.warn('会话失效，请重新登录');
        // case 999:
        //   hashHistory.push({pathname: '/login'});
        //   return message.warn('登录失效，请重新登录');
        default:
          return res.json();
      }
    })
    .then(data => {
      callback(data)
    })
    .catch(e => {
      console.log(e)
      // message.error('存在异常' + e.message)
    });
}

/*时间str转换为时间戳 */
export function timeToStamp(timeStr){
    if(timeStr){
      return Date.parse(new Date(timeStr)) / 1000 
    }else{
      return timeStr
    }
}
export function moneyValid( val,message="请输入非0正数,最多保留两位小数！",maxmessage="输入数值过大, 不能超过100000000",max=99999999){
  let num = Number(val)
  if (/^\d+$/.test(num) ||  /(^\d+\.\d{1}$)/.test(num) || /(^\d+\.\d{2}$)/.test(num)) {
    if (num > 99999999.99) {
      return  [false,maxmessage]
    }else{
      return [true]
    }
  } else {
      return  [false,message]
  }
}
export function cutFtpUrl(fullUrl){
		if(new RegExp( FTP ).test(fullUrl)){
      let s = fullUrl.replace(new RegExp( FTP ), "")
      return s;
		}else{
      return fullUrl;
    }
}
function compareUp(property){
  return function(a,b){
      var value1 = timeToStamp(a[property]);
      var value2 = timeToStamp(b[property]);
      return  value1  - value2 ;
  }
}
function compareDown(property){
  return function(a,b){
      var value1 = timeToStamp(a[property]);
      var value2 = timeToStamp(b[property]);
      return  value2 - value1;
  }
}
export function sortUpByKey(arr,key){
  return  arr.sort(compareUp(key))
}
export function sortDownByKey(arr,key){
  return  arr.sort(compareDown(key))
}



function getTimeStr (DT){
  let y = DT.getFullYear();
  let m = DT.getMonth()+1 <10 ? `0${DT.getMonth()+1}`:DT.getMonth()+1;
  let d = DT.getDate() <10 ? `0${DT.getDate()}`:DT.getDate();
  let str = `${y}-${m}-${d}`;
  return str
}
/**
 * @param type  'year','month','day' //根据年月日来控制范围
 * @param range  Number //年月日数量
 * @param timeType  'before','after' //获取当前时间之前的时间或者之后的时间
 * use getRangeTime('month',1,'before') 
 * return ['2018-08-10','2018-09-20']
 */
export const getRangeTime = (type,range,timeType)=>{
  let DT = new Date();
  let firstTime = getTimeStr(DT);
  if(type==='year'){
    if(timeType==='before'){
      DT.setFullYear(DT.getFullYear()-range);
    }else{
      DT.setFullYear(DT.getFullYear()+range);
    }
  }else if(type==='month'){
    if(timeType==='before'){
      DT.setMonth(DT.getMonth()-range);
    }else{
      DT.setMonth(DT.getMonth()+range);
    }
  }else if(type==='day'){
    if(timeType==='before'){
      DT.setDate(DT.getDate()-range);
    }else{
      DT.setDate(DT.getDate()+range);
    }
  }else{}
  let secondTime = getTimeStr(DT);
  if(Date.parse(firstTime)>Date.parse(secondTime)){
    return [secondTime,firstTime]
  }else{
    return [firstTime,secondTime]
  }
}

/*查询字典*/
export const CommonData = (type, cb, params={}, url) => {
  if(localStorage.getItem(type)) {
    cb(JSON.parse(localStorage.getItem(type)));
  } else {
    fetch(url || `${_local}/StaticDataController/selectStaticDataList?code=` + type, {
      credentials: 'include',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify(params)
    })
    .then((res) => res.json())
    .then((json) => {
      cb(json.result)
      localStorage.setItem(type, JSON.stringify(json.result));
    })
    .catch((err) => cb(err))
  }
}

export const validMoney = (rule, value, callback) => {
  let num = Number(value)
  if (!num || /^\d+$/.test(num) ||  /(^\d+\.\d{1}$)/.test(num) || /(^\d+\.\d{2}$)/.test(num)) {
    if (num > 99999999.99) {
      callback(new Error('输入数值过大, 不能超过100000000'));
    }else{
      callback();
    }
  } else {
      callback(new Error('请输入非0正数,最多保留两位小数！'));
  }
}

export const validAmount = (rule, value, callback) => {
  let num = Number(value);
  if (/^\d+$/.test(num) && num !== 0) {
    if (num > 99999999) {
      callback(new Error('输入数值过大, 不能超过100000000'));
    }else{
      callback();
    }
  } else {
      callback(new Error('请输入非0正数！'));
  }
}

export const validDay = (rule, value, callback) => {
  let num = Number(value);
  if (/^\d+$/.test(num) && num !== 0) {
    if (num > 99999999) {
      callback(new Error('输入数值过大, 不能超过100000000'));
    }else{
      callback();
    }
  } else if(value === '' || value === undefined || num !== 0) {
    callback();
  } else {
    callback(new Error('请输入非0正数！'));
  }
}
export const clearNull = (values) => {
  for (let item in values){
    if(Array.isArray(values[item])){
      if(values[item].length===0){
        delete values[item]
      }
    }else{
      switch(values[item]){
        case "":
          delete values[item]
          break 
        case null:
          delete values[item]
          break
        case undefined:
          delete values[item]
          break
        default:
          break 
      }
    }
  }
  return values
}

/*允许4位小数点以及正整数
rules:[{validator:limitNum,max:12,message:'请输入0-12正整数'}]
*/
export const limitNum = (rule, value, callback,source,options) => {
  let num = Number(value)
  if (!num || /^\d+$/.test(num) ||  /(^\d+\.\d{1}$)/.test(num) || /(^\d+\.\d{2}$)/.test(num)) {
    if (num > rule.max) {
      callback(new Error(rule.message));
    }else{
      callback();
    }
  } else {
      callback(new Error('请输入非0正数,最多保留两位小数！'));
  }
}

/*验证月份0-12正整数
rules:[{validator:validMonth,max:12,message:'请输入0-12正整数'}]
*/
export const validMonth = (rule, value, callback,source,options) => {
  let num = Number(value)
  if (!num || /^\d+$/.test(num)) {
    if (num > rule.max) {
      callback(new Error(rule.message));
    }else{
      callback();
    }
  } else {
      callback(new Error('请输入非0正数！'));
  }
}


/**
 * json obj 比较
 * @param {*} obj1 
 * @param {*} obj2 
 * @param {*} except 不比较项
 */
export const objCompare = (obj1, obj2) => {
  if (typeof obj1 !== 'object' || obj1 === null) {
    return false;
  }
  if (typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  // get all key
  var aProps = Object.getOwnPropertyNames(obj1);  
  var bProps = Object.getOwnPropertyNames(obj2);
  if (aProps.length !== bProps.length) {  
    return false;  
  }  
  for (let i = 0; i < aProps.length; i++) {  
    let propName = aProps[i];  
    if ((obj1[propName] !== obj2[propName])) {  
      return false;  
    }  
  }  
  return true;
}
