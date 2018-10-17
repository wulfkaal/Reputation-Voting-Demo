export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

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
