import { logger } from '../../core/logger/logger'
import {
  CheckoutStateSchema,
  PersistedCheckoutStateSchema
} from '../../io/schemas'
import type { CheckoutState, PersistedCheckoutState } from '../../io/types'
import { CHECKOUT_STORAGE_KEY, LOG_NAMESPACE } from './config'

export const initialCheckoutState: CheckoutState = {
  details: null,
  payment: null,
  error: null
}

const safeParseJson = (raw: string): unknown => {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const toPersistedState = (state: CheckoutState): PersistedCheckoutState => ({
  details: state.details,
  payment: state.payment
})

const readFromStorage = (): CheckoutState => {
  const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY)

  if (!raw) {
    logger.info(
      {},
      `${LOG_NAMESPACE}: repo.read — no data in storage, returning initial state`
    )
    return initialCheckoutState
  }

  const parsed = safeParseJson(raw)
  const result = PersistedCheckoutStateSchema.safeParse(parsed)

  if (!result.success) {
    logger.warn(
      { issues: result.error.issues },
      `${LOG_NAMESPACE}: repo.read — invalid data in storage, resetting to initial state`
    )
    localStorage.setItem(
      CHECKOUT_STORAGE_KEY,
      JSON.stringify(toPersistedState(initialCheckoutState))
    )
    return initialCheckoutState
  }

  return { ...result.data, error: null }
}

const writeToStorage = (state: CheckoutState): void => {
  const persisted = toPersistedState(state)
  const result = PersistedCheckoutStateSchema.safeParse(persisted)

  if (!result.success) {
    logger.warn(
      { issues: result.error.issues },
      `${LOG_NAMESPACE}: repo.write — validation failed, skipping write`
    )
    return
  }

  localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(result.data))
  logger.info(
    { hasDetails: !!result.data.details, hasPayment: !!result.data.payment },
    `${LOG_NAMESPACE}: repo.write — state persisted`
  )
}

export type CheckoutRepository = {
  read: () => CheckoutState
  write: (next: CheckoutState) => void
  clear: () => void
}

export const checkoutRepository: CheckoutRepository = {
  read: () => {
    const data = readFromStorage()
    logger.info(
      { hasDetails: !!data.details, hasPayment: !!data.payment },
      `${LOG_NAMESPACE}: repo.read`
    )
    return data
  },
  write: (next) => {
    logger.info(
      { hasDetails: !!next.details, hasPayment: !!next.payment },
      `${LOG_NAMESPACE}: repo.write`
    )
    writeToStorage(next)
  },
  clear: () => {
    logger.info({}, `${LOG_NAMESPACE}: repo.clear`)
    localStorage.removeItem(CHECKOUT_STORAGE_KEY)
    logger.info({}, `${LOG_NAMESPACE}: repo.clear — storage removed`)
  }
}

export const applyDetails = (
  base: CheckoutState,
  details: CheckoutState['details']
): CheckoutState => {
  const result = CheckoutStateSchema.shape.details.safeParse(details)
  if (!result.success) {
    logger.warn(
      { issues: result.error.issues },
      `${LOG_NAMESPACE}: applyDetails — validation failed`
    )
    return {
      ...base,
      error: `Invalid details data: ${result.error.issues.map((i) => i.message).join(', ')}`
    }
  }
  return { ...base, details: result.data, error: null }
}

export const applyPayment = (
  base: CheckoutState,
  payment: CheckoutState['payment']
): CheckoutState => {
  const result = CheckoutStateSchema.shape.payment.safeParse(payment)
  if (!result.success) {
    logger.warn(
      { issues: result.error.issues },
      `${LOG_NAMESPACE}: applyPayment — validation failed`
    )
    return {
      ...base,
      error: `Invalid payment data: ${result.error.issues.map((i) => i.message).join(', ')}`
    }
  }
  return { ...base, payment: result.data, error: null }
}
