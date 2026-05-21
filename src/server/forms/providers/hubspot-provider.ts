import { AppError } from '../../../core/errors/app-error'
import { logger } from '../../../core/logger/logger'
import { HubspotClient, HubspotFormService } from '../../hubspot'
import type { FormProvider, FormSubmissionPayload } from '../types'

/**
 * Singleton instance of HubspotFormService
 */
let hubspotServiceInstance: HubspotFormService | null = null

const getHubspotService = (): HubspotFormService => {
  if (hubspotServiceInstance) {
    return hubspotServiceInstance
  }

  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN

  if (!accessToken) {
    throw new AppError('HUBSPOT_ACCESS_TOKEN environment variable is not set', {
      traceTag: 'hubspot-provider.getHubspotService'
    })
  }

  const portalId = process.env.HUBSPOT_PORTAL_ID

  if (!portalId) {
    throw new AppError('HUBSPOT_PORTAL_ID environment variable is not set', {
      traceTag: 'hubspot-provider.getHubspotService'
    })
  }

  const client = new HubspotClient({
    accessToken,
    portalId
  })

  hubspotServiceInstance = new HubspotFormService(client)
  return hubspotServiceInstance
}

export class HubspotProvider implements FormProvider {
  async submitForm(payload: FormSubmissionPayload): Promise<void> {
    const formGuid = payload.config?.formGuid

    if (!formGuid) {
      throw new AppError('formGuid is required for HubSpot form submissions', {
        traceTag: 'hubspot-provider.submitForm'
      })
    }

    logger.info('hubspot-provider.submitForm', {
      formGuid,
      fieldCount: payload.fields.length
    })

    const service = getHubspotService()

    await service.submitForm({
      formGuid,
      fields: payload.fields.map((field) => ({
        name: field.name,
        value: field.value
      })),
      context: {
        pageUri: payload.config?.pageUri,
        pageName: payload.config?.pageName
      }
    })

    logger.info('hubspot-provider.submitForm.success', {
      formGuid
    })
  }
}
