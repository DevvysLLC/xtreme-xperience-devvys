import { integer, jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import type {
  CartLineItemMetadata,
  PersistedLocationState,
  RocketRezCart
} from '../../../io/types'
import { appSchema } from './schema'

export const rocketRezOrders = appSchema.table('rocket_rez_orders', {
  uid: uuid('uid').primaryKey().defaultRandom().notNull(),
  externalId: integer('external_id').notNull().unique(),
  userGuid: text('user_guid').notNull(),
  email: text('email').notNull(),

  order: jsonb('order').$type<RocketRezCart>().notNull(),
  metadata: jsonb('metadata').$type<CartLineItemMetadata[]>(),
  location: jsonb('location').$type<PersistedLocationState>(),

  viewedAt: timestamp('viewed_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
})
