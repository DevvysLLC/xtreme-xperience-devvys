import { logger } from '../../../../core/logger/logger'
import type { SendlaneAddContactRequest } from '../../../../io/types'
import type { SendlaneClient } from '../../client/sendlane-client'

export type AddContactPayload = {
  email: string
  listId: number
  firstName?: string
  lastName?: string
  phone?: string
}

export class SendlaneContactService {
  constructor(private readonly client: SendlaneClient) {}

  /**
   * Add a contact to a Sendlane list
   *
   * @param payload - The contact details to add (listId is required)
   */
  async addContact(payload: AddContactPayload): Promise<void> {
    logger.info('sendlane-contact-service.addContact', {
      email: payload.email,
      listId: payload.listId,
      hasFirstName: !!payload.firstName,
      hasLastName: !!payload.lastName,
      hasPhone: !!payload.phone
    })

    // Build contact object with only defined values
    const contact: SendlaneAddContactRequest = {
      email: payload.email
    }

    if (payload.firstName !== undefined) {
      contact.first_name = payload.firstName
    }

    if (payload.lastName !== undefined) {
      contact.last_name = payload.lastName
    }

    if (payload.phone !== undefined) {
      contact.phone = payload.phone
    }

    // Sendlane API v2 expects contacts wrapped in an array
    const response = await this.client.request({
      method: 'POST',
      path: `/lists/${payload.listId}/contacts`,
      body: { contacts: [contact] }
    })

    // Log the response for debugging (HTTP errors are thrown by client)
    logger.info('sendlane-contact-service.addContact.success', {
      email: payload.email,
      response
    })
  }
}
