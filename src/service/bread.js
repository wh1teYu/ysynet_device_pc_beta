/**
 * @file 用户sevice 
 */
// 状态值
const SET_BREAD_MAPPER = 'SET_BREAD_MAPPER';

// 设置bread
const setBreadMapper = bread => ({
  type: SET_BREAD_MAPPER,
  bread
})
// 清空user
export const clearBreadMapper = () => ({
  type: CLEAR_BREAD_MAPPER
})

export const changeBread = () => (
  dispatch => (dispatch(setUserMapper(bread)))
)