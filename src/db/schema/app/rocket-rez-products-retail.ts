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
import type { RocketRezRetailProductData } from '../../../io/types'
import { appSchema } from './schema'

export const rocketRezProductsRetail = appSchema.table(
  'rocket_rez_products_retail',
  {
    uid: uuid('uid').primaryKey().defaultRandom().notNull(),
    externalId: integer('external_id').notNull(),

    name: text('name').notNull(),
    type: text('type').notNull(),
    category: text('category'),

    /**
     * Retail product data from `/v1/headless/products/retail/{id}` response.data
     */
    retailPayload: jsonb(
      'retail_payload'
    ).$type<RocketRezRetailProductData | null>(),

    active: boolean('active').notNull().default(true),

    listSyncedAt: timestamp('list_synced_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    retailSyncedAt: timestamp('retail_synced_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`)
  },
  (table) => [
    unique('rocket_rez_products_retail_external_id_unique').on(
      table.externalId
    ),
    index('rocket_rez_products_retail_name_idx').on(table.name),
    index('rocket_rez_products_retail_active_idx').on(table.active)
  ]
)
