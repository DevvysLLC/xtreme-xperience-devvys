'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import type { CheckoutState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { CHECKOUT_QUERY_KEY } from './keys'
import { checkoutRepository, initialCheckoutState } from './repository'

export const useCheckoutSetError = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (error: string | null) => {
      logger.info({ error }, `${LOG_NAMESPACE}: mutationFn [setError]`)
      const base =
        qc.getQueryData<CheckoutState>(CHECKOUT_QUERY_KEY) ??
        initialCheckoutState
      const next: CheckoutState = { ...base, error }

      qc.setQueryData(CHECKOUT_QUERY_KEY, next)
      checkoutRepository.write(next)
      return next
    },
    onMutate: (error) => {
      logger.info({ error }, `${LOG_NAMESPACE}: mutation.onMutate [setError]`)
    },
    onSuccess: (data) => {
      logger.info({ data }, `${LOG_NAMESPACE}: mutation.onSuccess [setError]`)
    },
    onError: (error) => {
      logger.error({ error }, `${LOG_NAMESPACE}: mutation.onError [setError]`)
    }
  })
}
