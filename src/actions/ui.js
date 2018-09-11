export const HANDLE_PROFILE_MENU = 'HANDLE_PROFILE_MENU'
export const HANDLE_DAO_MENU = 'HANDLE_DAO_MENU'

export const handleProfileMenu = profileMenuAnchorEl => {
  return {
    profileMenuAnchorEl: profileMenuAnchorEl,
    type: HANDLE_PROFILE_MENU
  }
}

export const handleDaoMenu = daoMenuAnchorEl => {
  return {
    daoMenuAnchorEl: daoMenuAnchorEl,
    type: HANDLE_DAO_MENU
  }
}
