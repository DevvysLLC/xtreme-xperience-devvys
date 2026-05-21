import { logger } from '../../core/logger/logger'
import { PersistedCartStateSchema } from '../../io/schemas'
import type { CartState, PersistedCartState } from '../../io/types'
import { CART_STORAGE_KEY, LOG_NAMESPACE } from './config'

export const initialCartState: CartState = {
  cartKey: null,
  tokenExpiry: null,
  cartData: null,
  metadata: [],
  chooseOnDriveDay: false,
  timerStartedAt: null,
  isOpen: false,
  isLoading: false,
  isMutating: false,
  isInitializing: false,
  error: null
}

const safeParseJson = (raw: string): unknown => {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const normalizeCartData = (
  cartData: CartState['cartData']
): CartState['cartData'] => {
  if (!cartData) {
    return null
  }

  return {
    ...cartData,
    houseServiceCharges: cartData.houseServiceCharges ?? [],
    lineItems: (cartData.lineItems ?? []).map((lineItem) => ({
      ...lineItem,
      houseServiceChargeTotal: lineItem.houseServiceChargeTotal ?? 0,
      houseServiceCharges: lineItem.houseServiceCharges ?? []
    }))
  }
}

const toPersistedState = (state: CartState): PersistedCartState => ({
  cartKey: state.cartKey ?? null,
  tokenExpiry: state.tokenExpiry ?? null,
  cartData: normalizeCartData(state.cartData),
  metadata: state.metadata,
  chooseOnDriveDay: state.chooseOnDriveDay,
  timerStartedAt: state.timerStartedAt ?? null
})

const readFromStorage = (): CartState => {
  const raw = localStorage.getItem(CART_STORAGE_KEY)

  if (!raw) {
    logger.info(
      {},
      `${LOG_NAMESPACE}: repo.read — no data in storage, returning initial state`
    )
    return initialCartState
  }

  const parsed = safeParseJson(raw)
  const result = PersistedCartStateSchema.safeParse(parsed)

  if (!result.success) {
    logger.warn(
      { issues: result.error.issues },
      `${LOG_NAMESPACE}: repo.read — invalid data in storage, resetting to initial state`
    )
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(toPersistedState(initialCartState))
    )
    return initialCartState
  }

  return {
    ...initialCartState,
    ...result.data,
    cartData: normalizeCartData(result.data.cartData ?? null)
  }
}

const writeToStorage = (state: CartState): void => {
  const persisted = toPersistedState(state)
  const result = PersistedCartStateSchema.safeParse(persisted)

  if (!result.success) {
    logger.warn(
      { issues: result.error.issues },
      `${LOG_NAMESPACE}: repo.write — validation failed, skipping write`
    )
    return
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(result.data))
  logger.info(
    {
      hasCartKey: !!result.data.cartKey,
      itemCount: result.data.cartData?.lineItems?.length ?? 0
    },
    `${LOG_NAMESPACE}: repo.write — state persisted`
  )
}

export type CartRepository = {
  read: () => CartState
  write: (next: CartState) => void
  clear: () => void
}

export const cartRepository: CartRepository = {
  read: () => {
    const data = readFromStorage()
    logger.info(
      {
        hasCartKey: !!data.cartKey,
        itemCount: data.cartData?.lineItems?.length ?? 0
      },
      `${LOG_NAMESPACE}: repo.read`
    )
    return data
  },
  write: (next) => {
    logger.info(
      {
        hasCartKey: !!next.cartKey,
        itemCount: next.cartData?.lineItems?.length ?? 0
      },
      `${LOG_NAMESPACE}: repo.write`
    )
    writeToStorage(next)
  },
  clear: () => {
    logger.info({}, `${LOG_NAMESPACE}: repo.clear`)
    localStorage.removeItem(CART_STORAGE_KEY)
    logger.info({}, `${LOG_NAMESPACE}: repo.clear — storage removed`)
  }
}
