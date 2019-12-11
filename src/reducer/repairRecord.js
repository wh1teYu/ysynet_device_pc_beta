import { fromJS } from 'immutable';
const initialState = {
  searchCondition: {

  }
}
const repairRecord = (state = initialState , action) => {
  switch (action.type) {
    case 'SET_REPAIR_RECORD_MAPPER':
      return fromJS(state).updateIn(action.nestKeys, val => action.condition).toJS();
    default:
      return state
  }
}
export default repairRecord;