import { once } from '../../function/once'
import { makeMessageBus } from '../create-message-bus/index'
import type { DrawerRequestClose } from './messages/close-drawer'
import type { DrawerClose } from './messages/drawer-close'
import type { OpenBookingLink } from './messages/open-booking-link'
import type { DrawerRequestOpen } from './messages/open-drawer'
import type { ScrollToSection } from './messages/scrollto-section'
import type { DrawerOpen } from './messages/set-active-drawer'
import type { ShowToast } from './messages/show-toast'

export type MainBusMessage =
  | DrawerRequestOpen
  | DrawerRequestClose
  | DrawerOpen
  | DrawerClose
  | ScrollToSection
  | OpenBookingLink
  | ShowToast

export const initMainBus = once(() => {
  return makeMessageBus<MainBusMessage>()
})
