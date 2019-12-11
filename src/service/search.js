/**
 * @file 查询条件 回填
 */
// 状态值
const SET_SEARCH_MAPPER = 'SET_SEARCH_MAPPER';
const CLEAR_SEARCH_MAPPER = 'CLEAR_SEARCH_MAPPER';

// 设置回填
const setSearchMapper = (path, condition) => ({
  type: SET_SEARCH_MAPPER,
  path, condition
})

// 清除查询参数
const clearSearchMapper = (path, condition) => ({
  type: CLEAR_SEARCH_MAPPER,
  path, condition
})

export const setSearch = (path, value) => (
  dispatch => dispatch(
    setSearchMapper(path, value)
  )
)

export const clearSearch = (path, value) => (
  dispatch => dispatch(
    clearSearchMapper(path, value)
  )
)