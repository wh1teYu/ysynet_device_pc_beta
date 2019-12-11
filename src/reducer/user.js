const initialState = {
  loginResult: '',
  userInfo: {

  }
}
const userReducer = (state = initialState , action) => {
  switch (action.type) {
    case 'SET_USER_MAPPER':
      return {
        ...state, ...action.user
      }
    case 'CLEAR_USER_MAPPER':
      return {
        loginResult: '',
        userInfo: {
      
        }
      }
    default:
      return state
  }
}
export default userReducer;