/**
 * Generic form field structure for form submissions
 */
export type FormField = {
  name: string
  value: string
}

/**
 * Form submission payload - provider-agnostic structure
 */
export type FormSubmissionPayload = {
  provider: string
  fields: FormField[]
  config?: FormProviderConfig
}

/**
 * Provider-specific configuration
 */
export type FormProviderConfig = {
  // HubSpot-specific
  formGuid?: string
  pageUri?: string
  pageName?: string

  // Zendesk-specific (for future implementation)
  ticketSubject?: string
  ticketPriority?: string
}

/**
 * Type for form providers
 */
export type FormProvider = {
  /**
   * Submit form data to the provider
   */
  submitForm: (payload: FormSubmissionPayload) => Promise<void>
}
