export const UPDATE_SEM_BALANCE = 'UPDATE_SEM_BALANCE'

export const updateSEMBalance = balance => {
  return {
    balance: balance,
    type: UPDATE_SEM_BALANCE
  }
}