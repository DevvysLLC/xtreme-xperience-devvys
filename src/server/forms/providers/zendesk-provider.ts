import { AppError } from '../../../core/errors/app-error'
import { logger } from '../../../core/logger/logger'
import { ZendeskClient, ZendeskTicketService } from '../../zendesk'
import type { FormProvider, FormSubmissionPayload } from '../types'

let zendeskServiceInstance: ZendeskTicketService | null = null

const getZendeskService = (): ZendeskTicketService => {
  if (zendeskServiceInstance) {
    return zendeskServiceInstance
  }

  const apiKey = process.env.ZENDESK_API_KEY

  if (!apiKey) {
    throw new AppError('ZENDESK_API_KEY environment variable is not set', {
      traceTag: 'zendesk-provider.getZendeskService'
    })
  }

  const apiEmail = process.env.ZENDESK_API_EMAIL

  if (!apiEmail) {
    throw new AppError('ZENDESK_API_EMAIL environment variable is not set', {
      traceTag: 'zendesk-provider.getZendeskService'
    })
  }

  const baseUrl = process.env.ZENDESK_API_BASE_URL

  if (!baseUrl) {
    throw new AppError('ZENDESK_API_BASE_URL environment variable is not set', {
      traceTag: 'zendesk-provider.getZendeskService'
    })
  }

  const client = new ZendeskClient({ apiEmail, apiKey, baseUrl })

  zendeskServiceInstance = new ZendeskTicketService(client)
  return zendeskServiceInstance
}

const DEFAULT_TICKET_SUBJECT = 'Contact Form Submission'

const VALID_PRIORITIES: readonly string[] = ['urgent', 'high', 'normal', 'low']
type TicketPriority = 'urgent' | 'high' | 'normal' | 'low'

const isValidPriority = (value: string): value is TicketPriority => {
  return VALID_PRIORITIES.includes(value)
}

export class ZendeskProvider implements FormProvider {
  async submitForm(payload: FormSubmissionPayload): Promise<void> {
    const subject = payload.config?.ticketSubject ?? DEFAULT_TICKET_SUBJECT
    const rawPriority = payload.config?.ticketPriority
    const priority =
      rawPriority && isValidPriority(rawPriority) ? rawPriority : undefined

    logger.info('zendesk-provider.submitForm', {
      subject,
      fieldCount: payload.fields.length
    })

    const service = getZendeskService()

    let name: string | undefined

    const firstNameField = payload.fields.find((f) => f.name === 'first_name')
    const lastNameField = payload.fields.find((f) => f.name === 'last_name')

    if (firstNameField && lastNameField) {
      name = `${firstNameField.value} ${lastNameField.value}`
    } else {
      const nameField = payload.fields.find(
        (f) => f.name === 'name' || f.name === 'full_name'
      )

      name = nameField?.value ?? 'Name not provided'
    }

    const emailField = payload.fields.find(
      (f) => f.name === 'email' || f.name === 'email_address'
    )

    await service.createTicket({
      subject,
      fields: payload.fields.map((field) => ({
        name: field.name,
        value: field.value
      })),
      priority,
      requesterName: name,
      requesterEmail: emailField?.value
    })

    logger.info('zendesk-provider.submitForm.success', { subject })
  }
}
