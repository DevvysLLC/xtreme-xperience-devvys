import { NextResponse } from 'next/server'
import { initDatoSdk } from '../../../../../core/dato/sdk'
import { AppError } from '../../../../../core/errors/app-error'
import { initLogger } from '../../../../../core/logger'
import { NewsletterSubscribeRequestSchema } from '../../../../../io/schemas'
import { SendlaneClient } from '../../../../../server/sendlane/client'
import { SendlaneContactService } from '../../../../../server/sendlane/services/contact'

const logger = initLogger().child({ name: 'newsletter-api' })

export const runtime = 'nodejs'

/**
 * Singleton instance of SendlaneContactService.
 * Lazily initialized on first access to avoid unnecessary instantiation.
 */
let sendlaneServiceInstance: SendlaneContactService | null = null

const getSendlaneService = (): SendlaneContactService => {
  if (sendlaneServiceInstance) {
    return sendlaneServiceInstance
  }

  const apiToken = process.env.SENDLANE_API_TOKEN

  if (!apiToken) {
    throw new AppError('SENDLANE_API_TOKEN environment variable is not set', {
      traceTag: 'newsletter-api.getSendlaneService'
    })
  }

  const client = new SendlaneClient({
    apiToken,
    baseUrl: process.env.SENDLANE_API_BASE_URL
  })

  sendlaneServiceInstance = new SendlaneContactService(client)
  return sendlaneServiceInstance
}

/**
 * Cached list ID value with TTL.
 * Fetched from globalConfig in DatoCMS.
 */
let cachedListId: number | null = null
let cacheTimestamp: number | null = null
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

const getListId = async (): Promise<number> => {
  const now = Date.now()

  if (
    cachedListId !== null &&
    cacheTimestamp !== null &&
    now - cacheTimestamp < CACHE_TTL_MS
  ) {
    return cachedListId
  }

  const sdk = initDatoSdk()
  const response = await sdk.getGlobalConfig()

  const listIdString = response.globalConfig?.sendlaneNewsletterListId

  if (!listIdString) {
    throw new AppError(
      'sendlaneNewsletterListId is not configured in globalConfig',
      {
        traceTag: 'newsletter-api.getListId'
      }
    )
  }

  const listId = Number.parseInt(listIdString, 10)

  if (Number.isNaN(listId)) {
    throw new AppError('sendlaneNewsletterListId must be a valid number', {
      traceTag: 'newsletter-api.getListId'
    })
  }

  cachedListId = listId
  cacheTimestamp = now
  return listId
}

/**
 * Type guard to check if value is a non-null object
 */
const isNonNullObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object'
}

/**
 * Extract error message from Sendlane API error responses.
 * Handles formats: { message: "..." }, { error: "..." }, { errors: { field: ["..."] } }
 */
const extractSendlaneErrorMessage = (errorData: unknown): string | null => {
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

    const validationResult = NewsletterSubscribeRequestSchema.safeParse(body)

    if (!validationResult.success) {
      logger.warn(
        { body, errors: validationResult.error.issues },
        'Newsletter subscription validation failed'
      )

      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid email address',
          errors: validationResult.error.issues
        },
        {
          status: 400
        }
      )
    }

    const { email } = validationResult.data

    logger.info({ email }, 'Newsletter subscription received')

    const contactService = getSendlaneService()
    const listId = await getListId()

    await contactService.addContact({
      email,
      listId
    })

    logger.info({ email }, 'Newsletter subscription successful')

    return NextResponse.json(
      {
        status: 'success',
        message: 'Successfully subscribed to newsletter'
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
      'Internal error processing newsletter subscription'
    )

    // Check if it's an AppError with specific details
    if (error instanceof AppError) {
      const traceTag = error.details?.traceTag

      // Check for configuration errors (missing env vars or CMS config)
      if (
        traceTag === 'newsletter-api.getSendlaneService' ||
        traceTag === 'newsletter-api.getListId' ||
        traceTag === 'sendlane-client.constructor'
      ) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Newsletter service is not configured'
          },
          {
            status: 503
          }
        )
      }

      // Check for Sendlane API error response
      const errorData = error.details?.errorData

      // Log the actual error data for debugging
      logger.error({ errorData }, 'Sendlane API error details')

      // Extract error message from various Sendlane error formats
      const apiErrorMessage = extractSendlaneErrorMessage(errorData)
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
