import type { MessageBus } from '../../../core/messaging/create-message-bus'
import type { MainBusMessage } from '../../../core/messaging/main'
import { OPEN_BOOKING_LINK_MESSAGE_NAME } from '../../../core/messaging/main/messages/open-booking-link'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '../../../core/messaging/main/messages/open-drawer'
import { SCROLL_TO_SECTION_MESSAGE_NAME } from '../../../core/messaging/main/messages/scrollto-section'

export const OPEN_FORM_ACTION_NAME = 'open:form'

export const sendMessageBusAction = (
  action: string | null | undefined,
  actionDetail: string | null | undefined,
  mainBus: MessageBus<MainBusMessage>
): void => {
  if (!action || !actionDetail) {
    return
  }

  switch (action) {
    case DRAWER_REQUEST_OPEN_MESSAGE_NAME:
      mainBus.send({
        name: DRAWER_REQUEST_OPEN_MESSAGE_NAME,
        details: { id: actionDetail }
      })
      break
    case SCROLL_TO_SECTION_MESSAGE_NAME:
      mainBus.send({
        name: SCROLL_TO_SECTION_MESSAGE_NAME,
        details: { id: actionDetail }
      })
      break
    case OPEN_BOOKING_LINK_MESSAGE_NAME:
      mainBus.send({
        name: OPEN_BOOKING_LINK_MESSAGE_NAME,
        details: { link: actionDetail }
      })
      break
  }
}
