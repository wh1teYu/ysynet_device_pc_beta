import user from './user';
import menu from './menu';
import repairRecord from './repairRecord'
import search from './search'
import { combineReducers } from 'redux';

const reducer = combineReducers({
  user, menu, repairRecord, search
})

export default reducer;