export const HANDLE_PROFILE_MENU = 'HANDLE_PROFILE_MENU'

export const handleProfileMenu = profileMenuAnchorEl => {
  return {
    profileMenuAnchorEl: profileMenuAnchorEl,
    type: HANDLE_PROFILE_MENU
  }
}