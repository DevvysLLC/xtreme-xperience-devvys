'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logger } from '../../core/logger/logger'
import type {
  CheckoutState,
  CheckoutWizardPagePaymentInput
} from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { CHECKOUT_QUERY_KEY } from './keys'
import {
  applyPayment,
  checkoutRepository,
  initialCheckoutState
} from './repository'

export const useCheckoutSetPayment = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: CheckoutWizardPagePaymentInput) => {
      logger.info({ input }, `${LOG_NAMESPACE}: mutationFn [setPayment]`)
      const base =
        qc.getQueryData<CheckoutState>(CHECKOUT_QUERY_KEY) ??
        initialCheckoutState
      const next = applyPayment(base, {
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
      logger.info({ input }, `${LOG_NAMESPACE}: mutation.onMutate [setPayment]`)
    },
    onSuccess: (data) => {
      logger.info({ data }, `${LOG_NAMESPACE}: mutation.onSuccess [setPayment]`)
    },
    onError: (error) => {
      logger.error({ error }, `${LOG_NAMESPACE}: mutation.onError [setPayment]`)
    }
  })
}
