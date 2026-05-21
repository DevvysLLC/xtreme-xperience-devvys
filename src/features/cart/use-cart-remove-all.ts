'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import { clearTrackedCartSnapshots } from '../../features/analytics/utils'
import { CHECKOUT_QUERY_KEY } from '../../features/checkout/keys'
import {
  checkoutRepository,
  initialCheckoutState
} from '../../features/checkout/repository'
import type { ApiCartResponse } from '../../io'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { cartRepository, initialCartState } from './repository'
import { useCartMutation } from './use-cart-mutation'

export const useCartRemoveAll = (): UseMutationResult<
  ApiCartResponse,
  Error,
  undefined
> => {
  const qc = useQueryClient()

  return useCartMutation<undefined>({
    endpoint: ROUTES.API.CART.CLEAR,
    method: 'DELETE',
    requireCartKey: true,
    skipSetCartData: true,
    onSuccessExtra: (data, input) => {
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [removeAll]`
      )

      clearTrackedCartSnapshots()
      qc.setQueryData(CART_QUERY_KEY, initialCartState)
      cartRepository.clear()

      qc.setQueryData(CHECKOUT_QUERY_KEY, initialCheckoutState)
      checkoutRepository.clear()

      logger.info(
        {},
        `${LOG_NAMESPACE}: mutation.onSuccess [removeAll] — stores cleared`
      )
    },
    onError: (error, input) => {
      logger.error(
        { error, input },
        `${LOG_NAMESPACE}: mutation.onError [removeAll]`
      )
    }
  })
}

export const useCartClear = useCartRemoveAll
