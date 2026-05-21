'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import type { ApiCartResponse } from '../../io'
import { LOG_NAMESPACE } from './config'
import { useCartMutation } from './use-cart-mutation'

export const useCartContactRemove = (): UseMutationResult<
  ApiCartResponse,
  Error,
  number
> => {
  return useCartMutation<number>({
    endpoint: (contactId) => {
      const url = new URL(
        ROUTES.API.CART.CONTACT.REMOVE,
        window.location.origin
      )
      url.searchParams.set('contactId', String(contactId))
      return url.toString()
    },
    method: 'DELETE',
    requireCartKey: true,
    onSuccessExtra: (data, input) => {
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [contactRemove]`
      )
    },
    onError: (error, input) => {
      logger.error(
        { error, input },
        `${LOG_NAMESPACE}: mutation.onError [contactRemove]`
      )
    }
  })
}
