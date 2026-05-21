#!/usr/bin/env bun

import { z } from 'zod'
import { initDatoSdk } from '../../../core/dato/sdk'
import { initLogger } from '../../../core/logger'
import type { PageDocument } from '../../../io/typesense'
import { getTypesenseClient } from '../client/get-typesense-client'
import { TypesenseService } from '../services'

const logger = initLogger().child({ name: 'sync-typesense-pages' })

const PageRecordSchema = z.record(z.string(), z.unknown())

const toRecord = (value: unknown): Record<string, unknown> => {
  const parsed = JSON.parse(JSON.stringify(value))
  const result = PageRecordSchema.safeParse(parsed)
  if (result.success) {
    return result.data
  }
  return {}
}

const transformPageToDocument = (
  page: Record<string, unknown>
): PageDocument => {
  const data = toRecord(page)

  const id = typeof page.id === 'string' ? page.id : String(page.id)

  const searchText = JSON.stringify(data)

  const updatedAt =
    typeof data._updatedAt === 'string'
      ? new Date(data._updatedAt).getTime()
      : Date.now()

  return {
    id,
    data,
    searchText,
    updatedAt
  }
}

const getLookbackInMinutes = (): number => {
  const raw = process.env.LOOKBACK_IN_MINUTES
  // NOTE:
  // - Unset => default incremental sync window (60 minutes)
  // - 0 => disable lookback filtering (full sync)
  const parsed = raw ? Number(raw) : 60
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 60
  }
  return parsed
}

const main = async () => {
  try {
    logger.info('Starting pages sync to Typesense')

    logger.info('Initializing DatoCMS SDK')
    const sdk = initDatoSdk()
    logger.info('DatoCMS SDK initialized')

    logger.info('Getting Typesense client')
    const typesenseClient = getTypesenseClient()
    logger.info('Typesense client obtained')

    logger.info('Creating Typesense service')
    const typesenseService = new TypesenseService(typesenseClient, logger)
    logger.info('Typesense service created')

    logger.info('Ensuring pages collection exists')
    await typesenseService.ensurePagesCollection()
    logger.info('Pages collection ready')

    logger.info('Fetching pages from Dato')

    const isRecord = (value: unknown): value is Record<string, unknown> => {
      return (
        typeof value === 'object' && value !== null && !Array.isArray(value)
      )
    }

    const hasGetAllPages = (
      value: unknown
    ): value is { getAllPages: () => Promise<{ allPages: unknown[] }> } => {
      if (!isRecord(value)) {
        return false
      }
      if (!('getAllPages' in value)) {
        return false
      }
      const method = value.getAllPages
      return typeof method === 'function'
    }

    let allPages: unknown[] = []
    if (hasGetAllPages(sdk)) {
      const result = await sdk.getAllPages()
      if (
        result &&
        typeof result === 'object' &&
        'allPages' in result &&
        Array.isArray(result.allPages)
      ) {
        allPages = result.allPages
      }
    }

    if (!allPages || allPages.length === 0) {
      throw new Error('No pages found (missing SDK query: getAllPages)')
    }

    logger.info({ count: allPages.length }, 'Fetched pages from Dato')

    const lookbackInMinutes = getLookbackInMinutes()

    const allDocuments = allPages
      .map((page) => {
        const result = PageRecordSchema.safeParse(page)
        return result.success ? result.data : null
      })
      .filter((page): page is Record<string, unknown> => page !== null)
      .map(transformPageToDocument)
    const windowStart =
      lookbackInMinutes === 0 ? null : Date.now() - lookbackInMinutes * 60_000

    const documents =
      windowStart === null
        ? allDocuments
        : allDocuments.filter((doc) => doc.updatedAt >= windowStart)

    logger.info(
      {
        lookbackInMinutes,
        windowStart,
        totalFetched: allPages.length,
        totalTransformed: allDocuments.length,
        toSync: documents.length
      },
      windowStart === null
        ? 'Full pages sync (no lookback filtering)'
        : 'Filtered pages to sync window'
    )

    await typesenseService.syncPages(documents)

    logger.info('Successfully completed pages sync')
    process.exit(0)
  } catch (error) {
    // Extract error details for proper logging
    const errorDetails: Record<string, unknown> = {
      errorType: error?.constructor?.name || typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      errorCause: error instanceof Error ? error.cause : undefined
    }

    // For non-Error objects, capture the full object
    if (!(error instanceof Error)) {
      errorDetails.rawError = error
    }

    logger.error(errorDetails, 'Failed to sync pages')
    process.exit(1)
  }
}

main()
