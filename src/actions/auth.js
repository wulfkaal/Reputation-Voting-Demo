export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const RECEIVE_SEM_BALANCE = 'RECEIVE_SEM_BALANCE'
export const SAVE_SEM_BALANCE = 'SAVE_SEM_BALANCE'

export const login = (accessToken) => {
  return {
    access_token: accessToken,
    type: LOGIN
  }
}


export const logout = () => {
  return {
    access_token: null,
    type: LOGOUT
  }
}

export const receiveSemBalance = (sem) => {
  return {
    sem: sem,
    type: RECEIVE_SEM_BALANCE
  }
}

export const saveSemBalance = (semBalance) => {
  return {
    semBalance: semBalance,
    type: SAVE_SEM_BALANCE
  }
}
