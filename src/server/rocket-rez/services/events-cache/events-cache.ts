import { and, desc, eq, ilike, notInArray, sql } from 'drizzle-orm'
import { logger } from '../../../../core/logger/logger'
import { rocketRezProductsEvents } from '../../../../db/schema'
import {
  RocketRezEventDataSchema,
  RocketRezListEventSchedulesResponseSchema,
  RocketRezProductType,
  RocketRezSchedulesDataSchema
} from '../../../../io/schemas'
import type {
  RocketRezEventData,
  RocketRezEventPayload,
  RocketRezSchedulesData,
  RocketRezSchedulesPayload
} from '../../../../io/types'

export type CachedRocketRezEvent = {
  id: number
  name: string
  type: string
  category: string | null
  event: RocketRezEventData | null
  schedules: RocketRezSchedulesData | null
  listSyncedAt: Date
  eventSyncedAt: Date | null
  schedulesSyncedAt: Date | null
}

export const upsertRocketRezEventList = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  events: {
    id: number
    name: string
    type: string
    category: string | null
  }[],
  now: Date
): Promise<void> => {
  if (events.length === 0) {
    return
  }

  await db
    .insert(rocketRezProductsEvents)
    .values(
      events.map((event) => ({
        externalId: event.id,
        name: event.name,
        type: event.type,
        category: event.category,
        listSyncedAt: now,
        updatedAt: now
      }))
    )
    .onConflictDoUpdate({
      target: rocketRezProductsEvents.externalId,
      set: {
        name: sql`excluded.name`,
        type: sql`excluded.type`,
        category: sql`excluded.category`,
        listSyncedAt: now,
        updatedAt: now,
        active: true
      }
    })
}

export const updateRocketRezEventPayload = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  eventId: number,
  payload: RocketRezEventPayload,
  now: Date
): Promise<void> => {
  // Extract only the data field from the response
  const data: RocketRezEventData = payload.data

  await db
    .update(rocketRezProductsEvents)
    .set({
      event: data,
      eventSyncedAt: now,
      updatedAt: now
    })
    .where(eq(rocketRezProductsEvents.externalId, eventId))
}

/**
 * Replaces the entire `schedules` column for the given event (full overwrite, no merge).
 * If no row exists for `eventId`, the update affects 0 rows and a warning is logged.
 * If `payload.data` is empty, existing schedules are overwritten with an empty array.
 */
export const updateRocketRezSchedulesPayload = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  eventId: number,
  payload: RocketRezSchedulesPayload,
  now: Date
): Promise<void> => {
  const data = payload.data
  const dataLength = Array.isArray(data) ? data.length : 0
  if (dataLength === 0) {
    logger.debug(
      { eventId },
      'updateRocketRezSchedulesPayload: payload.data is empty, overwriting schedules with []'
    )
  }

  const updated = await db
    .update(rocketRezProductsEvents)
    .set({
      schedules: data,
      schedulesSyncedAt: now,
      updatedAt: now
    })
    .where(eq(rocketRezProductsEvents.externalId, eventId))
    .returning({ externalId: rocketRezProductsEvents.externalId })

  if (updated.length === 0) {
    logger.warn(
      { eventId, schedulesCount: data?.length ?? 0 },
      'updateRocketRezSchedulesPayload: no row updated (row may not exist for externalId)'
    )
  }
}

