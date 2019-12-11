/**
 * @file 查询回填sevice 
 */
// 状态值
const SET_REPAIR_RECORD_MAPPER = 'SET_REPAIR_RECORD_MAPPER';
const CLEAR_REPAIR_RECORD_MAPPER = 'CLEAR_REPAIR_RECORD_MAPPER';
// const CLEARALL_SEARCH_MAPPER = 'CLEARALL_SEARCH_MAPPER';

// 设置回填
const setRepairRecordMapper = (nestKeys, condition) => ({
  type: SET_REPAIR_RECORD_MAPPER,
  nestKeys, condition
})
// 清除所有
export const clearRepairRecordMapper = condition => ({
  type: CLEAR_REPAIR_RECORD_MAPPER,
})

export const setRepairRecordSearch = (nestKeys, value) => (
  dispatch => dispatch(
    setRepairRecordMapper(nestKeys, value)
  )
)