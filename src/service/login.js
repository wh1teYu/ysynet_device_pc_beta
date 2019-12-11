export const authSuccess = user => ({
  type: 'AUTH_SUCCESS',
  user
})

export const authFail = () => ({
  type: 'AUTH_FAIL'
})

//获取菜单信息
// export const getMenus = () => ( 
//   dispatch => (
//     dispatch(authSuccess(user))
//   )
// )  

export const authCheck = () => (
  new Promise((resolve, reject) => {
    
  })
)