const parseSchedulesPayload = (
  payload: unknown
): RocketRezSchedulesData | null => {
  const firstItem =
    Array.isArray(payload) && payload.length > 0 ? payload[0] : null
  const firstSchedule = firstItem?.schedules?.[0]
  const firstSeatType = firstSchedule?.seatTypes?.[0]

  logger.info(
    `parseSchedulesPayload: inspecting payload ${JSON.stringify(
      {
        payloadType: typeof payload,
        isArray: Array.isArray(payload),
        payloadLength: Array.isArray(payload) ? payload.length : undefined,
        firstItemKeys: firstItem ? Object.keys(firstItem) : null,
        firstItemDate: firstItem?.date,
        firstScheduleKeys: firstSchedule ? Object.keys(firstSchedule) : null,
        firstScheduleId: firstSchedule?.id,
        firstSeatTypeKeys: firstSeatType ? Object.keys(firstSeatType) : null,
        firstSeatTypeId: firstSeatType?.id,
        firstSeatTypeName: firstSeatType?.name
      },
      null,
      2
    )}`
  )

  const parsedDirect = RocketRezSchedulesDataSchema.safeParse(payload)
  if (parsedDirect.success) {
    logger.info(
      `parseSchedulesPayload: direct parse succeeded, count: ${parsedDirect.data.length}`
    )
    return parsedDirect.data
  }

  logger.error(
    `parseSchedulesPayload: direct parse failed ${JSON.stringify(
      parsedDirect.error.issues.slice(0, 5).map((issue) => ({
        path: issue.path.join('.'),
        code: issue.code,
        message: issue.message,
        expected: 'expected' in issue ? issue.expected : undefined,
        received: 'received' in issue ? issue.received : undefined
      })),
      null,
      2
    )}`
  )

  // Only try legacy shape when payload looks like full API response (object with data key)
  const isLegacyShape =
    typeof payload === 'object' &&
    payload !== null &&
    !Array.isArray(payload) &&
    'data' in payload

  if (isLegacyShape) {
    const parsedLegacy =
      RocketRezListEventSchedulesResponseSchema.safeParse(payload)
    if (parsedLegacy.success) {
      logger.info(
        `parseSchedulesPayload: legacy parse succeeded, count: ${parsedLegacy.data.data.length}`
      )
      return parsedLegacy.data.data
    }
    logger.error(
      `parseSchedulesPayload: legacy parse failed ${JSON.stringify(
        parsedLegacy.error.issues.slice(0, 3).map((issue) => ({
          path: issue.path.join('.'),
          code: issue.code,
          message: issue.message
        })),
        null,
        2
      )}`
    )
  }

  return null
}

export const getCachedRocketRezEvent = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  eventId: number
): Promise<CachedRocketRezEvent | null> => {
  const rows = await db
    .select({
      id: rocketRezProductsEvents.externalId,
      name: rocketRezProductsEvents.name,
      type: rocketRezProductsEvents.type,
      category: rocketRezProductsEvents.category,
      event: rocketRezProductsEvents.event,
      schedules: rocketRezProductsEvents.schedules,
      listSyncedAt: rocketRezProductsEvents.listSyncedAt,
      eventSyncedAt: rocketRezProductsEvents.eventSyncedAt,
      schedulesSyncedAt: rocketRezProductsEvents.schedulesSyncedAt
    })
    .from(rocketRezProductsEvents)
    .where(eq(rocketRezProductsEvents.externalId, eventId))
    .limit(1)

  const row = rows[0]
  if (!row) {
    return null
  }

  const event = row.event ? RocketRezEventDataSchema.parse(row.event) : null

  logger.info(
    `getCachedRocketRezEvent: raw row.schedules ${JSON.stringify(
      {
        eventId,
        hasSchedules: !!row.schedules,
        schedulesType: typeof row.schedules,
        isArray: Array.isArray(row.schedules),
        schedulesLength: Array.isArray(row.schedules)
          ? row.schedules.length
          : null,
        schedulesPreview: row.schedules
          ? JSON.stringify(row.schedules).slice(0, 500)
          : null
      },
      null,
      2
    )}`
  )

  const schedules = row.schedules ? parseSchedulesPayload(row.schedules) : null

  logger.info(
    `getCachedRocketRezEvent: parsed result ${JSON.stringify(
      {
        eventId,
        hasEvent: !!event,
        hasSchedules: !!schedules,
        schedulesCount: schedules?.length ?? 0
      },
      null,
      2
    )}`
  )

  return {
    ...row,
    event,
    schedules
  }
}

