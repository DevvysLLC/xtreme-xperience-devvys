import { and, eq, isNull } from 'drizzle-orm'
import { AppError } from '../../../../core/errors/app-error'
import { logger } from '../../../../core/logger/logger'
import { rocketRezOrders } from '../../../../db/schema'
import type {
  CreateOrderRequest,
  OrderResponse,
  PersistedLocationState
} from '../../../../io/types'
import { getDb } from '../../../db/get-db'

type OrderRow = {
  uid: string
  externalId: number
  userGuid: string
  email: string
  order: OrderResponse['order']
  metadata: OrderResponse['metadata']
  location?: OrderResponse['location']
  viewedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export class OrderService {
  private isMissingLocationColumnError(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false
    }

    return error.message.includes('column "location" does not exist')
  }

  private toOrderResponse(
    order: OrderRow,
    fallbackLocation: OrderResponse['location'] = null
  ): OrderResponse {
    return {
      uid: order.uid,
      externalId: order.externalId,
      userGuid: order.userGuid,
      email: order.email,
      order: order.order,
      metadata: order.metadata ?? null,
      location: order.location ?? fallbackLocation,
      viewedAt: order.viewedAt?.toISOString() ?? null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }
  }

  async createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
    logger.info({ request }, 'order-service.createOrder')

    const { orderId, userGuid, order, metadata, location } = request

    const db = getDb()

    let existingOrder: OrderRow[]
    try {
      existingOrder = await db
        .select()
        .from(rocketRezOrders)
        .where(eq(rocketRezOrders.externalId, orderId))
        .limit(1)
    } catch (error) {
      if (!this.isMissingLocationColumnError(error)) {
        throw error
      }

      existingOrder = await db
        .select({
          uid: rocketRezOrders.uid,
          externalId: rocketRezOrders.externalId,
          userGuid: rocketRezOrders.userGuid,
          email: rocketRezOrders.email,
          order: rocketRezOrders.order,
          metadata: rocketRezOrders.metadata,
          viewedAt: rocketRezOrders.viewedAt,
          createdAt: rocketRezOrders.createdAt,
          updatedAt: rocketRezOrders.updatedAt
        })
        .from(rocketRezOrders)
        .where(eq(rocketRezOrders.externalId, orderId))
        .limit(1)
    }

    const existing = existingOrder[0]
    if (existing) {
      logger.warn(
        { orderId, uid: existing.uid },
        'order-service.createOrder.duplicate'
      )
      throw new AppError('Order already exists', {
        traceTag: 'order-service.createOrder',
        orderId
      })
    }

    const primaryContact = order.contacts?.find((contact) => contact.isPrimary)
    const email = primaryContact?.email

    if (!email) {
      throw new AppError('Primary contact email is required', {
        traceTag: 'order-service.createOrder',
        orderId
      })
    }

    const locationPayload: PersistedLocationState | null = location ?? null

    let result: OrderRow[]
    let locationFallback: OrderResponse['location'] = null
    try {
      result = await db
        .insert(rocketRezOrders)
        .values({
          externalId: orderId,
          userGuid,
          email,
          order,
          metadata: metadata ?? null,
          location: locationPayload
        })
        .returning()
    } catch (error) {
      if (!this.isMissingLocationColumnError(error)) {
        throw error
      }

      locationFallback = locationPayload
      result = await db
        .insert(rocketRezOrders)
        .values({
          externalId: orderId,
          userGuid,
          email,
          order,
          metadata: metadata ?? null
        })
        .returning({
          uid: rocketRezOrders.uid,
          externalId: rocketRezOrders.externalId,
          userGuid: rocketRezOrders.userGuid,
          email: rocketRezOrders.email,
          order: rocketRezOrders.order,
          metadata: rocketRezOrders.metadata,
          viewedAt: rocketRezOrders.viewedAt,
          createdAt: rocketRezOrders.createdAt,
          updatedAt: rocketRezOrders.updatedAt
        })
    }

    const newOrder = result[0]
    if (!newOrder) {
      throw new AppError('Failed to create order', {
        traceTag: 'order-service.createOrder'
      })
    }

    logger.info({ orderId, uid: newOrder.uid }, 'order-service.createOrder.new')

    // Trigger Zapier Webhook in background for gift cards
    const webhookUrl = process.env.ZAPIER_GIFT_CARD_WEBHOOK_URL
    const giftCardMetas = metadata?.filter((item) => item?.type === 'gift_card') ?? []
    if (webhookUrl && giftCardMetas.length > 0) {
      const phone = primaryContact?.phone ?? null
      const firstName = primaryContact?.firstName ?? ''
      const lastName = primaryContact?.lastName ?? ''
      const customerName = `${firstName} ${lastName}`.trim()
      const totalValue = order.total ?? 0

      for (const giftMeta of giftCardMetas) {
        const recipientEmail = giftMeta.recipientEmail ?? giftMeta.properties?.recipientEmail ?? null
        const recipientName = giftMeta.recipientName ?? giftMeta.properties?.recipientName ?? null
        const giftMessage = giftMeta.giftMessage ?? giftMeta.properties?.giftMessage ?? null

        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            customerEmail: email,
            customerPhone: phone,
            customerName,
            orderTotal: totalValue,
            recipientEmail,
            recipientName,
            giftMessage
          })
        })
          .then((res) => {
            if (!res.ok) {
              logger.error({ status: res.status, orderId }, 'Zapier webhook returned non-OK status')
            } else {
              logger.info({ orderId }, 'Successfully sent order webhook to Zapier')
            }
          })
          .catch((err) => {
            logger.error({ err, orderId }, 'Error sending order webhook to Zapier')
          })
      }
    }

    return this.toOrderResponse(newOrder, locationFallback)
  }

  async getOrder(
    id: string | number,
    userGuid: string
  ): Promise<OrderResponse> {
    logger.info({ id }, 'order-service.getOrder')

    const db = getDb()
    let order: OrderRow | undefined

    const numericId = typeof id === 'string' ? Number.parseInt(id, 10) : id
    if (!Number.isNaN(numericId)) {
      try {
        const result = await db
          .select()
          .from(rocketRezOrders)
          .where(eq(rocketRezOrders.externalId, numericId))
          .limit(1)
        order = result[0]
      } catch (error) {
        if (!this.isMissingLocationColumnError(error)) {
          throw error
        }

        const fallback = await db
          .select({
            uid: rocketRezOrders.uid,
            externalId: rocketRezOrders.externalId,
            userGuid: rocketRezOrders.userGuid,
            email: rocketRezOrders.email,
            order: rocketRezOrders.order,
            metadata: rocketRezOrders.metadata,
            viewedAt: rocketRezOrders.viewedAt,
            createdAt: rocketRezOrders.createdAt,
            updatedAt: rocketRezOrders.updatedAt
          })
          .from(rocketRezOrders)
          .where(eq(rocketRezOrders.externalId, numericId))
          .limit(1)
        order = fallback[0]
      }
    } else {
      try {
        const result = await db
          .select()
          .from(rocketRezOrders)
          .where(eq(rocketRezOrders.uid, String(id)))
          .limit(1)
        order = result[0]
      } catch (error) {
        if (!this.isMissingLocationColumnError(error)) {
          throw error
        }

        const fallback = await db
          .select({
            uid: rocketRezOrders.uid,
            externalId: rocketRezOrders.externalId,
            userGuid: rocketRezOrders.userGuid,
            email: rocketRezOrders.email,
            order: rocketRezOrders.order,
            metadata: rocketRezOrders.metadata,
            viewedAt: rocketRezOrders.viewedAt,
            createdAt: rocketRezOrders.createdAt,
            updatedAt: rocketRezOrders.updatedAt
          })
          .from(rocketRezOrders)
          .where(eq(rocketRezOrders.uid, String(id)))
          .limit(1)
        order = fallback[0]
      }
    }

    if (!order) {
      throw new AppError('Order not found', {
        traceTag: 'order-service.getOrder',
        id
      })
    }

    if (order.userGuid !== userGuid) {
      logger.warn(
        {
          orderId: order.externalId,
          orderUserGuid: order.userGuid,
          providedUserGuid: userGuid
        },
        'order-service.getOrder.unauthorized'
      )
      throw new AppError('Unauthorized access to order', {
        traceTag: 'order-service.getOrder',
        id
      })
    }

    return this.toOrderResponse(order)
  }

  async markOrderViewed(
    id: string | number,
    userGuid: string
  ): Promise<OrderResponse> {
    logger.info({ id }, 'order-service.markOrderViewed')

    const db = getDb()

    const numericId = typeof id === 'string' ? Number.parseInt(id, 10) : id
    if (Number.isNaN(numericId)) {
      throw new AppError('Invalid order ID', {
        traceTag: 'order-service.markOrderViewed',
        id
      })
    }

    let result: OrderRow[]
    try {
      result = await db
        .update(rocketRezOrders)
        .set({ viewedAt: new Date() })
        .where(
          and(
            eq(rocketRezOrders.externalId, numericId),
            eq(rocketRezOrders.userGuid, userGuid),
            isNull(rocketRezOrders.viewedAt)
          )
        )
        .returning()
    } catch (error) {
      if (!this.isMissingLocationColumnError(error)) {
        throw error
      }

      result = await db
        .update(rocketRezOrders)
        .set({ viewedAt: new Date() })
        .where(
          and(
            eq(rocketRezOrders.externalId, numericId),
            eq(rocketRezOrders.userGuid, userGuid),
            isNull(rocketRezOrders.viewedAt)
          )
        )
        .returning({
          uid: rocketRezOrders.uid,
          externalId: rocketRezOrders.externalId,
          userGuid: rocketRezOrders.userGuid,
          email: rocketRezOrders.email,
          order: rocketRezOrders.order,
          metadata: rocketRezOrders.metadata,
          viewedAt: rocketRezOrders.viewedAt,
          createdAt: rocketRezOrders.createdAt,
          updatedAt: rocketRezOrders.updatedAt
        })
    }

    const updated = result[0]
    if (!updated) {
      // Either not found, unauthorized, or already viewed — fetch to determine
      const existing = await this.getOrder(id, userGuid)
      return existing
    }

    logger.info(
      { orderId: updated.externalId, uid: updated.uid },
      'order-service.markOrderViewed.success'
    )

    return this.toOrderResponse(updated)
  }
}
