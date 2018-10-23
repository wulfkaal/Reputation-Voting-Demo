export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SAVE_SEM_BALANCE = 'SAVE_SEM_BALANCE'

export const login = (web3, accessToken, semadaCore) => {
  return {
    web3: web3,
    access_token: accessToken,
    semadaCore: semadaCore,
    type: LOGIN
  }
}


export const logout = () => {
  return {
    access_token: null,
    type: LOGOUT
  }
}

export const saveSemBalance = (semBalance) => {
  return {
    semBalance: semBalance,
    type: SAVE_SEM_BALANCE
  }
}
