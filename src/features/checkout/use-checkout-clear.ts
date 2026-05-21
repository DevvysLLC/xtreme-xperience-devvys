'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import { LOG_NAMESPACE } from './config'
import { CHECKOUT_QUERY_KEY } from './keys'
import { checkoutRepository, initialCheckoutState } from './repository'

export const useCheckoutClear = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      logger.info({}, `${LOG_NAMESPACE}: mutationFn [clear]`)
      qc.setQueryData(CHECKOUT_QUERY_KEY, initialCheckoutState)
      checkoutRepository.clear()
    },
    onMutate: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.onMutate [clear]`)
    },
    onSuccess: () => {
      logger.info({}, `${LOG_NAMESPACE}: mutation.onSuccess [clear]`)
    },
    onError: (error) => {
      logger.error({ error }, `${LOG_NAMESPACE}: mutation.onError [clear]`)
    }
  })
}
