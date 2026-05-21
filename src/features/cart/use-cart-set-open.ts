'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { logger } from '../../core/logger/logger'
import type { CartState } from '../../io/types'
import { LOG_NAMESPACE } from './config'
import { CART_QUERY_KEY } from './keys'
import { initialCartState } from './repository'

export const useCartSetOpen = () => {
  const qc = useQueryClient()

  return useCallback(
    (isOpen: boolean) => {
      const base =
        qc.getQueryData<CartState>(CART_QUERY_KEY) ?? initialCartState
      qc.setQueryData<CartState>(CART_QUERY_KEY, { ...base, isOpen })
      logger.info({ isOpen }, `${LOG_NAMESPACE}: setOpen`)
    },
    [qc]
  )
}
