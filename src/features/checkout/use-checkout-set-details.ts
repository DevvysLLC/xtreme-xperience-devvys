'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import type {
  CheckoutState,
  CheckoutWizardPageDetailsInput
} from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { CHECKOUT_QUERY_KEY } from './keys'
import {
  applyDetails,
  checkoutRepository,
  initialCheckoutState
} from './repository'

export const useCheckoutSetDetails = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: CheckoutWizardPageDetailsInput) => {
      logger.info({ input }, `${LOG_NAMESPACE}: mutationFn [setDetails]`)
      const base =
        qc.getQueryData<CheckoutState>(CHECKOUT_QUERY_KEY) ??
        initialCheckoutState
      const next = applyDetails(base, {
        ...input,
        lastSubmittedAt: new Date().toISOString()
      })

      if (next.error) {
        throw new Error(next.error)
      }

      qc.setQueryData(CHECKOUT_QUERY_KEY, next)
      checkoutRepository.write(next)
      return next
    },
    onMutate: (input) => {
      logger.info({ input }, `${LOG_NAMESPACE}: mutation.onMutate [setDetails]`)
    },
    onSuccess: (data) => {
      logger.info({ data }, `${LOG_NAMESPACE}: mutation.onSuccess [setDetails]`)
    },
    onError: (error) => {
      logger.error({ error }, `${LOG_NAMESPACE}: mutation.onError [setDetails]`)
    }
  })
}
