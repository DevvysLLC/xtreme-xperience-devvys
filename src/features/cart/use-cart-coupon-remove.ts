'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import type { ApiCartResponse } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { useCartMutation } from './use-cart-mutation'

export type UseCartCouponRemoveInput = {
  id: number
}

export const useCartCouponRemove = (): UseMutationResult<
  ApiCartResponse,
  Error,
  UseCartCouponRemoveInput
> => {
  return useCartMutation<UseCartCouponRemoveInput>({
    endpoint: (input) =>
      `${ROUTES.API.CART.COUPON.REMOVE}?couponId=${input.id}`,
    method: 'DELETE',
    requireCartKey: true,
    onSuccessExtra: (data, input) => {
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [couponRemove]`
      )
    },
    onError: (error, input) => {
      logger.error(
        { error, input },
        `${LOG_NAMESPACE}: mutation.onError [couponRemove]`
      )
    }
  })
}
