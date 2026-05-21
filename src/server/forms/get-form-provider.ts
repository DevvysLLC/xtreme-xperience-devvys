import { AppError } from '../../core/errors/app-error'
import { HubspotProvider, ZendeskProvider } from './providers'
import type { FormProvider } from './types'

/**
 * Supported form provider types
 */
export const FormProviderType = {
  HUBSPOT: 'hubspot',
  ZENDESK: 'zendesk'
} as const

export type FormProviderType =
  (typeof FormProviderType)[keyof typeof FormProviderType]

/**
 * Provider instances (lazy singletons)
 */
const providers = new Map<FormProviderType, FormProvider>()

/**
 * Get a form provider by type
 *
 * @param providerType - The type of provider (hubspot, zendesk)
 * @returns The form provider instance
 * @throws AppError if the provider type is not supported
 */
/**
 * Valid provider type values
 */
const validProviderTypes: readonly string[] = Object.values(FormProviderType)

/**
 * Type guard to check if a string is a valid FormProviderType
 */
const isFormProviderType = (value: string): value is FormProviderType => {
  return validProviderTypes.includes(value)
}

/**
 * Get a form provider by type
 *
 * @param providerType - The type of provider (hubspot, zendesk)
 * @returns The form provider instance
 * @throws AppError if the provider type is not supported
 */
export const getFormProvider = (providerType: string): FormProvider => {
  // Normalize provider type to lowercase
  const normalizedType = providerType.toLowerCase()

  // Validate that it's a supported provider type
  if (!isFormProviderType(normalizedType)) {
    throw new AppError(`Unsupported form provider: ${providerType}`, {
      traceTag: 'get-form-provider',
      providerType
    })
  }

  // Check cache first
  const cachedProvider = providers.get(normalizedType)
  if (cachedProvider) {
    return cachedProvider
  }

  // Create new provider instance
  let provider: FormProvider

  switch (normalizedType) {
    case FormProviderType.HUBSPOT:
      provider = new HubspotProvider()
      break

    case FormProviderType.ZENDESK:
      provider = new ZendeskProvider()
      break
  }

  // Cache the provider
  providers.set(normalizedType, provider)

  return provider
}
