export const LOGIN = 'LOGIN'
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

export const login = () => {
  // auth0.authorize();
  return {
    // auth0: auth0,
    type: LOGIN
  }
}

export const authenticate = (auth0) => {
  let access_token, id_token, expires_at
  
  return new Promise((res, rej) => {
    
    try {
      auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          access_token = authResult.accessToken;
          id_token = authResult.idToken;
          expires_at = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        
          res({
            auth0: auth0,
            access_token: access_token,
            id_token: id_token,
            expires_at : expires_at,
            err: err,
            type: AUTHENTICATE
          })
        }
      })
    } catch(err) {
      rej(err)
    }
    
  })

}

export const logout = () => {
  return {
    access_token: null,
    id_token: null,
    expires_at : null,
    type: LOGOUT
  }
}
