'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import type { ApiCartResponse, RocketRezAddContactsRequest } from '../../io'
import { LOG_NAMESPACE } from './config'
import { useCartMutation } from './use-cart-mutation'

export const useCartContactAdd = (): UseMutationResult<
  ApiCartResponse,
  Error,
  RocketRezAddContactsRequest
> => {
  return useCartMutation<RocketRezAddContactsRequest>({
    endpoint: ROUTES.API.CART.CONTACT.ADD,
    method: 'POST',
    includeBody: true,
    requireCartKey: true,
    onSuccessExtra: (data, input) => {
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [contactAdd]`
      )
    },
    onError: (error, input) => {
      logger.error(
        { error, input },
        `${LOG_NAMESPACE}: mutation.onError [contactAdd]`
      )
    }
  })
}
