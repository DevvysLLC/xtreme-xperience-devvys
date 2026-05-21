export const DRAWER_OPEN_MESSAGE_NAME = 'drawer:open'

export type DrawerOpenDetails = {
  id: string | null
}

export type DrawerOpen = {
  name: typeof DRAWER_OPEN_MESSAGE_NAME
  details: DrawerOpenDetails
}
