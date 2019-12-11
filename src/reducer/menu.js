const initialState = {

};
const menuReducer = (state = initialState , action) => {
  switch (action.type) {
    case 'SET_MENU_MAPPER':
      return {
        menuList: action.menu
      }
    case 'SET_BREAD_MAPPER':
      console.log(action)
      return {
        ...state, breadcrumb: action.bread
      }  
    case 'CLEAR_MENU_MAPPER':
      return { menu: [] };
    default:
      return state
  }
}
export default menuReducer;