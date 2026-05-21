'use client'

/**
 * CartProvider — mounts once at the root layout and owns the cart refresh lifecycle.
 *
 * Flow:
 * 1. On mount, `useCartRefresh` reads `cartKey` from the cache (hydrated from
 *    localStorage by `useCartState`) and fires an API validation request.
 * 2. On route change, the cart refresh query is invalidated so the API is
 *    re-queried on every navigation — ensuring the user never sees an expired cart.
 * 3. On window focus, TanStack Query's default `refetchOnWindowFocus` behaviour
 *    re-validates automatically.
 * 4. If the API reports the cart as inactive or expired, `useCartRefresh` clears
 *    all stores (cart, checkout, booking) and the UI resets to an empty state.
 *
 * All components should call `useCart` to read cart data.  This provider is the
 * single mount point for `useCartRefresh` — it must never be called elsewhere to
 * avoid duplicate writes to the query cache and localStorage.
 */
import { useQueryClient } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { type FC, type ReactNode, useEffect, useRef } from 'react'
import { logger } from '../../core/logger/logger'
import { LOG_NAMESPACE } from './config'
import { CART_REFRESH_QUERY_KEY } from './keys'
import { useCartRefresh } from './use-cart-refresh'

type Props = {
  children: ReactNode
}

export const CartProvider: FC<Props> = ({ children }) => {
  useCartRefresh()

  const qc = useQueryClient()
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    logger.info(
      { pathname },
      `${LOG_NAMESPACE}: CartProvider — route change, invalidating cart refresh`
    )
    void qc.invalidateQueries({ queryKey: CART_REFRESH_QUERY_KEY })
  }, [pathname, qc])

  return <>{children}</>
}
