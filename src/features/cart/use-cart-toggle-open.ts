'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { logger } from '../../core/logger/logger'
import type { CartState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { initialCartState } from './repository'

export const useCartToggleOpen = () => {
  const qc = useQueryClient()

  return useCallback(() => {
    const base = qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
    qc.setQueryData<CartState>(CART_QUERY_KEY, {
      ...base,
      isOpen: !base.isOpen
    })
    logger.info({ isOpen: !base.isOpen }, `${LOG_NAMESPACE}: toggleOpen`)
  }, [qc])
}
