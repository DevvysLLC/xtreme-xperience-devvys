'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { ROUTES } from '../../config/routes'
import { logger } from '../../core/logger/logger'
import type { ApiCartResponse, RocketRezAddContactsRequest } from '../../io'
import { LOG_NAMESPACE } from './config'
import { useCartMutation } from './use-cart-mutation'

export type UseCartContactUpdateParams = {
  contactId: number
  request: RocketRezAddContactsRequest
}

export const useCartContactUpdate = (): UseMutationResult<
  ApiCartResponse,
  Error,
  UseCartContactUpdateParams
> => {
  return useCartMutation<UseCartContactUpdateParams>({
    endpoint: (params) => {
      const url = new URL(
        ROUTES.API.CART.CONTACT.UPDATE,
        window.location.origin
      )
      url.searchParams.set('contactId', String(params.contactId))
      return url.toString()
    },
    method: 'PATCH',
    includeBody: true,
    getBody: (params) => params.request,
    requireCartKey: true,
    onSuccessExtra: (data, input) => {
      logger.info(
        { data, input },
        `${LOG_NAMESPACE}: mutation.onSuccess [contactUpdate]`
      )
    },
    onError: (error, input) => {
      logger.error(
        { error, input },
        `${LOG_NAMESPACE}: mutation.onError [contactUpdate]`
      )
    }
  })
}
