import { NextResponse } from 'next/server'
import { AppError } from '../../../../../core/errors/app-error'
import { initLogger } from '../../../../../core/logger'
import { FormSubmissionRequestSchema } from '../../../../../io/schemas'
import { getFormProvider } from '../../../../../server/forms'

const logger = initLogger().child({ name: 'form-api' })

export const runtime = 'nodejs'

/**
 * Type guard to check if value is a non-null object
 */
const isNonNullObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object'
}

/**
 * Extract error message from provider API error responses.
 * Handles common formats: { message: "..." }, { error: "..." }, { errors: { field: ["..."] } }
 */
const extractProviderErrorMessage = (errorData: unknown): string | null => {
  if (!isNonNullObject(errorData)) {
    return null
  }

  // Format: { "message": "..." }
  if ('message' in errorData && typeof errorData.message === 'string') {
    return errorData.message
  }

  // Format: { "error": "..." }
  if ('error' in errorData && typeof errorData.error === 'string') {
    return errorData.error
  }

  // Format: { "errors": { "field": ["..."] } }
  if ('errors' in errorData && isNonNullObject(errorData.errors)) {
    const values = Object.values(errorData.errors)
    for (const value of values) {
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === 'string'
      ) {
        return value[0]
      }
    }
  }

  return null
}

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const body = await request.json()

    const validationResult = FormSubmissionRequestSchema.safeParse(body)

    if (!validationResult.success) {
      logger.warn(
        { body, errors: validationResult.error.issues },
        'Form submission validation failed'
      )

      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid form data',
          errors: validationResult.error.issues
        },
        {
          status: 400
        }
      )
    }

    const { provider: providerType, fields, config } = validationResult.data

    logger.info(
      { provider: providerType, fieldCount: fields.length },
      'Form submission received'
    )

    // Get the appropriate provider
    const provider = getFormProvider(providerType)

    // Submit the form
    await provider.submitForm({
      provider: providerType,
      fields,
      config
    })

    logger.info({ provider: providerType }, 'Form submission successful')

    return NextResponse.json(
      {
        status: 'success',
        message: 'Form submitted successfully'
      },
      {
        status: 200
      }
    )
  } catch (error) {
    // Log full error details for debugging
    logger.error(
      {
        error,
        errorName: error instanceof Error ? error.name : 'unknown',
        errorMessage: error instanceof Error ? error.message : String(error),
        isAppError: error instanceof AppError,
        details: error instanceof AppError ? error.details : undefined
      },
      'Internal error processing form submission'
    )

    // Check if it's an AppError with specific details
    if (error instanceof AppError) {
      const traceTag = error.details?.traceTag

      // Check for configuration errors (missing env vars)
      if (
        traceTag === 'hubspot-provider.getHubspotService' ||
        traceTag === 'hubspot-client.constructor' ||
        traceTag === 'zendesk-provider.getZendeskService'
      ) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Form service is not configured'
          },
          {
            status: 503
          }
        )
      }

      // Check for unsupported provider
      if (traceTag === 'get-form-provider') {
        return NextResponse.json(
          {
            status: 'error',
            message: error.message
          },
          {
            status: 400
          }
        )
      }

      // Check for missing required config
      if (traceTag === 'hubspot-provider.submitForm') {
        return NextResponse.json(
          {
            status: 'error',
            message: error.message
          },
          {
            status: 400
          }
        )
      }

      // Check for provider API error response
      const errorData = error.details?.errorData

      // Log the actual error data for debugging
      if (errorData) {
        logger.error({ errorData }, 'Provider API error details')
      }

      // Extract error message from various provider error formats
      const apiErrorMessage = extractProviderErrorMessage(errorData)
      if (apiErrorMessage) {
        return NextResponse.json(
          {
            status: 'error',
            message: apiErrorMessage
          },
          {
            status: 502
          }
        )
      }

      // Return the AppError message with status for debugging
      return NextResponse.json(
        {
          status: 'error',
          message: `${error.message} (status: ${error.details?.status ?? 'unknown'})`
        },
        {
          status: 500
        }
      )
    }

    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error'
      },
      {
        status: 500
      }
    )
  }
}
