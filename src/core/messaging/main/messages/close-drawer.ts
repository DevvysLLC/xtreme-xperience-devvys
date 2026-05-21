export const DRAWER_REQUEST_CLOSE_MESSAGE_NAME = 'drawer:request:close'

export type DrawerRequestCloseDetails = {
  id?: string
}

export type DrawerRequestClose = {
  name: typeof DRAWER_REQUEST_CLOSE_MESSAGE_NAME
  details: DrawerRequestCloseDetails
}
