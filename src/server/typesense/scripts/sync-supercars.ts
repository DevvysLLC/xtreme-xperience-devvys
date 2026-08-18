#!/usr/bin/env bun

import { z } from 'zod'
import { initDatoSdk, type Sdk } from '../../../core/dato/sdk'
import { initLogger } from '../../../core/logger'
import type { SupercarDocument } from '../../../io/typesense'
import { getTypesenseClient } from '../client/get-typesense-client'
import { TypesenseService } from '../services'

const logger = initLogger().child({ name: 'sync-typesense-supercars' })

type Supercar = Awaited<ReturnType<Sdk['getSupercars']>>['allSupercars'][number]

const RecordSchema = z.record(z.string(), z.unknown())

const toRecord = (value: unknown): Record<string, unknown> => {
  const parsed = JSON.parse(JSON.stringify(value))
  const result = RecordSchema.safeParse(parsed)
  if (result.success) {
    return result.data
  }
  return {}
}

const transformSupercarToDocument = (supercar: Supercar): SupercarDocument => {
  const data = toRecord(supercar)

  const searchText = JSON.stringify(data)

  const updatedAt =
    typeof data._updatedAt === 'string'
      ? new Date(data._updatedAt).getTime()
      : Date.now()

  return {
    id: supercar.id,
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
    logger.info('Starting supercars sync to Typesense')

    logger.info('Initializing DatoCMS SDK')
    const sdk = initDatoSdk()
    logger.info('DatoCMS SDK initialized')

    logger.info('Getting Typesense client')
    const typesenseClient = getTypesenseClient()
    logger.info('Typesense client obtained')

    logger.info('Creating Typesense service')
    const typesenseService = new TypesenseService(typesenseClient, logger)
    logger.info('Typesense service created')

    logger.info('Ensuring supercars collection exists')
    await typesenseService.ensureSupercarsCollection()
    logger.info('Supercars collection ready')

    logger.info('Fetching supercars from Dato')
    const { allSupercars } = await sdk.getSupercars()
    logger.info({ count: allSupercars.length }, 'Fetched supercars from Dato')

    const filteredSupercars = allSupercars.filter(
      (sc) => sc.content?.sections && sc.content.sections.length > 0
    )
    logger.info(
      { count: filteredSupercars.length },
      'Filtered supercars with content'
    )

    const lookbackInMinutes = getLookbackInMinutes()

    const allDocuments = filteredSupercars.map(transformSupercarToDocument)
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
        totalFetched: allSupercars.length,
        totalTransformed: allDocuments.length,
        toSync: documents.length
      },
      windowStart === null
        ? 'Full supercars sync (no lookback filtering)'
        : 'Filtered supercars to sync window'
    )

    await typesenseService.syncSupercars(documents)

    logger.info('Successfully completed supercars sync')
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

    logger.error(errorDetails, 'Failed to sync supercars')
    process.exit(1)
  }
}

main()
