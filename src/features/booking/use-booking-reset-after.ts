'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BookingWizardPageKey } from '../../components/booking-wizard/config'
import { bookingWizardConfig } from '../../components/booking-wizard/config'
import { logger } from '../../core/logger/logger'
import type { CartState } from '../../io/types'
import { CART_QUERY_KEY, useCartClear } from '../cart'
import { LOG_NAMESPACE } from './config'
import { useBookingClearPage } from './use-booking-clear-page'

type ResetAfterOptions = {
  pageId: BookingWizardPageKey
  clearCart?: boolean
}

const getPagesAfter = (
  pageId: BookingWizardPageKey
): BookingWizardPageKey[] => {
  const enabledPages = bookingWizardConfig.pages.filter((p) => p.enabled)
  const targetPage = enabledPages.find((p) => p.id === pageId)

  if (!targetPage) {
    logger.warn({ pageId }, `${LOG_NAMESPACE}: getPagesAfter — page not found`)
    return []
  }

  const targetIndex = enabledPages.indexOf(targetPage)
  const pagesAfter = enabledPages.slice(targetIndex + 1)

  return pagesAfter.map((page) => page.id)
}

export const useBookingResetAfter = () => {
  const qc = useQueryClient()
  const clearCart = useCartClear()
  const clearPage = useBookingClearPage()

  return useMutation({
    mutationFn: async (options: ResetAfterOptions) => {
      const { pageId, clearCart: shouldClearCart = true } = options
      logger.info(
        { pageId, clearCart: shouldClearCart },
        `${LOG_NAMESPACE}: mutation.resetAfter.onMutate`
      )

      if (shouldClearCart) {
        const cartKey = qc.getQueryData<CartState>(CART_QUERY_KEY)?.cartKey
        if (cartKey) {
          await clearCart.mutateAsync(undefined)
          logger.info(
            {},
            `${LOG_NAMESPACE}: mutation.resetAfter.clearCart.success`
          )
        }
      }

      const pagesToClear = getPagesAfter(pageId)

      if (pagesToClear.length === 0) {
        logger.info(
          { pageId },
          `${LOG_NAMESPACE}: mutation.resetAfter — no pages to clear`
        )
        return true
      }

      for (const pageIdToClear of pagesToClear) {
        await clearPage.mutateAsync(pageIdToClear)
      }

      logger.info(
        { pageId, pagesCleared: pagesToClear },
        `${LOG_NAMESPACE}: mutation.resetAfter.onSuccess`
      )

      return true
    },
    onSuccess: (data, variables) => {
      logger.info(
        { data, variables },
        `${LOG_NAMESPACE}: mutation.resetAfter.onSuccess`
      )
    },
    onError: (error, variables) => {
      logger.error(
        { error, variables },
        `${LOG_NAMESPACE}: mutation.resetAfter.onError`
      )
    }
  })
}

export type UseBookingResetAfterReturn = ReturnType<typeof useBookingResetAfter>
