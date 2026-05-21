'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import type { ApiCartResponse, RocketRezAddCouponRequest } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { useCartMutation } from './use-cart-mutation'

export type UseCartCouponAddInput = {
  coupon: string
}

export const useCartCouponAdd = (): UseMutationResult<
  ApiCartResponse,
  Error,
  UseCartCouponAddInput
> => {
  return useCartMutation<UseCartCouponAddInput>({
    endpoint: ROUTES.API.CART.COUPON.ADD,
    method: 'POST',
    includeBody: true,
    getBody: (input): RocketRezAddCouponRequest => ({
      coupon: input.coupon
    }),
    requireCartKey: true,
    onSuccessExtra: (data, input) => {
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [couponAdd]`
      )
    },
    onError: (error, input) => {
      logger.error(
        { error, input },
        `${LOG_NAMESPACE}: mutation.onError [couponAdd]`
      )
    }
  })
}