export const listCachedRocketRezEvents = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  request: {
    name?: string
    pageSize: number
    pageIndex: number
    activeOnly?: boolean
    startDate?: string
    endDate?: string
  }
): Promise<{ items: CachedRocketRezEvent[]; totalCount: number }> => {
  const escapeLike = (value: string): string => {
    // Escape Postgres LIKE wildcards. We'll use this with ILIKE and wrap with %...%.
    return value
      .replaceAll('\\', '\\\\')
      .replaceAll('%', '\\%')
      .replaceAll('_', '\\_')
  }

  const pageSize = request.pageSize
  const pageIndex = request.pageIndex
  const offset = pageIndex * pageSize

  // Build date filter if startDate and/or endDate are provided
  // Check if schedules contains any date within the range
  let dateFilter: ReturnType<typeof sql> | undefined
  if (request.startDate || request.endDate) {
    if (request.startDate && request.endDate) {
      dateFilter = sql`EXISTS (
        SELECT 1
        FROM jsonb_array_elements(${rocketRezProductsEvents.schedules}) AS schedule_date
        WHERE ${rocketRezProductsEvents.schedules} IS NOT NULL
          AND (schedule_date->>'date')::date >= ${request.startDate}::date
          AND (schedule_date->>'date')::date <= ${request.endDate}::date
      )`
    } else if (request.startDate) {
      dateFilter = sql`EXISTS (
        SELECT 1
        FROM jsonb_array_elements(${rocketRezProductsEvents.schedules}) AS schedule_date
        WHERE ${rocketRezProductsEvents.schedules} IS NOT NULL
          AND (schedule_date->>'date')::date >= ${request.startDate}::date
      )`
    } else if (request.endDate) {
      dateFilter = sql`EXISTS (
        SELECT 1
        FROM jsonb_array_elements(${rocketRezProductsEvents.schedules}) AS schedule_date
        WHERE ${rocketRezProductsEvents.schedules} IS NOT NULL
          AND (schedule_date->>'date')::date <= ${request.endDate}::date
      )`
    }
  }

  const where = and(
    eq(rocketRezProductsEvents.type, RocketRezProductType.EVENT),
    request.activeOnly === false
      ? undefined
      : eq(rocketRezProductsEvents.active, true),
    request.name
      ? ilike(rocketRezProductsEvents.name, `%${escapeLike(request.name)}%`)
      : undefined,
    dateFilter
  )

  const countRows = await db
    .select({
      totalCount: sql<number>`count(*)`.mapWith(Number)
    })
    .from(rocketRezProductsEvents)
    .where(where)

  const totalCount = countRows[0]?.totalCount ?? 0

  const rows = await db
    .select({
      id: rocketRezProductsEvents.externalId,
      name: rocketRezProductsEvents.name,
      type: rocketRezProductsEvents.type,
      category: rocketRezProductsEvents.category,
      event: rocketRezProductsEvents.event,
      schedules: rocketRezProductsEvents.schedules,
      listSyncedAt: rocketRezProductsEvents.listSyncedAt,
      eventSyncedAt: rocketRezProductsEvents.eventSyncedAt,
      schedulesSyncedAt: rocketRezProductsEvents.schedulesSyncedAt
    })
    .from(rocketRezProductsEvents)
    .where(where)
    .orderBy(
      desc(rocketRezProductsEvents.listSyncedAt),
      desc(rocketRezProductsEvents.externalId)
    )
    .limit(pageSize)
    .offset(offset)

  const items: CachedRocketRezEvent[] = rows.map((row) => ({
    ...row,
    event: row.event ? RocketRezEventDataSchema.parse(row.event) : null,
    schedules: row.schedules ? parseSchedulesPayload(row.schedules) : null
  }))

  return { items, totalCount }
}

export const listActiveEventSyncStates = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>
): Promise<
  {
    id: number
    eventSyncedAt: Date | null
    schedulesSyncedAt: Date | null
  }[]
> => {
  return await db
    .select({
      id: rocketRezProductsEvents.externalId,
      eventSyncedAt: rocketRezProductsEvents.eventSyncedAt,
      schedulesSyncedAt: rocketRezProductsEvents.schedulesSyncedAt
    })
    .from(rocketRezProductsEvents)
    .where(
      and(
        eq(rocketRezProductsEvents.active, true),
        eq(rocketRezProductsEvents.type, RocketRezProductType.EVENT)
      )
    )
}

export const markMissingEventsInactive = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  activeEventIds: number[],
  now: Date
): Promise<void> => {
  if (activeEventIds.length === 0) {
    await db
      .update(rocketRezProductsEvents)
      .set({ active: false, updatedAt: now })
      .where(eq(rocketRezProductsEvents.type, RocketRezProductType.EVENT))
    return
  }

  await db
    .update(rocketRezProductsEvents)
    .set({ active: false, updatedAt: now })
    .where(
      and(
        eq(rocketRezProductsEvents.type, RocketRezProductType.EVENT),
        notInArray(rocketRezProductsEvents.externalId, activeEventIds)
      )
    )
}

export const deleteMissingEvents = async (
  db: ReturnType<typeof import('../../../db/get-db').getDb>,
  activeEventIds: number[]
): Promise<number> => {
  if (activeEventIds.length === 0) {
    const result = await db
      .delete(rocketRezProductsEvents)
      .where(eq(rocketRezProductsEvents.type, RocketRezProductType.EVENT))
    return result.rowCount ?? 0
  }

  const result = await db
    .delete(rocketRezProductsEvents)
    .where(
      and(
        eq(rocketRezProductsEvents.type, RocketRezProductType.EVENT),
        notInArray(rocketRezProductsEvents.externalId, activeEventIds)
      )
    )
  return result.rowCount ?? 0
}
