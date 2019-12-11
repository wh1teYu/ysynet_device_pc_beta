/**
 * @file 用户sevice 
 */
import request from '../utils/request'
import menu from '../api/menu';
// 状态值
const SET_MENU_MAPPER = 'SET_MENU_MAPPER';
const SET_BREAD_MAPPER = 'SET_BREAD_MAPPER';
const CLEAR_MENU_MAPPER = 'CLEAR_MENU_MAPPER';
const FETCH_FAILURE = 'FETCH_FAILURE';

// 设置menu
const setMenuMapper = menu => ({
  type: SET_MENU_MAPPER,
  menu
})
// 异常
export const fetchFailure = err => ({
  type: FETCH_FAILURE,
  err
})
// 设置 bread
export const setBreadMapper = bread => ({
  type: SET_BREAD_MAPPER,
  bread
})
// 清空menu
export const clearMenuMapper = () => ({
  type: CLEAR_MENU_MAPPER
})

export const fetchMenu = () => (
  dispatch => (
    request(menu.fetchMenu, {
      success: data => {
        if (data.status) {
          dispatch(setMenuMapper(data.result));
          return data.result;
        } else {
          dispatch(fetchFailure(data.result))
        }
      },
      error: err => dispatch(fetchFailure(err))
    })
  )
)