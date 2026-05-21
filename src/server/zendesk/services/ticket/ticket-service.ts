import { logger } from '../../../../core/logger/logger'
import type { ZendeskClient } from '../../client'

export type ZendeskTicketField = {
  name: string
  value: string
}

export type CreateTicketPayload = {
  subject: string
  fields: ZendeskTicketField[]
  priority?: 'urgent' | 'high' | 'normal' | 'low'
  requesterName?: string
  requesterEmail?: string
}

/**
 * Zendesk Tickets API request body
 * @see https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#create-ticket
 */
type ZendeskTicketRequest = {
  ticket: {
    subject: string
    comment: {
      body: string
    }
    priority?: string
    requester?: {
      name?: string
      email?: string
    }
  }
}

const isTicketResponse = (
  value: unknown
): value is { ticket: { id: number } } => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'ticket' in value &&
    value.ticket !== null &&
    typeof value.ticket === 'object' &&
    'id' in value.ticket &&
    typeof value.ticket.id === 'number'
  )
}

const buildTicketBody = (fields: ZendeskTicketField[]): string => {
  return fields.map((field) => `${field.name}: ${field.value}`).join('\n')
}

export class ZendeskTicketService {
  constructor(private readonly client: ZendeskClient) {}

  /**
   * Create a support ticket in Zendesk from contact form fields
   */
  async createTicket(payload: CreateTicketPayload): Promise<void> {
    logger.info('zendesk-ticket-service.createTicket', {
      subject: payload.subject,
      fieldCount: payload.fields.length,
      priority: payload.priority ?? 'normal'
    })

    const body: ZendeskTicketRequest = {
      ticket: {
        subject: payload.subject,
        comment: {
          body: buildTicketBody(payload.fields)
        },
        priority: payload.priority ?? 'normal'
      }
    }

    if (payload.requesterName || payload.requesterEmail) {
      body.ticket.requester = {
        ...(payload.requesterName && { name: payload.requesterName }),
        ...(payload.requesterEmail && { email: payload.requesterEmail })
      }
    }

    const result = await this.client.request({
      method: 'POST',
      path: '/api/v2/tickets.json',
      body
    })

    const ticketId = isTicketResponse(result) ? result.ticket.id : undefined

    logger.info('zendesk-ticket-service.createTicket.success', {
      ticketId,
      subject: payload.subject
    })
  }
}
