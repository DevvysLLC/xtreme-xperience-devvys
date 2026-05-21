import { logger } from '../../../../core/logger/logger'
import type { HubspotClient } from '../../client'
export type HubspotFormField = {
  name: string
  value: string
}

export type HubspotFormContext = {
  pageUri?: string
  pageName?: string
}

export type SubmitFormPayload = {
  formGuid: string
  fields: HubspotFormField[]
  context?: HubspotFormContext
}

/**
 * HubSpot Forms API request body
 * @see https://developers.hubspot.com/docs/api/marketing/forms
 */
type HubspotFormSubmissionRequest = {
  fields: HubspotFormField[]
  context?: HubspotFormContext
}

export class HubspotFormService {
  constructor(private readonly client: HubspotClient) {}

  /**
   * Submit a form to HubSpot
   *
   * @param payload - The form submission details
   */
  async submitForm(payload: SubmitFormPayload): Promise<void> {
    const portalId = this.client.getPortalId()

    logger.info('hubspot-form-service.submitForm', {
      formGuid: payload.formGuid,
      portalId,
      fieldCount: payload.fields.length,
      fieldNames: payload.fields.map((f) => f.name)
    })

    const body: HubspotFormSubmissionRequest = {
      fields: payload.fields
    }

    if (payload.context) {
      body.context = payload.context
    }

    // HubSpot Forms API v3 secure endpoint (requires Bearer token auth)
    await this.client.request({
      method: 'POST',
      path: `/submissions/v3/integration/secure/submit/${portalId}/${payload.formGuid}`,
      body
    })

    logger.info('hubspot-form-service.submitForm.success', {
      formGuid: payload.formGuid,
      portalId
    })
  }
}
