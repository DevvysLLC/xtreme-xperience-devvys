import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  text,
  timestamp,
  unique,
  uuid
} from 'drizzle-orm/pg-core'
import type {
  RocketRezEventData,
  RocketRezSchedulesData
} from '../../../io/types'
import { appSchema } from './schema'

export const rocketRezProductsEvents = appSchema.table(
  'rocket_rez_products_events',
  {
    uid: uuid('uid').primaryKey().defaultRandom().notNull(),
    externalId: integer('external_id').notNull(),

    name: text('name').notNull(),
    type: text('type').notNull(),
    category: text('category'),

    /**
     * Event product data from `/v1/headless/products/event/{id}` response.data
     */
    event: jsonb('event').$type<RocketRezEventData | null>(),

    /**
     * Schedules data from `/v1/headless/products/event/{id}/schedules` response.data
     * Array of schedule dates with their time slots
     */
    schedules: jsonb('schedules').$type<RocketRezSchedulesData | null>(),

    active: boolean('active').notNull().default(true),

    listSyncedAt: timestamp('list_synced_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    eventSyncedAt: timestamp('event_synced_at', { withTimezone: true }),
    schedulesSyncedAt: timestamp('schedules_synced_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`)
  },
  (table) => [
    unique('rocket_rez_products_events_external_id_unique').on(
      table.externalId
    ),
    index('rocket_rez_products_events_name_idx').on(table.name),
    index('rocket_rez_products_events_active_idx').on(table.active)
  ]
)
