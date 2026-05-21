export const DRAWER_REQUEST_OPEN_MESSAGE_NAME = 'drawer:request:open'

export type DrawerRequestOpenDetails = {
  id: string
}

export type DrawerRequestOpen = {
  name: typeof DRAWER_REQUEST_OPEN_MESSAGE_NAME
  details: DrawerRequestOpenDetails
}
