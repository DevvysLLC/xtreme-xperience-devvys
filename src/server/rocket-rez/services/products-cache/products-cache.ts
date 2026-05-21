import { and, desc, eq, inArray, notInArray, sql } from 'drizzle-orm'
import { rocketRezProductsRetail } from '../../../../db/schema'
import {
  RocketRezProductType,
  RocketRezRetailProductDataSchema
} from '../../../../io/schemas'
import type {
  RocketRezRetailPayload,
  RocketRezRetailProductData
} from '../../../../io/types'

const RETAIL_PRODUCT_TYPES = [
  RocketRezProductType.RETAIL,
  RocketRezProductType.GIFTCARD
]

export type CachedRocketRezProduct = {
  id: number
  name: string
  type: string
  category: string | null
  retailPayload: RocketRezRetailProductData | null
  listSyncedAt: Date
  retailSyncedAt: Date | null
}

export const upsertRocketRezProductList = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  items: {
    id: number
    name: string
    type: string
    category: string | null
  }[],
  now: Date
): Promise<void> => {
  if (items.length === 0) {
    return
  }

  await db.transaction(async (tx) => {
    // Mark all existing Retail and Giftcard rows inactive first, then re-activate/upsert what we saw.
    await tx
      .update(rocketRezProductsRetail)
      .set({ active: false, updatedAt: now })
      .where(inArray(rocketRezProductsRetail.type, RETAIL_PRODUCT_TYPES))

    for (const item of items) {
      await tx
        .insert(rocketRezProductsRetail)
        .values({
          externalId: item.id,
          name: item.name,
          type: item.type,
          category: item.category,
          active: true,
          listSyncedAt: now,
          updatedAt: now
        })
        .onConflictDoUpdate({
          target: rocketRezProductsRetail.externalId,
          set: {
            name: item.name,
            type: item.type,
            category: item.category,
            active: true,
            listSyncedAt: now,
            updatedAt: now
          }
        })
    }
  })
}

export const updateRocketRezRetailPayload = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  productId: number,
  payload: RocketRezRetailPayload,
  now: Date
): Promise<void> => {
  // Extract only the data field from the response
  const data: RocketRezRetailProductData = payload.data
  await db
    .update(rocketRezProductsRetail)
    .set({
      retailPayload: data,
      retailSyncedAt: now,
      updatedAt: now
    })
    .where(eq(rocketRezProductsRetail.externalId, productId))
}

export const getCachedRocketRezProduct = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  productId: number
): Promise<CachedRocketRezProduct | null> => {
  const rows = await db
    .select({
      id: rocketRezProductsRetail.externalId,
      name: rocketRezProductsRetail.name,
      type: rocketRezProductsRetail.type,
      category: rocketRezProductsRetail.category,
      retailPayload: rocketRezProductsRetail.retailPayload,
      listSyncedAt: rocketRezProductsRetail.listSyncedAt,
      retailSyncedAt: rocketRezProductsRetail.retailSyncedAt
    })
    .from(rocketRezProductsRetail)
    .where(eq(rocketRezProductsRetail.externalId, productId))
    .limit(1)

  const row = rows[0]
  if (!row) {
    return null
  }

  const retailPayload = row.retailPayload
    ? RocketRezRetailProductDataSchema.parse(row.retailPayload)
    : null

  return {
    ...row,
    retailPayload
  }
}

export const listActiveProductSyncStates = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>
): Promise<
  {
    id: number
    type: string
    retailSyncedAt: Date | null
  }[]
> => {
  return await db
    .select({
      id: rocketRezProductsRetail.externalId,
      type: rocketRezProductsRetail.type,
      retailSyncedAt: rocketRezProductsRetail.retailSyncedAt
    })
    .from(rocketRezProductsRetail)
    .where(
      and(
        eq(rocketRezProductsRetail.active, true),
        inArray(rocketRezProductsRetail.type, RETAIL_PRODUCT_TYPES)
      )
    )
}

export const listCachedRocketRezProducts = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  request: {
    category?: string
    type?: string
    types?: string[]
    pageSize: number
    pageIndex: number
    activeOnly?: boolean
  }
): Promise<{ items: CachedRocketRezProduct[]; totalCount: number }> => {
  const pageSize = request.pageSize
  const pageIndex = request.pageIndex
  const offset = pageIndex * pageSize

  // Build type filter: specific types array, single type, or default to 'Retail'
  // Guard against empty types array - inArray([]) generates invalid SQL
  const typeFilter =
    request.types && request.types.length > 0
      ? inArray(rocketRezProductsRetail.type, request.types)
      : request.type
        ? eq(rocketRezProductsRetail.type, request.type)
        : eq(rocketRezProductsRetail.type, RocketRezProductType.RETAIL)

  const where = and(
    typeFilter,
    request.activeOnly === false
      ? undefined
      : eq(rocketRezProductsRetail.active, true),
    request.category
      ? eq(rocketRezProductsRetail.category, request.category)
      : undefined
  )

  const countRows = await db
    .select({
      totalCount: sql<number>`count(*)`.mapWith(Number)
    })
    .from(rocketRezProductsRetail)
    .where(where)

  const totalCount = countRows[0]?.totalCount ?? 0

  const rows = await db
    .select({
      id: rocketRezProductsRetail.externalId,
      name: rocketRezProductsRetail.name,
      type: rocketRezProductsRetail.type,
      category: rocketRezProductsRetail.category,
      retailPayload: rocketRezProductsRetail.retailPayload,
      listSyncedAt: rocketRezProductsRetail.listSyncedAt,
      retailSyncedAt: rocketRezProductsRetail.retailSyncedAt
    })
    .from(rocketRezProductsRetail)
    .where(where)
    .orderBy(
      desc(rocketRezProductsRetail.listSyncedAt),
      desc(rocketRezProductsRetail.externalId)
    )
    .limit(pageSize)
    .offset(offset)

  const items: CachedRocketRezProduct[] = rows.map((row) => ({
    ...row,
    retailPayload: row.retailPayload
      ? RocketRezRetailProductDataSchema.parse(row.retailPayload)
      : null
  }))

  return { items, totalCount }
}

export const markMissingProductsInactive = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  activeProductIds: number[],
  now: Date
): Promise<void> => {
  if (activeProductIds.length === 0) {
    await db
      .update(rocketRezProductsRetail)
      .set({ active: false, updatedAt: now })
      .where(inArray(rocketRezProductsRetail.type, RETAIL_PRODUCT_TYPES))
    return
  }

  await db
    .update(rocketRezProductsRetail)
    .set({ active: false, updatedAt: now })
    .where(
      and(
        inArray(rocketRezProductsRetail.type, RETAIL_PRODUCT_TYPES),
        notInArray(rocketRezProductsRetail.externalId, activeProductIds)
      )
    )
}

export const deleteMissingProducts = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  activeProductIds: number[]
): Promise<number> => {
  if (activeProductIds.length === 0) {
    const result = await db
      .delete(rocketRezProductsRetail)
      .where(inArray(rocketRezProductsRetail.type, RETAIL_PRODUCT_TYPES))
    return result.rowCount ?? 0
  }

  const result = await db
    .delete(rocketRezProductsRetail)
    .where(
      and(
        inArray(rocketRezProductsRetail.type, RETAIL_PRODUCT_TYPES),
        notInArray(rocketRezProductsRetail.externalId, activeProductIds)
      )
    )
  return result.rowCount ?? 0
}
