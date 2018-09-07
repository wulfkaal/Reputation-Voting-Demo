export const HANDLE_MENU = 'HANDLE_MENU'

export const handleMenu = anchorEl => {
  return {
    anchorEl: anchorEl,
    type: HANDLE_MENU
  }
}
