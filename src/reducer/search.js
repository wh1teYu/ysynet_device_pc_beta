const initialState = {

}
const search = (state = initialState , action) => {
  switch (action.type) {
    case 'SET_SEARCH_MAPPER':
      return {
        [action.path]: {
          ...action.condition
        }
      }
    case 'CLEAR_SEARCH_MAPPER':
      if(action.path || action.condition){
        return {
          [action.path]: {
            ...action.condition
          }
        } 
      }else{
        return {}
      }
    default:
      return state
  }
}
export default search;