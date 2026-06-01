'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CHOOSE_ON_DRIVE_DAY_INPUT_VALUE } from '../../config/settings'
import type { InsuranceFragment } from '../../core/dato/fragments/insurance.typegen'
import { logger } from '../../core/logger/logger'
import type { CartState, RocketRezAddLineItemAddon } from '../../io/types'
import { getCartLineItemReadMetadataKey } from '../../utils/get-cart-line-item-metadata-key'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'
import { useCartAddInsurance } from './use-cart-add-insurance'
import { useCartRemoveLineItem } from './use-cart-remove-line-item'

type DecodedMetadataKey = {
  id?: string | number
  type?: string
  scheduleId?: string | number
  rateId?: string | number
}

const decodeMetadataKey = (key: string): DecodedMetadataKey | null => {
  try {
    const decoded = atob(key)
    const parsed = JSON.parse(decoded) as DecodedMetadataKey
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

const toComparable = (value: string | number | null | undefined): string => {
  if (value == null) {
    return ''
  }

  return String(value)
}

const getLineItemMetadata = (
  lineItem: CartState['cartData']['lineItems'][number],
  metadata: CartState['metadata']
) => {
  const exactKey = getCartLineItemReadMetadataKey({ lineItem })
  const exact = metadata.find((m) => m.key === exactKey)

  if (exact) {
    return exact
  }

  return metadata.find((m) => {
    const decoded = decodeMetadataKey(m.key)
    if (!decoded) {
      return false
    }

    const sameId = toComparable(decoded.id) === toComparable(lineItem.productId)
    const sameType =
      toComparable(decoded.type).toLowerCase() ===
      toComparable(lineItem.type).toLowerCase()

    if (!sameId || !sameType) {
      return false
    }

    if (
      decoded.scheduleId != null &&
      toComparable(decoded.scheduleId) !== toComparable(lineItem.scheduleId)
    ) {
      return false
    }

    if (
      decoded.rateId != null &&
      toComparable(decoded.rateId) !== toComparable(lineItem.rateId)
    ) {
      return false
    }

    return true
  })
}

export type UseCartReplaceInsuranceInput = {
  insurance: InsuranceFragment
  lineItem: RocketRezAddLineItemAddon
}

export type UseCartReplaceInsuranceResult = {
  skipped: boolean
  removed: boolean
  added: boolean
}

export const useCartReplaceInsurance = () => {
  const qc = useQueryClient()
  const { mutateAsync: addInsurance } = useCartAddInsurance()
  const { mutateAsync: removeLineItem } = useCartRemoveLineItem()

  return useMutation<
    UseCartReplaceInsuranceResult,
    Error,
    UseCartReplaceInsuranceInput
  >({
    mutationFn: async (input) => {
      logger.info({ input }, `${LOG_NAMESPACE}: mutationFn [replaceInsurance]`)
      const state =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      const cartData = state.cartData
      const metadata = state.metadata

      const lineItems = cartData?.lineItems ?? []
      let insuranceCount = 0
      let insuranceSessions = 0
      const existingInsuranceLineItems: (typeof lineItems)[0][] = []

      for (const lineItem of lineItems) {
        const itemMetadata = getLineItemMetadata(lineItem, metadata)
        const itemType = itemMetadata?.type

        if (itemType === 'insurance') {
          insuranceCount += lineItem.quantity
          existingInsuranceLineItems.push(lineItem)
        } else if (itemType === 'car') {
          const sessionsForItem =
            lineItem.quantity *
            (itemMetadata?.isMulticar ? (itemMetadata?.multicarCount ?? 1) : 1)
          if (itemMetadata?.isRideAlong !== true) {
            insuranceSessions += sessionsForItem
          }
        }
      }

      const hasInsurance = insuranceCount > 0
      const insuranceQuantityMatchesTotalSessions =
        insuranceCount === 0 || insuranceCount === insuranceSessions
      const totalInsurance = insuranceCount
      const existingInsuranceProductId =
        existingInsuranceLineItems[0]?.productId ?? null
      const requestedInsuranceProductId = input.lineItem.id
      const insuranceProductMatches =
        existingInsuranceProductId === requestedInsuranceProductId

      logger.info(
        {
          hasInsurance,
          existingInsuranceCount: existingInsuranceLineItems.length,
          insuranceQuantityMatchesTotalSessions,
          totalInsurance,
          insuranceSessions,
          existingInsuranceProductId,
          requestedInsuranceProductId,
          insuranceProductMatches,
          input,
          insuranceRocketRezId: input.insurance.model?.rocketRezId
        },
        `${LOG_NAMESPACE}: mutation.onMutate [replaceInsurance]`
      )

      const insuranceRocketRezId = input.insurance.model?.rocketRezId ?? ''
      const isChooseOnDriveDay =
        insuranceRocketRezId === CHOOSE_ON_DRIVE_DAY_INPUT_VALUE

      if (isChooseOnDriveDay) {
        logger.info(
          { insuranceRocketRezId, isChooseOnDriveDay },
          `${LOG_NAMESPACE}: replaceInsurance — setting chooseOnDriveDay = true`
        )

        for (const insuranceLineItem of existingInsuranceLineItems) {
          await removeLineItem({ lineItem: insuranceLineItem })
          logger.info(
            {
              lineItemId: insuranceLineItem.id,
              productId: insuranceLineItem.productId
            },
            `${LOG_NAMESPACE}: replaceInsurance — removed existing insurance before chooseOnDriveDay`
          )
        }

        const currentState =
          qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
        const next = { ...currentState, chooseOnDriveDay: true }
        qc.setQueryData<CartState>(CART_QUERY_KEY, next)
        cartRepository.write(next)

        return { skipped: true, removed: hasInsurance, added: false }
      }

      const currentState =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      const next = { ...currentState, chooseOnDriveDay: false }
      qc.setQueryData<CartState>(CART_QUERY_KEY, next)
      cartRepository.write(next)

      if (
        hasInsurance &&
        insuranceQuantityMatchesTotalSessions &&
        totalInsurance === insuranceSessions &&
        insuranceProductMatches
      ) {
        logger.info(
          {
            hasInsurance,
            insuranceQuantityMatchesTotalSessions,
            totalInsurance,
            insuranceSessions
          },
          `${LOG_NAMESPACE}: replaceInsurance — insurance already correct, skipping`
        )
        return { skipped: true, removed: false, added: false }
      }

      if (hasInsurance && !insuranceProductMatches) {
        logger.info(
          {
            hasInsurance,
            insuranceQuantityMatchesTotalSessions,
            existingInsuranceCount: existingInsuranceLineItems.length,
            totalInsurance,
            insuranceSessions,
            existingInsuranceProductId,
            requestedInsuranceProductId,
            insuranceProductMatches
          },
          `${LOG_NAMESPACE}: replaceInsurance — removing existing insurance (product mismatch)`
        )

        for (const insuranceItemToRemove of existingInsuranceLineItems) {
          await removeLineItem({ lineItem: insuranceItemToRemove })
          logger.info(
            {
              lineItemId: insuranceItemToRemove.id,
              productId: insuranceItemToRemove.productId
            },
            `${LOG_NAMESPACE}: replaceInsurance — removed existing insurance`
          )
        }
      }

      await addInsurance({
        insurance: input.insurance,
        lineItem: { ...input.lineItem, quantity: insuranceSessions },
        totalSessions: insuranceSessions
      })

      logger.info(
        { input },
        `${LOG_NAMESPACE}: replaceInsurance — added new insurance`
      )

      const wasRemoved =
        hasInsurance && !insuranceProductMatches

      return { skipped: false, removed: wasRemoved, added: true }
    },
    onMutate: (input) => {
      logger.info(
        { input },
        `${LOG_NAMESPACE}: mutation.onMutate [replaceInsurance]`
      )
    },
    onSuccess: (data, variables) => {
      logger.info(
        { data, variables },
        `${LOG_NAMESPACE}: mutation.onSuccess [replaceInsurance]`
      )
    },
    onError: (error, variables) => {
      logger.error(
        { error, variables },
        `${LOG_NAMESPACE}: mutation.onError [replaceInsurance]`
      )
    }
  })
}
