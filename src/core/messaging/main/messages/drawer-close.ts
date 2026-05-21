export const DRAWER_CLOSE_MESSAGE_NAME = 'drawer:close'

export type DrawerCloseDetails = {
  id: string
}

export type DrawerClose = {
  name: typeof DRAWER_CLOSE_MESSAGE_NAME
  details: DrawerCloseDetails
}
