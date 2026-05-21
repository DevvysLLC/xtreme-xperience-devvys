#!/usr/bin/env bun

import { z } from 'zod'
import { AppError } from '../../../core/errors/app-error'
import { safeAwait } from '../../../core/errors/safe-await'
import { initLogger } from '../../../core/logger'
import {
  RocketRezGetRetailProductResponseSchema as GetRetailProductResponseSchema,
  RocketRezProductType
} from '../../../io/schemas'
import type { RocketRezGetProductsResponse as GetProductsResponse } from '../../../io/types'
import { getDb } from '../../db/get-db'
import { RocketRezClient } from '../client/rocket-rez-client'
import {
  deleteMissingProducts,
  listActiveProductSyncStates,
  updateRocketRezRetailPayload,
  upsertRocketRezProductList
} from '../services/products-cache/products-cache'
import {
  CONCURRENCY,
  DELAY_BETWEEN_REQUESTS_MS,
  RETRY_COUNT,
  RETRY_DELAY_BETWEEN_REQUESTS_MS
} from './config'

const logger = initLogger().child({ name: 'sync-rocket-rez-products-cache' })

const Env = z.object({
  ROCKET_REZ_CLIENT_ID: z.string().min(1),
  ROCKET_REZ_CLIENT_SECRET: z.string().min(1),
  ROCKET_REZ_API_BASE_URL: z.string().min(1),
  PRODUCT_CACHE_TTL_MINUTES: z.coerce.number().int().positive().optional()
})

const isRateLimitError = (error: unknown): boolean => {
  if (error instanceof AppError) {
    return error.details?.status === 429
  }
  return false
}

const withRetry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelayMs?: number
    maxDelayMs?: number
    backoffMultiplier?: number
    context?: string
  } = {}
): Promise<T> => {
  const {
    maxRetries = 5,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
    context = 'operation'
  } = options

  let lastError: unknown
  let delay = initialDelayMs

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (!isRateLimitError(error)) {
        throw error
      }

      if (attempt === maxRetries) {
        logger.warn(
          { context, attempt: attempt + 1, maxRetries: maxRetries + 1 },
          'Max retries reached for rate limit error'
        )
        throw error
      }

      let retryDelay = delay
      if (
        error instanceof AppError &&
        error.details?.retryAfter &&
        typeof error.details.retryAfter === 'number'
      ) {
        const retryAfterSeconds = error.details.retryAfter
        retryDelay = Math.min(retryAfterSeconds * 1000, maxDelayMs)
        logger.info(
          {
            context,
            attempt: attempt + 1,
            maxRetries: maxRetries + 1,
            retryAfterSeconds,
            delayMs: retryDelay
          },
          'Rate limit hit, using Retry-After header'
        )
      } else {
        logger.info(
          {
            context,
            attempt: attempt + 1,
            maxRetries: maxRetries + 1,
            delayMs: delay
          },
          'Rate limit hit, retrying after delay'
        )
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay))

      if (!(error instanceof AppError && error.details?.retryAfter)) {
        delay = Math.min(delay * backoffMultiplier, maxDelayMs)
      } else {
        delay = retryDelay
      }
    }
  }

  throw lastError
}

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const getTtlMs = (env: z.infer<typeof Env>): number => {
  const minutes = env.PRODUCT_CACHE_TTL_MINUTES ?? 15
  return minutes * 60_000
}

const isStale = (syncedAt: Date | null, now: Date, ttlMs: number): boolean => {
  if (!syncedAt) {
    return true
  }
  return now.getTime() - syncedAt.getTime() > ttlMs
}

const fetchAllRetailProducts = async (
  client: RocketRezClient
): Promise<GetProductsResponse['data']> => {
  const productsService = await client.getProductsService()

  const pageSize = 250
  let pageIndex = 0

  const all: GetProductsResponse['data'] = []

  while (true) {
    const response = await productsService.getProducts({
      pageSize,
      pageIndex,
      type: [RocketRezProductType.RETAIL, RocketRezProductType.GIFTCARD]
    })

    all.push(...response.data)

    if (response.data.length < pageSize) {
      break
    }

    pageIndex += 1
  }

  return all
}

const withConcurrency = async <T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
  delayBetweenRequestsMs: number = 0
): Promise<void> => {
  if (items.length === 0) {
    return
  }

  const queue = items.slice()

  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (true) {
      const item = queue.shift()
      if (!item) {
        return
      }
      await fn(item)
      if (delayBetweenRequestsMs > 0) {
        await sleep(delayBetweenRequestsMs)
      }
    }
  })

  await Promise.all(workers)
}

const main = async () => {
  const envResult = Env.safeParse(process.env)
  if (!envResult.success) {
    logger.error(
      { issues: envResult.error.issues },
      'Invalid environment variable configuration'
    )
    process.exit(1)
  }

  const env = envResult.data
  const ttlMs = getTtlMs(env)

  const startTime = Date.now()
  try {
    logger.info(
      { startTime: new Date(startTime).toISOString() },
      'Starting RocketRez products cache sync'
    )

    logger.info('Initializing database connection')
    const db = getDb()
    logger.info('Database connection initialized')

    logger.info('Creating RocketRez client')
    const rocketRezClient = new RocketRezClient({
      baseUrl: env.ROCKET_REZ_API_BASE_URL,
      clientId: env.ROCKET_REZ_CLIENT_ID,
      clientSecret: env.ROCKET_REZ_CLIENT_SECRET,
      scope: 'read_products'
    })

    logger.info('Authenticating with RocketRez API')
    await rocketRezClient.authenticate()
    logger.info('Successfully authenticated with RocketRez API')

    const now = new Date()
    logger.info('Fetching all retail products from RocketRez API')
    const products = await fetchAllRetailProducts(rocketRezClient)

    logger.info(
      { count: products.length },
      'Fetched products list from RocketRez'
    )

    logger.info(
      { count: products.length },
      'Upserting products list into database'
    )
    await upsertRocketRezProductList(
      db,
      products.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        category: p.category
      })),
      now
    )

    logger.info('Successfully upserted products list into cache')

    logger.info('Checking for products to delete')
    const activeProductIds = products.map((p) => p.id)
    if (activeProductIds.length === 0) {
      logger.warn(
        'Skipping deletion of missing products - fetched products list is empty. This may indicate an API error.'
      )
    } else {
      const deletedCount = await deleteMissingProducts(db, activeProductIds)
      if (deletedCount > 0) {
        logger.info({ deletedCount }, 'Deleted products no longer in API')
        logger.info({ totalDeleted: deletedCount }, 'Total products deleted')
      } else {
        logger.info('No products need deleting')
      }
    }

    logger.info('Fetching active product sync states')
    const syncStates = await listActiveProductSyncStates(db)

    const toRefresh = syncStates.filter((row) =>
      isStale(row.retailSyncedAt, now, ttlMs)
    )

    const retailCount = toRefresh.filter(
      (r) => r.type === RocketRezProductType.RETAIL
    ).length
    const giftcardCount = toRefresh.filter(
      (r) => r.type === RocketRezProductType.GIFTCARD
    ).length

    logger.info(
      {
        active: syncStates.length,
        toRefresh: toRefresh.length,
        retail: retailCount,
        giftcard: giftcardCount
      },
      'Determined product detail refresh set'
    )

    logger.info('Getting products service for detail sync')
    const productsService = await rocketRezClient.getProductsService()

    const productsToProcess = toRefresh

    logger.info(
      {
        total: productsToProcess.length,
        retail: retailCount,
        giftcard: giftcardCount
      },
      'Processing all products for detail sync'
    )

    let syncedRetailCount = 0
    let syncedGiftcardCount = 0

    await withConcurrency(
      productsToProcess,
      CONCURRENCY,
      async (row) => {
        const productId = row.id
        const productType = row.type

        // Use the correct API endpoint based on product type
        const fetchProduct =
          productType === RocketRezProductType.GIFTCARD
            ? () => productsService.getGiftcardProduct(productId)
            : () => productsService.getRetailProduct(productId)

        const [productError, productResponse] = await safeAwait(
          withRetry(fetchProduct, {
            maxRetries: RETRY_COUNT,
            initialDelayMs: RETRY_DELAY_BETWEEN_REQUESTS_MS,
            maxDelayMs: 30000,
            context: `get${productType}Product(${productId})`
          })
        )

        if (productError) {
          if (!isRateLimitError(productError)) {
            logger.warn(
              { productId, productType, error: productError },
              'Failed to refresh product'
            )
          } else {
            logger.error(
              { productId, productType, error: productError },
              'Failed to refresh product after retries'
            )
          }
          return
        }

        if (
          productResponse &&
          (productResponse.statusCode === '200' ||
            productResponse.statusCode === 'OK') &&
          productResponse.data
        ) {
          const validatedResponse =
            GetRetailProductResponseSchema.parse(productResponse)
          await updateRocketRezRetailPayload(
            db,
            productId,
            validatedResponse,
            now
          )
          if (productType === RocketRezProductType.GIFTCARD) {
            syncedGiftcardCount++
          } else {
            syncedRetailCount++
          }
          logger.info(
            { productId, productType },
            'Successfully updated product payload'
          )
        } else {
          logger.warn(
            {
              productId,
              productType,
              statusCode: productResponse?.statusCode,
              hasData: !!productResponse?.data
            },
            'Skipping product update - non-200 response or missing data'
          )
        }
      },
      DELAY_BETWEEN_REQUESTS_MS
    )

    const endTime = Date.now()
    const durationMs = endTime - startTime
    logger.info(
      {
        endTime: new Date(endTime).toISOString(),
        durationMs,
        durationSeconds: Math.round(durationMs / 1000),
        totalProducts: productsToProcess.length,
        syncedRetail: syncedRetailCount,
        syncedGiftcard: syncedGiftcardCount,
        syncedProducts: syncedRetailCount + syncedGiftcardCount
      },
      'Successfully completed RocketRez products cache sync'
    )
    process.exit(0)
  } catch (error) {
    const endTime = Date.now()
    const durationMs = endTime - startTime

    // Extract error details for proper logging
    const errorDetails: Record<string, unknown> = {
      errorType: error?.constructor?.name || typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      errorCause: error instanceof Error ? error.cause : undefined
    }

    // Add AppError-specific details if applicable
    if (error instanceof AppError) {
      errorDetails.appErrorDetails = error.details
    }

    // For non-Error objects, capture the full object
    if (!(error instanceof Error)) {
      errorDetails.rawError = error
    }

    logger.error(
      {
        ...errorDetails,
        endTime: new Date(endTime).toISOString(),
        durationMs,
        durationSeconds: Math.round(durationMs / 1000)
      },
      'Failed to sync RocketRez products cache'
    )
    process.exit(1)
  }
}

main()
